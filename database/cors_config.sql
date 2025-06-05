-- Criar função para gerenciar CORS no schema public
CREATE OR REPLACE FUNCTION public.handle_cors() 
RETURNS trigger AS $$
BEGIN
    -- Adicionar headers CORS à resposta
    PERFORM set_config('response.headers', 
        jsonb_build_object(
            'Access-Control-Allow-Origin', 'https://cleunir10.github.io',
            'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, Origin, X-Requested-With',
            'Access-Control-Allow-Credentials', 'true'
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
        EXECUTE format('
            DROP TRIGGER IF EXISTS handle_cors_trigger ON public.%I;
            CREATE TRIGGER handle_cors_trigger
            BEFORE INSERT OR UPDATE OR DELETE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_cors();
        ', tbl, tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para habilitar CORS em todas as tabelas
SELECT public.enable_cors_all_tables();

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
