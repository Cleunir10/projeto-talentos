-- Políticas de Segurança para a tabela produtos

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura anônima (sem autenticação)
CREATE POLICY "Permitir leitura anônima de produtos" ON public.produtos
    FOR SELECT
    TO anon
    USING (true);

-- Política para permitir leitura autenticada
CREATE POLICY "Permitir leitura autenticada de produtos" ON public.produtos
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para permitir inserção apenas por usuários autenticados
CREATE POLICY "Permitir inserção por usuários autenticados" ON public.produtos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Política para permitir atualização apenas por usuários autenticados
CREATE POLICY "Permitir atualização por usuários autenticados" ON public.produtos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política para permitir deleção apenas por usuários autenticados
CREATE POLICY "Permitir deleção por usuários autenticados" ON public.produtos
    FOR DELETE
    TO authenticated
    USING (true);

-- Função para verificar se o usuário está autenticado
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
