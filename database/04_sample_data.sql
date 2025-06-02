-- Talentos Marketplace - Dados de Exemplo
-- Inserção de dados iniciais para teste do sistema

-- =======================================================
-- 1. CONFIGURAÇÕES DA PLATAFORMA
-- =======================================================

INSERT INTO public.configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('plataforma_nome', 'Talentos Marketplace', 'string', 'Nome da plataforma', 'geral'),
('comissao_padrao', '10.00', 'number', 'Comissão padrão da plataforma (%)', 'financeiro'),
('frete_gratis_valor', '100.00', 'number', 'Valor mínimo para frete grátis', 'financeiro'),
('tempo_producao_padrao', '7', 'number', 'Tempo padrão de produção (dias)', 'operacional'),
('avaliacoes_minimas', '3', 'number', 'Mínimo de avaliações para exibir média', 'qualidade'),
('produto_maximo_imagens', '10', 'number', 'Máximo de imagens por produto', 'produto'),
('chat_timeout_minutos', '30', 'number', 'Timeout do chat em minutos', 'comunicacao');

-- =======================================================
-- 2. CATEGORIAS
-- =======================================================

INSERT INTO public.categorias (id, nome, descricao, slug, icone, ordem) VALUES
(uuid_generate_v4(), 'Bolsas e Carteiras', 'Bolsas, carteiras e acessórios de transporte sustentáveis', 'bolsas-carteiras', 'handbag', 1),
(uuid_generate_v4(), 'Roupas Renovadas', 'Roupas reformadas e renovadas com técnicas sustentáveis', 'roupas-renovadas', 'shirt', 2),
(uuid_generate_v4(), 'Acessórios', 'Bijuterias, cintos e outros acessórios artesanais', 'acessorios', 'star', 3),
(uuid_generate_v4(), 'Casa e Decoração', 'Itens para casa feitos com materiais reciclados', 'casa-decoracao', 'home', 4),
(uuid_generate_v4(), 'Infantil', 'Roupas e acessórios infantis sustentáveis', 'infantil', 'baby', 5);

-- =======================================================
-- 3. USUÁRIOS DE EXEMPLO
-- =======================================================

-- Inserir perfis (IDs simulados - em produção virão do Supabase Auth)
INSERT INTO public.profiles (id, email, nome_completo, telefone, tipo_usuario, bio) VALUES
-- Costureiras
('11111111-1111-1111-1111-111111111111', 'maria.silva@email.com', 'Maria Silva', '(11) 99999-1111', 'costureira', 'Artesã especializada em upcycling de jeans. Trabalho com sustentabilidade há mais de 10 anos.'),
('22222222-2222-2222-2222-222222222222', 'ana.ferreira@email.com', 'Ana Ferreira', '(11) 99999-2222', 'costureira', 'Criadora de bolsas e acessórios únicos com técnicas de patchwork e bordado.'),
('33333333-3333-3333-3333-333333333333', 'carla.santos@email.com', 'Carla Santos', '(11) 99999-3333', 'costureira', 'Especialista em renovação de roupas vintage e criação de peças exclusivas.'),
('44444444-4444-4444-4444-444444444444', 'julia.mendes@email.com', 'Julia Mendes', '(11) 99999-4444', 'costureira', 'Artesã focada em acessórios minimalistas e sustentáveis para uso diário.'),

-- Clientes
('55555555-5555-5555-5555-555555555555', 'cliente1@email.com', 'João Santos', '(11) 88888-1111', 'cliente', 'Apaixonado por moda sustentável e produtos artesanais únicos.'),
('66666666-6666-6666-6666-666666666666', 'cliente2@email.com', 'Fernanda Lima', '(11) 88888-2222', 'cliente', 'Busco sempre produtos que tenham história e respeitem o meio ambiente.'),
('77777777-7777-7777-7777-777777777777', 'cliente3@email.com', 'Carlos Oliveira', '(11) 88888-3333', 'cliente', 'Valorizo o trabalho artesanal e a economia circular.'),

