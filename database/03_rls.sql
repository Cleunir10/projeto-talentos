-- Talentos Marketplace - Políticas de Segurança RLS (Row Level Security)
-- Controle de acesso baseado em usuário

-- =======================================================
-- 1. HABILITAR RLS NAS TABELAS PRINCIPAIS
-- =======================================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.costureiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_variacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes_costureira ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrinho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- =======================================================
-- 2. FUNÇÕES AUXILIARES PARA RLS
-- =======================================================

-- Função para obter o ID do usuário atual
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT auth.user_id;
$$ LANGUAGE SQL STABLE;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Função para verificar se é costureira
CREATE OR REPLACE FUNCTION is_costureira() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'costureira'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Função para verificar se é cliente
CREATE OR REPLACE FUNCTION is_cliente() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'cliente'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- =======================================================
-- 3. POLÍTICAS PARA PROFILES
-- =======================================================

-- Usuários podem ver seus próprios perfis
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Perfis de costureiras são públicos (para catálogo)
CREATE POLICY "Costureira profiles are public" ON public.profiles
    FOR SELECT USING (tipo_usuario = 'costureira');

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (is_admin());

-- =======================================================
-- 4. POLÍTICAS PARA ENDEREÇOS
-- =======================================================

-- Usuários podem gerenciar seus próprios endereços
CREATE POLICY "Users can manage own addresses" ON public.enderecos
    FOR ALL USING (auth.uid() = user_id);

-- Admins podem ver todos os endereços
CREATE POLICY "Admins can view all addresses" ON public.enderecos
    FOR SELECT USING (is_admin());

-- =======================================================
-- 5. POLÍTICAS PARA COSTUREIRAS
-- =======================================================

-- Costureiras podem gerenciar seus próprios dados
CREATE POLICY "Costureiras can manage own data" ON public.costureiras
    FOR ALL USING (auth.uid() = id);

-- Dados públicos das costureiras são visíveis
CREATE POLICY "Public costureira data visible" ON public.costureiras
    FOR SELECT USING (true);

-- =======================================================
-- 6. POLÍTICAS PARA PRODUTOS
-- =======================================================

-- Produtos ativos são públicos
CREATE POLICY "Active products are public" ON public.produtos
    FOR SELECT USING (status = 'ativo');

-- Costureiras podem gerenciar seus próprios produtos
CREATE POLICY "Costureiras can manage own products" ON public.produtos
    FOR ALL USING (auth.uid() = costureira_id);

-- Admins podem gerenciar todos os produtos
CREATE POLICY "Admins can manage all products" ON public.produtos
    FOR ALL USING (is_admin());

-- =======================================================
-- 7. POLÍTICAS PARA IMAGENS E VARIAÇÕES DE PRODUTOS
-- =======================================================

-- Imagens de produtos são públicas
CREATE POLICY "Product images are public" ON public.produto_imagens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.produtos p 
            WHERE p.id = produto_id AND p.status = 'ativo'
        )
    );

-- Costureiras podem gerenciar imagens de seus produtos
CREATE POLICY "Costureiras can manage own product images" ON public.produto_imagens
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.produtos p 
            WHERE p.id = produto_id AND p.costureira_id = auth.uid()
        )
    );

-- Variações de produtos são públicas
CREATE POLICY "Product variations are public" ON public.produto_variacoes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.produtos p 
            WHERE p.id = produto_id AND p.status = 'ativo'
        )
    );

-- Costureiras podem gerenciar variações de seus produtos
CREATE POLICY "Costureiras can manage own product variations" ON public.produto_variacoes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.produtos p 
            WHERE p.id = produto_id AND p.costureira_id = auth.uid()
        )
    );

-- =======================================================
-- 8. POLÍTICAS PARA PEDIDOS
-- =======================================================

-- Clientes podem ver seus próprios pedidos
CREATE POLICY "Clients can view own orders" ON public.pedidos
    FOR SELECT USING (auth.uid() = cliente_id);

-- Clientes podem criar pedidos
CREATE POLICY "Clients can create orders" ON public.pedidos
    FOR INSERT WITH CHECK (auth.uid() = cliente_id AND is_cliente());

-- Clientes podem atualizar pedidos em status específicos
CREATE POLICY "Clients can update own orders" ON public.pedidos
    FOR UPDATE USING (
        auth.uid() = cliente_id AND 
        status IN ('pendente', 'cancelado')
    );

-- Costureiras podem ver pedidos que contenham seus produtos
CREATE POLICY "Costureiras can view relevant orders" ON public.pedidos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pedido_itens pi 
            WHERE pi.pedido_id = id AND pi.costureira_id = auth.uid()
        )
    );

-- Admins podem gerenciar todos os pedidos
CREATE POLICY "Admins can manage all orders" ON public.pedidos
    FOR ALL USING (is_admin());

-- =======================================================
-- 9. POLÍTICAS PARA ITENS DO PEDIDO
-- =======================================================

-- Clientes podem ver itens de seus pedidos
CREATE POLICY "Clients can view own order items" ON public.pedido_itens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pedidos p 
            WHERE p.id = pedido_id AND p.cliente_id = auth.uid()
        )
    );

