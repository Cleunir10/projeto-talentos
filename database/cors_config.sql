-- Criar função para gerenciar CORS no schema public
CREATE OR REPLACE FUNCTION public.handle_cors() 
RETURNS trigger AS $$
BEGIN
    -- Adicionar headers CORS à resposta com suporte a autenticação
    PERFORM set_config('response.headers', 
        jsonb_build_object(
            'Access-Control-Allow-Origin', COALESCE(current_setting('request.header.origin', true), '*'),
            'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers', 'Authorization, X-Client-Info, Content-Type, Accept, Origin, X-Requested-With, apikey, Prefer',
            'Access-Control-Allow-Credentials', 'true',
            'Access-Control-Expose-Headers', 'Content-Range, Range',
            'Access-Control-Max-Age', '3600'
        )::text,
        false
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para todas as tabelas no schema public
CREATE OR REPLACE FUNCTION public.enable_cors_all_tables() 
RETURNS void AS $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        -- Remover trigger existente se houver
        EXECUTE format('DROP TRIGGER IF EXISTS handle_cors_trigger ON public.%I', tbl);
        
        -- Criar novo trigger
        EXECUTE format('
            CREATE TRIGGER handle_cors_trigger
            AFTER SELECT OR INSERT OR UPDATE OR DELETE OR TRUNCATE
            ON public.%I
            FOR EACH STATEMENT
            EXECUTE FUNCTION public.handle_cors();
        ', tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para habilitar CORS em todas as tabelas
SELECT public.enable_cors_all_tables();

-- Criar função para verificar status de autenticação
CREATE OR REPLACE FUNCTION public.check_auth_status()
RETURNS jsonb AS $$
BEGIN
    RETURN jsonb_build_object(
        'authenticated', (auth.role() = 'authenticated'),
        'role', auth.role(),
        'user_id', auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar política de RLS para permitir acesso anônimo
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo aos produtos"
ON public.produtos
FOR SELECT
TO anon
USING (true);

-- Configurar permissões básicas
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.produtos TO anon;
