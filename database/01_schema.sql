-- Talentos Marketplace - Schema do Banco de Dados Supabase
-- Sistema de marketplace de moda sustentável conectando artesãs e clientes

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================================================
-- 1. TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- =======================================================

-- Tabela de perfis de usuários (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE,
    foto_perfil TEXT,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('costureira', 'cliente', 'admin')),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de endereços
CREATE TABLE public.enderecos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo VARCHAR(20) DEFAULT 'principal' CHECK (tipo IN ('principal', 'entrega', 'cobranca')),
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Brasil',
    is_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela específica para costureiras
CREATE TABLE public.costureiras (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    especialidades TEXT[], -- Array de especialidades
    experiencia_anos INTEGER,
    portfolio_url TEXT,
    certificacoes TEXT[],
    avaliacoes_media DECIMAL(3,2) DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    comissao_plataforma DECIMAL(5,2) DEFAULT 10.00, -- Percentual de comissão
    dados_bancarios JSONB, -- Dados bancários criptografados
    verificada BOOLEAN DEFAULT FALSE,
    data_verificacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- 2. TABELAS DE PRODUTOS E CATÁLOGO
-- =======================================================

-- Tabela de categorias
CREATE TABLE public.categorias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    categoria_pai UUID REFERENCES public.categorias(id),
    slug VARCHAR(100) UNIQUE NOT NULL,
    icone VARCHAR(50),
    ativa BOOLEAN DEFAULT TRUE,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE public.produtos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    costureira_id UUID REFERENCES public.costureiras(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES public.categorias(id),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    descricao_curta VARCHAR(500),
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    preco_promocional DECIMAL(10,2) CHECK (preco_promocional > 0),
    sku VARCHAR(50) UNIQUE,
    estoque INTEGER DEFAULT 0 CHECK (estoque >= 0),
    peso DECIMAL(8,3), -- Peso em kg
    dimensoes JSONB, -- {largura, altura, profundidade} em cm
    materiais TEXT[], -- Array de materiais utilizados
    cores_disponiveis TEXT[],
    tamanhos_disponiveis TEXT[],
    tempo_producao INTEGER DEFAULT 7, -- Dias para produção
    produto_personalizado BOOLEAN DEFAULT FALSE,
    sustentavel BOOLEAN DEFAULT TRUE,
    origem_materiais TEXT, -- Descrição da origem dos materiais
    tecnicas_utilizadas TEXT[],
    cuidados_conservacao TEXT,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pausado', 'esgotado')),
    destaque BOOLEAN DEFAULT FALSE,
    visualizacoes INTEGER DEFAULT 0,
    vendas_total INTEGER DEFAULT 0,
    avaliacoes_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens dos produtos
CREATE TABLE public.produto_imagens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    url_imagem TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_principal BOOLEAN DEFAULT FALSE,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de variações de produtos (cores, tamanhos, etc.)
CREATE TABLE public.produto_variacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    estoque INTEGER DEFAULT 0,
    sku_variacao VARCHAR(50),
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- 3. TABELAS DE VENDAS E PEDIDOS
-- =======================================================

-- Tabela de pedidos
CREATE TABLE public.pedidos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES public.profiles(id),
    status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN (
        'pendente', 'confirmado', 'pago', 'em_producao', 
        'pronto', 'enviado', 'entregue', 'cancelado', 'devolvido'
    )),
    subtotal DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0,
    frete DECIMAL(10,2) DEFAULT 0,
    taxa_plataforma DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Dados de entrega
    endereco_entrega JSONB NOT NULL,
    metodo_envio VARCHAR(50),
    codigo_rastreamento VARCHAR(100),
    previsao_entrega DATE,
    data_envio TIMESTAMP WITH TIME ZONE,
    data_entrega TIMESTAMP WITH TIME ZONE,
    
    -- Dados de pagamento
    metodo_pagamento VARCHAR(50),
    status_pagamento VARCHAR(30) DEFAULT 'pendente' CHECK (status_pagamento IN (
        'pendente', 'processando', 'aprovado', 'rejeitado', 'estornado'
    )),
    id_pagamento_externo VARCHAR(100),
    
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE public.pedido_itens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id),
    costureira_id UUID REFERENCES public.costureiras(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL,
    preco_total DECIMAL(10,2) NOT NULL,
    variacoes JSONB, -- Variações selecionadas (cor, tamanho, etc.)
    personalizacoes TEXT,
    status_item VARCHAR(30) DEFAULT 'pendente' CHECK (status_item IN (
        'pendente', 'confirmado', 'em_producao', 'pronto', 'enviado', 'entregue', 'cancelado'
    )),
    tempo_producao_estimado INTEGER,
    data_inicio_producao TIMESTAMP WITH TIME ZONE,
    data_conclusao_producao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- 4. TABELAS DE AVALIAÇÕES E INTERAÇÕES
-- =======================================================

-- Tabela de avaliações de produtos
CREATE TABLE public.avaliacoes_produto (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.profiles(id),
    pedido_item_id UUID REFERENCES public.pedido_itens(id),
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    titulo VARCHAR(200),
    comentario TEXT,
    fotos TEXT[], -- URLs das fotos da avaliação
    verificada BOOLEAN DEFAULT FALSE, -- Se é de uma compra verificada
    util_count INTEGER DEFAULT 0, -- Quantas pessoas acharam útil
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(pedido_item_id, cliente_id) -- Uma avaliação por item por cliente
);

-- Tabela de avaliações de costureiras
CREATE TABLE public.avaliacoes_costureira (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    costureira_id UUID REFERENCES public.costureiras(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.profiles(id),
    pedido_id UUID REFERENCES public.pedidos(id),
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    aspectos JSONB, -- {qualidade, atendimento, prazo, comunicacao}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(pedido_id, cliente_id) -- Uma avaliação por pedido por cliente
);

-- Tabela de favoritos
CREATE TABLE public.favoritos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, produto_id)
);