-- Costureiras podem ver e atualizar itens de seus produtos
CREATE POLICY "Costureiras can manage own product items" ON public.pedido_itens
    FOR ALL USING (auth.uid() = costureira_id);

-- =======================================================
-- 10. POLÍTICAS PARA AVALIAÇÕES
-- =======================================================

-- Avaliações de produtos são públicas (leitura)
CREATE POLICY "Product reviews are public" ON public.avaliacoes_produto
    FOR SELECT USING (true);

-- Clientes podem criar avaliações de produtos que compraram
CREATE POLICY "Clients can create product reviews" ON public.avaliacoes_produto
    FOR INSERT WITH CHECK (
        auth.uid() = cliente_id AND
        EXISTS (
            SELECT 1 FROM public.pedido_itens pi
            JOIN public.pedidos p ON p.id = pi.pedido_id
            WHERE pi.produto_id = avaliacoes_produto.produto_id 
            AND p.cliente_id = auth.uid()
            AND p.status = 'entregue'
        )
    );

-- Clientes podem editar suas próprias avaliações
CREATE POLICY "Clients can edit own reviews" ON public.avaliacoes_produto
    FOR UPDATE USING (auth.uid() = cliente_id);

-- Avaliações de costureiras são públicas (leitura)
CREATE POLICY "Costureira reviews are public" ON public.avaliacoes_costureira
    FOR SELECT USING (true);

-- Clientes podem avaliar costureiras de pedidos entregues
CREATE POLICY "Clients can review costureiras" ON public.avaliacoes_costureira
    FOR INSERT WITH CHECK (
        auth.uid() = cliente_id AND
        EXISTS (
            SELECT 1 FROM public.pedidos p 
            WHERE p.id = pedido_id 
            AND p.cliente_id = auth.uid()
            AND p.status = 'entregue'
        )
    );

-- =======================================================
-- 11. POLÍTICAS PARA FAVORITOS E CARRINHO
-- =======================================================

-- Usuários podem gerenciar seus próprios favoritos
CREATE POLICY "Users can manage own favorites" ON public.favoritos
    FOR ALL USING (auth.uid() = user_id);

-- Usuários podem gerenciar seu próprio carrinho
CREATE POLICY "Users can manage own cart" ON public.carrinho
    FOR ALL USING (auth.uid() = user_id);

-- =======================================================
-- 12. POLÍTICAS PARA COMUNICAÇÃO
-- =======================================================

-- Usuários podem ver conversas em que participam
CREATE POLICY "Users can view own conversations" ON public.conversas
    FOR SELECT USING (
        auth.uid() = cliente_id OR auth.uid() = costureira_id
    );

-- Clientes e costureiras podem criar conversas
CREATE POLICY "Users can create conversations" ON public.conversas
    FOR INSERT WITH CHECK (
        auth.uid() = cliente_id OR auth.uid() = costureira_id
    );

-- Usuários podem ver mensagens de suas conversas
CREATE POLICY "Users can view own messages" ON public.mensagens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversas c 
            WHERE c.id = conversa_id 
            AND (c.cliente_id = auth.uid() OR c.costureira_id = auth.uid())
        )
    );

-- Usuários podem criar mensagens em suas conversas
CREATE POLICY "Users can create messages" ON public.mensagens
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversas c 
            WHERE c.id = conversa_id 
            AND (c.cliente_id = auth.uid() OR c.costureira_id = auth.uid())
        ) AND
        auth.uid() = remetente_id
    );

-- =======================================================
-- 13. POLÍTICAS PARA NOTIFICAÇÕES
-- =======================================================

-- Usuários podem ver suas próprias notificações
CREATE POLICY "Users can view own notifications" ON public.notificacoes
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem atualizar suas notificações (marcar como lida)
CREATE POLICY "Users can update own notifications" ON public.notificacoes
    FOR UPDATE USING (auth.uid() = user_id);

-- Sistema pode criar notificações
CREATE POLICY "System can create notifications" ON public.notificacoes
    FOR INSERT WITH CHECK (true);

-- =======================================================
-- 14. POLÍTICAS PARA CATEGORIAS (PÚBLICAS)
-- =======================================================

-- Categorias são públicas para leitura
CREATE POLICY "Categories are public" ON public.categorias
    FOR SELECT USING (ativa = true);

-- Apenas admins podem gerenciar categorias
CREATE POLICY "Only admins can manage categories" ON public.categorias
    FOR ALL USING (is_admin());

-- =======================================================
-- 15. GRANT PERMISSIONS
-- =======================================================

-- Conceder permissões básicas para usuários autenticados
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Conceder permissões para usuários anônimos (apenas leitura de dados públicos)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.produtos TO anon;
GRANT SELECT ON public.produto_imagens TO anon;
GRANT SELECT ON public.produto_variacoes TO anon;
GRANT SELECT ON public.categorias TO anon;
GRANT SELECT ON public.avaliacoes_produto TO anon;
GRANT SELECT ON public.avaliacoes_costureira TO anon;