-- Admin
('99999999-9999-9999-9999-999999999999', 'admin@talentos.com', 'Administrador Sistema', '(11) 99999-9999', 'admin', 'Administrador da plataforma Talentos Marketplace.');

-- =======================================================
-- 4. ENDEREÇOS DE EXEMPLO
-- =======================================================

INSERT INTO public.enderecos (user_id, tipo, cep, logradouro, numero, bairro, cidade, estado, is_principal) VALUES
-- Endereços das costureiras
('11111111-1111-1111-1111-111111111111', 'principal', '01234-567', 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', true),
('22222222-2222-2222-2222-222222222222', 'principal', '02345-678', 'Av. Sustentável', '456', 'Vila Verde', 'São Paulo', 'SP', true),
('33333333-3333-3333-3333-333333333333', 'principal', '03456-789', 'Rua Artesanal', '789', 'Bela Vista', 'São Paulo', 'SP', true),
('44444444-4444-4444-4444-444444444444', 'principal', '04567-890', 'Rua Minimalista', '321', 'Jardins', 'São Paulo', 'SP', true),

-- Endereços dos clientes
('55555555-5555-5555-5555-555555555555', 'principal', '05678-901', 'Av. Ecológica', '654', 'Mooca', 'São Paulo', 'SP', true),
('66666666-6666-6666-6666-666666666666', 'principal', '06789-012', 'Rua Verde', '987', 'Pinheiros', 'São Paulo', 'SP', true),
('77777777-7777-7777-7777-777777777777', 'principal', '07890-123', 'Rua Consciente', '147', 'Vila Madalena', 'São Paulo', 'SP', true);

-- =======================================================
-- 5. DADOS DAS COSTUREIRAS
-- =======================================================

INSERT INTO public.costureiras (id, especialidades, experiencia_anos, portfolio_url, certificacoes, verificada) VALUES
('11111111-1111-1111-1111-111111111111', 
 ARRAY['Upcycling', 'Jeans', 'Bolsas'], 
 12, 
 'https://portfolio-maria.com',
 ARRAY['Certificação em Sustentabilidade Têxtil', 'Curso de Upcycling Avançado'],
 true),

('22222222-2222-2222-2222-222222222222', 
 ARRAY['Patchwork', 'Bordado', 'Acessórios'], 
 8, 
 'https://portfolio-ana.com',
 ARRAY['Especialização em Patchwork', 'Curso de Bordado Artesanal'],
 true),

('33333333-3333-3333-3333-333333333333', 
 ARRAY['Roupas Vintage', 'Customização', 'Reformas'], 
 15, 
 'https://portfolio-carla.com',
 ARRAY['Especialista em Moda Vintage', 'Curso de Costura Sustentável'],
 true),

('44444444-4444-4444-4444-444444444444', 
 ARRAY['Minimalismo', 'Acessórios', 'Couro Vegano'], 
 6, 
 'https://portfolio-julia.com',
 ARRAY['Certificação em Couro Vegano', 'Design Minimalista'],
 true);

-- =======================================================
-- 6. PRODUTOS DE EXEMPLO
-- =======================================================

-- Obter IDs das categorias criadas
WITH categoria_bolsas AS (
    SELECT id FROM public.categorias WHERE slug = 'bolsas-carteiras' LIMIT 1
),
categoria_roupas AS (
    SELECT id FROM public.categorias WHERE slug = 'roupas-renovadas' LIMIT 1
),
categoria_acessorios AS (
    SELECT id FROM public.categorias WHERE slug = 'acessorios' LIMIT 1
)

INSERT INTO public.produtos (
    costureira_id, categoria_id, nome, descricao, descricao_curta, 
    preco, sku, estoque, materiais, cores_disponiveis, 
    tempo_producao, sustentavel, origem_materiais, tecnicas_utilizadas
) VALUES
-- Produtos da Maria Silva
('11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM categoria_bolsas), 
 'Bolsa Ecológica Jeans', 
 'Bolsa feita com calças jeans recicladas, forrada e com alças reforçadas. Produto único e sustentável, cada peça possui características próprias devido ao reaproveitamento de materiais. Ideal para uso diário, com compartimentos internos organizados.',
 'Bolsa espaçosa feita com jeans reciclado, design moderno e funcional.',
 75.90, 
 'BEJ001', 
 5, 
 ARRAY['Jeans reciclado', 'Forro de algodão orgânico', 'Zíper YKK'],
 ARRAY['Azul clássico', 'Azul delavê', 'Azul escuro'],
 7,
 true,
 'Jeans coletados de doações e brechós locais',
 ARRAY['Upcycling', 'Costura reforçada', 'Acabamento artesanal']),

('11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM categoria_bolsas), 
 'Mochila Jeans Sustentável', 
 'Mochila resistente produzida com reaproveitamento de jeans, com compartimentos organizados. Possui bolsos laterais para garrafa, compartimento acolchoado para notebook e sistema de fechamento seguro. Alças ajustáveis e reforçadas para máximo conforto.',
 'Mochila funcional com compartimentos, feita de jeans reciclado.',
 119.90, 
 'MJS001', 
 3, 
 ARRAY['Jeans reciclado', 'Acolchoamento eco-friendly', 'Fivelas metálicas'],
 ARRAY['Azul', 'Azul delavê'],
 10,
 true,
 'Jeans selecionados de alta qualidade para maior durabilidade',
 ARRAY['Upcycling', 'Costura técnica', 'Reforços estratégicos']),

-- Produtos da Ana Ferreira
('22222222-2222-2222-2222-222222222222', 
 (SELECT id FROM categoria_bolsas), 
 'Clutch Patchwork Jeans', 
 'Clutch elegante feita com retalhos de jeans em técnica patchwork, ideal para eventos. Cada peça é única, com combinações de tons e texturas que criam um visual sofisticado. Forro em tecido nobre e fechamento magnético discreto.',
 'Clutch sofisticada em patchwork de jeans, perfeita para ocasiões especiais.',
 65.00, 
 'CPJ001', 
 4, 
 ARRAY['Retalhos de jeans', 'Forro de seda', 'Fechamento magnético'],
 ARRAY['Mix azul', 'Tons variados'],
 5,
 true,
 'Retalhos selecionados de diferentes tonalidades de jeans',
 ARRAY['Patchwork', 'Bordado à mão', 'Acabamento de luxo']),

('22222222-2222-2222-2222-222222222222', 
 (SELECT id FROM categoria_acessorios), 
 'Necessaire Artesanal', 
 'Necessaire compacta e funcional, feita com técnicas de bordado tradicional em tecido de algodão orgânico. Ideal para viagens ou uso diário, com compartimentos internos e fechamento resistente à água.',
 'Necessaire prática com bordados artesanais únicos.',
 35.50, 
 'NAR001', 
 8, 
 ARRAY['Algodão orgânico', 'Fio de bordado', 'Zíper impermeável'],
 ARRAY['Cru com bordado azul', 'Cru com bordado verde'],
 3,
 true,
 'Algodão orgânico certificado de produtores locais',
 ARRAY['Bordado à mão', 'Costura francesa', 'Impermeabilização natural']);

-- =======================================================
-- 7. IMAGENS DOS PRODUTOS
-- =======================================================

-- Buscar IDs dos produtos para adicionar imagens
INSERT INTO public.produto_imagens (produto_id, url_imagem, alt_text, is_principal, ordem)
SELECT 
    p.id,
    CASE p.nome
        WHEN 'Bolsa Ecológica Jeans' THEN 'bolsa-ecologica-jeans.jpg'
        WHEN 'Mochila Jeans Sustentável' THEN 'mochila-jeans-sustentavel.jpg'
        WHEN 'Clutch Patchwork Jeans' THEN 'clutch-patchwork-jeans.jpg'
        WHEN 'Necessaire Artesanal' THEN 'placeholder.svg'
    END,
    'Imagem principal do produto ' || p.nome,
    true,
    1
FROM public.produtos p;

-- Adicionar imagens secundárias
INSERT INTO public.produto_imagens (produto_id, url_imagem, alt_text, is_principal, ordem)
SELECT 
    p.id,
    'placeholder.svg',
    'Imagem detalhe do produto ' || p.nome,
    false,
    2
FROM public.produtos p
WHERE p.nome IN ('Bolsa Ecológica Jeans', 'Mochila Jeans Sustentável');

-- =======================================================
-- 8. VARIAÇÕES DOS PRODUTOS
-- =======================================================

-- Variações de cor para Bolsa Ecológica Jeans
INSERT INTO public.produto_variacoes (produto_id, nome, valor, estoque)
SELECT 
    p.id,
    'Cor',
    unnest(ARRAY['Azul clássico', 'Azul delavê', 'Azul escuro']),
    2
FROM public.produtos p 
WHERE p.nome = 'Bolsa Ecológica Jeans';

-- Variações para Mochila
INSERT INTO public.produto_variacoes (produto_id, nome, valor, estoque)
SELECT 
    p.id,
    'Cor',
    unnest(ARRAY['Azul', 'Azul delavê']),
    1
FROM public.produtos p 
WHERE p.nome = 'Mochila Jeans Sustentável';

-- =======================================================
-- 9. PEDIDOS DE EXEMPLO
-- =======================================================

-- Pedido 1 - Cliente João
INSERT INTO public.pedidos (
    cliente_id, status, subtotal, frete, total, 
    endereco_entrega, metodo_envio, metodo_pagamento, status_pagamento
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    'entregue',
    75.90,
    15.00,
    90.90,
    '{"logradouro": "Av. Ecológica", "numero": "654", "bairro": "Mooca", "cidade": "São Paulo", "estado": "SP", "cep": "05678-901"}',
    'PAC',
    'cartao_credito',
    'aprovado'
);

-- Pedido 2 - Cliente Fernanda
INSERT INTO public.pedidos (
    cliente_id, status, subtotal, frete, total, 
    endereco_entrega, metodo_envio, metodo_pagamento, status_pagamento
) VALUES (
    '66666666-6666-6666-6666-666666666666',
    'enviado',
    100.50,
    0.00,
    100.50,
    '{"logradouro": "Rua Verde", "numero": "987", "bairro": "Pinheiros", "cidade": "São Paulo", "estado": "SP", "cep": "06789-012"}',
    'SEDEX',
    'pix',
    'aprovado'
);

-- =======================================================
-- 10. ITENS DOS PEDIDOS
-- =======================================================

-- Itens do Pedido 1
INSERT INTO public.pedido_itens (
    pedido_id, produto_id, costureira_id, quantidade, 
    preco_unitario, preco_total, status_item
)
SELECT 
    ped.id,
    prod.id,
    prod.costureira_id,
    1,
    75.90,
    75.90,
    'entregue'
FROM public.pedidos ped, public.produtos prod
WHERE ped.cliente_id = '55555555-5555-5555-5555-555555555555'
AND prod.nome = 'Bolsa Ecológica Jeans'
LIMIT 1;

-- Itens do Pedido 2
INSERT INTO public.pedido_itens (
    pedido_id, produto_id, costureira_id, quantidade, 
    preco_unitario, preco_total, status_item
)
SELECT 
    ped.id,
    prod.id,
    prod.costureira_id,
    1,
    65.00,
    65.00,
    'enviado'
FROM public.pedidos ped, public.produtos prod
WHERE ped.cliente_id = '66666666-6666-6666-6666-666666666666'
AND prod.nome = 'Clutch Patchwork Jeans'
LIMIT 1;

INSERT INTO public.pedido_itens (
    pedido_id, produto_id, costureira_id, quantidade, 
    preco_unitario, preco_total, status_item
)
SELECT 
    ped.id,
    prod.id,
    prod.costureira_id,
    1,
    35.50,
    35.50,
    'enviado'
FROM public.pedidos ped, public.produtos prod
WHERE ped.cliente_id = '66666666-6666-6666-6666-666666666666'
AND prod.nome = 'Necessaire Artesanal'
LIMIT 1;

-- =======================================================
-- 11. AVALIAÇÕES DE EXEMPLO
-- =======================================================

-- Avaliação do produto entregue
INSERT INTO public.avaliacoes_produto (
    produto_id, cliente_id, pedido_item_id, nota, titulo, comentario, verificada
)
SELECT 
    pi.produto_id,
    p.cliente_id,
    pi.id,
    5,
    'Produto excepcional!',
    'Bolsa de qualidade incrível, muito bem feita e sustentável. Superou minhas expectativas!',
    true
FROM public.pedido_itens pi
JOIN public.pedidos p ON p.id = pi.pedido_id
WHERE p.status = 'entregue'
LIMIT 1;

-- Avaliação da costureira
INSERT INTO public.avaliacoes_costureira (
    costureira_id, cliente_id, pedido_id, nota, comentario
)
SELECT 
    pi.costureira_id,
    p.cliente_id,
    p.id,
    5,
    'Excelente profissional! Produto chegou no prazo e com qualidade excepcional.'
FROM public.pedido_itens pi
JOIN public.pedidos p ON p.id = pi.pedido_id
WHERE p.status = 'entregue'
LIMIT 1;

-- =======================================================
-- 12. FAVORITOS DE EXEMPLO
-- =======================================================

INSERT INTO public.favoritos (user_id, produto_id)
SELECT 
    '66666666-6666-6666-6666-666666666666',
    p.id
FROM public.produtos p
WHERE p.nome IN ('Bolsa Ecológica Jeans', 'Mochila Jeans Sustentável');

INSERT INTO public.favoritos (user_id, produto_id)
SELECT 
    '77777777-7777-7777-7777-777777777777',
    p.id
FROM public.produtos p
WHERE p.nome = 'Clutch Patchwork Jeans';

-- =======================================================
-- 13. ITENS NO CARRINHO
-- =======================================================

INSERT INTO public.carrinho (user_id, produto_id, quantidade, variacoes)
SELECT 
    '77777777-7777-7777-7777-777777777777',
    p.id,
    1,
    '{"cor": "Azul clássico"}'::jsonb
FROM public.produtos p
WHERE p.nome = 'Bolsa Ecológica Jeans';

-- =======================================================
-- 14. NOTIFICAÇÕES DE EXEMPLO
-- =======================================================

INSERT INTO public.notificacoes (user_id, tipo, titulo, mensagem) VALUES
('55555555-5555-5555-5555-555555555555', 'pedido_entregue', 'Pedido entregue!', 'Seu pedido foi entregue com sucesso. Que tal avaliar o produto?'),
('66666666-6666-6666-6666-666666666666', 'pedido_enviado', 'Pedido em trânsito', 'Seu pedido foi enviado e chegará em breve!'),
('11111111-1111-1111-1111-111111111111', 'nova_venda', 'Nova venda realizada!', 'Parabéns! Você tem uma nova venda para processar.'),
('22222222-2222-2222-2222-222222222222', 'produto_favoritado', 'Produto favoritado', 'Seu produto "Clutch Patchwork Jeans" foi favoritado por um cliente!');

-- =======================================================
-- 15. CONVERSAS E MENSAGENS DE EXEMPLO
-- =======================================================

-- Conversa entre cliente e costureira
INSERT INTO public.conversas (cliente_id, costureira_id, produto_id, assunto)
SELECT 
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    p.id,
    'Dúvida sobre personalização da bolsa'
FROM public.produtos p
WHERE p.nome = 'Bolsa Ecológica Jeans'
LIMIT 1;

-- Mensagens da conversa
INSERT INTO public.mensagens (conversa_id, remetente_id, conteudo)
SELECT 
    c.id,
    '77777777-7777-7777-7777-777777777777',
    'Olá! Gostaria de saber se é possível personalizar a bolsa com bordado.'
FROM public.conversas c
LIMIT 1;

INSERT INTO public.mensagens (conversa_id, remetente_id, conteudo)
SELECT 
    c.id,
    '11111111-1111-1111-1111-111111111111',
    'Olá! Sim, é possível fazer bordados personalizados. Qual tipo de bordado você tem em mente?'
FROM public.conversas c
LIMIT 1;