-- Tabela de carrinho de compras
CREATE TABLE public.carrinho (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    variacoes JSONB,
    personalizacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, produto_id) -- Assumindo que variações são únicas por produto
);

-- =======================================================
-- 5. TABELAS DE COMUNICAÇÃO E SUPORTE
-- =======================================================

-- Tabela de conversas entre clientes e costureiras
CREATE TABLE public.conversas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES public.profiles(id),
    costureira_id UUID REFERENCES public.profiles(id),
    produto_id UUID REFERENCES public.produtos(id),
    pedido_id UUID REFERENCES public.pedidos(id),
    assunto VARCHAR(200),
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'arquivada', 'fechada')),
    ultima_mensagem_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE public.mensagens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversa_id UUID REFERENCES public.conversas(id) ON DELETE CASCADE,
    remetente_id UUID REFERENCES public.profiles(id),
    conteudo TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagem', 'arquivo')),
    anexos TEXT[], -- URLs dos anexos
    lida BOOLEAN DEFAULT FALSE,
    lida_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE public.notificacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    dados JSONB, -- Dados adicionais da notificação
    lida BOOLEAN DEFAULT FALSE,
    lida_em TIMESTAMP WITH TIME ZONE,
    url_acao VARCHAR(500), -- URL para ação relacionada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- 6. TABELAS DE CONFIGURAÇÕES E LOGS
-- =======================================================

-- Tabela de configurações da plataforma
CREATE TABLE public.configuracoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    descricao TEXT,
    categoria VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de atividades
CREATE TABLE public.logs_atividade (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    acao VARCHAR(100) NOT NULL,
    tabela_afetada VARCHAR(50),
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =======================================================

-- Índices para produtos
CREATE INDEX idx_produtos_costureira ON public.produtos(costureira_id);
CREATE INDEX idx_produtos_categoria ON public.produtos(categoria_id);
CREATE INDEX idx_produtos_status ON public.produtos(status);
CREATE INDEX idx_produtos_destaque ON public.produtos(destaque) WHERE destaque = true;
CREATE INDEX idx_produtos_nome_busca ON public.produtos USING gin(to_tsvector('portuguese', nome || ' ' || descricao));

-- Índices para pedidos
CREATE INDEX idx_pedidos_cliente ON public.pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON public.pedidos(status);
CREATE INDEX idx_pedidos_data ON public.pedidos(created_at);
CREATE INDEX idx_pedido_itens_costureira ON public.pedido_itens(costureira_id);

-- Índices para avaliações
CREATE INDEX idx_avaliacoes_produto ON public.avaliacoes_produto(produto_id);
CREATE INDEX idx_avaliacoes_costureira ON public.avaliacoes_costureira(costureira_id);

-- Índices para endereços
CREATE INDEX idx_enderecos_user ON public.enderecos(user_id);
CREATE INDEX idx_enderecos_principal ON public.enderecos(user_id, is_principal) WHERE is_principal = true;

-- =======================================================
-- 8. COMENTÁRIOS FINAIS
-- =======================================================

-- Adicionar comentários nas tabelas principais
COMMENT ON TABLE public.profiles IS 'Perfis de usuários do marketplace';
COMMENT ON TABLE public.costureiras IS 'Dados específicos das artesãs/costureiras';
COMMENT ON TABLE public.produtos IS 'Catálogo de produtos sustentáveis';
COMMENT ON TABLE public.pedidos IS 'Pedidos realizados no marketplace';
COMMENT ON TABLE public.avaliacoes_produto IS 'Avaliações dos produtos pelos clientes';
COMMENT ON TABLE public.avaliacoes_costureira IS 'Avaliações das costureiras pelos clientes';
