-- Talentos Marketplace - Consultas SQL de Manipulação de Dados
-- Exemplos de operações CRUD e consultas complexas

-- =======================================================
-- 1. OPERAÇÕES DE INSERÇÃO (CREATE)
-- =======================================================

-- 1.1 Inserir novo usuário costureira
INSERT INTO public.profiles (id, email, nome_completo, telefone, tipo_usuario, bio)
VALUES (
    uuid_generate_v4(),
    'nova.costureira@email.com',
    'Luiza Artesã',
    '(11) 99999-5555',
    'costureira',
    'Especialista em roupas infantis sustentáveis e brinquedos ecológicos.'
);

-- 1.2 Inserir dados específicos da costureira
INSERT INTO public.costureiras (id, especialidades, experiencia_anos, verificada)
SELECT 
    id,
    ARRAY['Roupas Infantis', 'Brinquedos Ecológicos', 'Algodão Orgânico'],
    5,
    false
FROM public.profiles 
WHERE email = 'nova.costureira@email.com';

-- 1.3 Inserir novo produto
INSERT INTO public.produtos (
    costureira_id, categoria_id, nome, descricao, descricao_curta,
    preco, sku, estoque, materiais, tempo_producao, sustentavel
)
SELECT 
    p.id,
    c.id,
    'Vestido Infantil Orgânico',
    'Vestido infantil feito com algodão 100% orgânico, tingimento natural com plantas. Confortável e seguro para a pele sensível das crianças.',
    'Vestido infantil em algodão orgânico com tingimento natural.',
    89.90,
    'VIO001',
    10,
    ARRAY['Algodão orgânico', 'Tingimento natural', 'Botões de madeira'],
    5,
    true
FROM public.profiles p, public.categorias c
WHERE p.email = 'nova.costureira@email.com' 
AND c.slug = 'infantil';

-- 1.4 Inserir novo pedido
INSERT INTO public.pedidos (
    cliente_id, subtotal, frete, total, endereco_entrega, metodo_pagamento
)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    89.90,
    12.00,
    101.90,
    '{"logradouro": "Av. Ecológica", "numero": "654", "bairro": "Mooca", "cidade": "São Paulo", "estado": "SP", "cep": "05678-901"}',
    'pix'
);

-- =======================================================
-- 2. OPERAÇÕES DE CONSULTA (READ)
-- =======================================================

-- 2.1 Listar produtos em destaque com dados da costureira
SELECT 
    p.id,
    p.nome,
    p.descricao_curta,
    p.preco,
    p.preco_promocional,
    p.avaliacoes_media,
    p.total_avaliacoes,
    p.vendas_total,
    prof.nome_completo as costureira_nome,
    c.avaliacoes_media as costureira_rating,
    cat.nome as categoria,
    pi.url_imagem as imagem_principal
FROM public.produtos p
JOIN public.costureiras c ON c.id = p.costureira_id
JOIN public.profiles prof ON prof.id = c.id
JOIN public.categorias cat ON cat.id = p.categoria_id
LEFT JOIN public.produto_imagens pi ON pi.produto_id = p.id AND pi.is_principal = true
WHERE p.status = 'ativo' AND p.destaque = true
ORDER BY p.vendas_total DESC, p.avaliacoes_media DESC
LIMIT 10;

-- 2.2 Buscar produtos por categoria com filtros
SELECT 
    p.id,
    p.nome,
    p.preco,
    p.preco_promocional,
    p.avaliacoes_media,
    p.total_avaliacoes,
    prof.nome_completo as costureira,
    pi.url_imagem
FROM public.produtos p
JOIN public.profiles prof ON prof.id = p.costureira_id
LEFT JOIN public.produto_imagens pi ON pi.produto_id = p.id AND pi.is_principal = true
JOIN public.categorias cat ON cat.id = p.categoria_id
WHERE 
    p.status = 'ativo'
    AND cat.slug = 'bolsas-carteiras'
    AND p.preco BETWEEN 50.00 AND 150.00
    AND p.estoque > 0
ORDER BY p.avaliacoes_media DESC, p.preco ASC;

-- 2.3 Busca textual em produtos
SELECT 
    p.id,
    p.nome,
    p.descricao_curta,
    p.preco,
    prof.nome_completo as costureira,
    ts_rank(to_tsvector('portuguese', p.nome || ' ' || p.descricao), 
             plainto_tsquery('portuguese', 'jeans sustentável')) as relevancia
FROM public.produtos p
JOIN public.profiles prof ON prof.id = p.costureira_id
WHERE 
    p.status = 'ativo'
    AND to_tsvector('portuguese', p.nome || ' ' || p.descricao) @@ 
        plainto_tsquery('portuguese', 'jeans sustentável')
ORDER BY relevancia DESC, p.avaliacoes_media DESC;

-- 2.4 Histórico de pedidos do cliente com detalhes
SELECT 
    ped.numero_pedido,
    ped.created_at,
    ped.status,
    ped.total,
    array_agg(
        json_build_object(
            'produto_nome', prod.nome,
            'quantidade', pi.quantidade,
            'preco_unitario', pi.preco_unitario,
            'costureira', prof.nome_completo,
            'status_item', pi.status_item
        )
    ) as itens
FROM public.pedidos ped
JOIN public.pedido_itens pi ON pi.pedido_id = ped.id
JOIN public.produtos prod ON prod.id = pi.produto_id
JOIN public.profiles prof ON prof.id = pi.costureira_id
WHERE ped.cliente_id = '55555555-5555-5555-5555-555555555555'
GROUP BY ped.id, ped.numero_pedido, ped.created_at, ped.status, ped.total
ORDER BY ped.created_at DESC;

-- 2.5 Dashboard da costureira - estatísticas
SELECT 
    c.id,
    prof.nome_completo,
    c.total_vendas,
    c.avaliacoes_media,
    c.total_avaliacoes,
    COUNT(DISTINCT p.id) as total_produtos,
    COUNT(DISTINCT CASE WHEN p.status = 'ativo' THEN p.id END) as produtos_ativos,
    SUM(p.estoque) as estoque_total,
    COUNT(DISTINCT CASE WHEN pi.status_item = 'pendente' THEN pi.pedido_id END) as pedidos_pendentes,
    SUM(CASE WHEN ped.status = 'entregue' AND ped.created_at >= CURRENT_DATE - INTERVAL '30 days' 
             THEN pi.preco_total ELSE 0 END) as faturamento_30dias
FROM public.costureiras c
JOIN public.profiles prof ON prof.id = c.id
LEFT JOIN public.produtos p ON p.costureira_id = c.id
LEFT JOIN public.pedido_itens pi ON pi.costureira_id = c.id
LEFT JOIN public.pedidos ped ON ped.id = pi.pedido_id
WHERE c.id = '11111111-1111-1111-1111-111111111111'
GROUP BY c.id, prof.nome_completo, c.total_vendas, c.avaliacoes_media, c.total_avaliacoes;

-- 2.6 Produtos mais vendidos por categoria
SELECT 
    cat.nome as categoria,
    p.nome as produto,
    p.vendas_total,
    p.avaliacoes_media,
    prof.nome_completo as costureira,
    p.preco
FROM public.produtos p
JOIN public.categorias cat ON cat.id = p.categoria_id
JOIN public.profiles prof ON prof.id = p.costureira_id
WHERE p.status = 'ativo'
ORDER BY cat.nome, p.vendas_total DESC;

-- =======================================================
-- 3. OPERAÇÕES DE ATUALIZAÇÃO (UPDATE)
-- =======================================================

-- 3.1 Atualizar status do pedido
UPDATE public.pedidos 
SET 
    status = 'confirmado',
    updated_at = NOW()
WHERE numero_pedido = 'TAL2024000001';

-- 3.2 Atualizar estoque após venda
UPDATE public.produtos 
SET 
    estoque = estoque - 1,
    vendas_total = vendas_total + 1
WHERE id = (
    SELECT produto_id 
    FROM public.pedido_itens 
    WHERE pedido_id = (
        SELECT id FROM public.pedidos WHERE numero_pedido = 'TAL2024000001'
    )
    LIMIT 1
);

-- 3.3 Marcar notificações como lidas
UPDATE public.notificacoes 
SET 
    lida = true,
    lida_em = NOW()
WHERE 
    user_id = '55555555-5555-5555-5555-555555555555'
    AND lida = false;

-- 3.4 Atualizar dados do perfil
UPDATE public.profiles 
SET 
    telefone = '(11) 99999-0000',
    bio = 'Bio atualizada com novas informações sobre sustentabilidade.',
    updated_at = NOW()
WHERE id = '55555555-5555-5555-5555-555555555555';

-- 3.5 Aplicar desconto promocional em produtos
UPDATE public.produtos 
SET 
    preco_promocional = preco * 0.85, -- 15% de desconto
    updated_at = NOW()
WHERE 
    categoria_id = (SELECT id FROM public.categorias WHERE slug = 'bolsas-carteiras')
    AND status = 'ativo'
    AND preco > 100.00;

-- =======================================================
-- 4. OPERAÇÕES DE REMOÇÃO (DELETE)
-- =======================================================

-- 4.1 Remover item do carrinho
DELETE FROM public.carrinho 
WHERE 
    user_id = '77777777-7777-7777-7777-777777777777'
    AND produto_id = (SELECT id FROM public.produtos WHERE nome = 'Bolsa Ecológica Jeans' LIMIT 1);

-- 4.2 Remover favorito
DELETE FROM public.favoritos 
WHERE 
    user_id = '66666666-6666-6666-6666-666666666666'
    AND produto_id = (SELECT id FROM public.produtos WHERE nome = 'Mochila Jeans Sustentável' LIMIT 1);

-- 4.3 Remover produto (soft delete - apenas inativar)
UPDATE public.produtos 
SET 
    status = 'inativo',
    updated_at = NOW()
WHERE 
    id = 'produto_id_aqui'
    AND costureira_id = '11111111-1111-1111-1111-111111111111';

-- 4.4 Limpar notificações antigas (mais de 90 dias)
DELETE FROM public.notificacoes 
WHERE 
    created_at < CURRENT_DATE - INTERVAL '90 days'
    AND lida = true;

-- =======================================================
-- 5. CONSULTAS COMPLEXAS E RELATÓRIOS
-- =======================================================

-- 5.1 Relatório de vendas por costureira (mensal)
SELECT 
    prof.nome_completo as costureira,
    DATE_TRUNC('month', ped.created_at) as mes,
    COUNT(DISTINCT ped.id) as total_pedidos,
    SUM(pi.quantidade) as itens_vendidos,
    SUM(pi.preco_total) as faturamento_bruto,
    SUM(pi.preco_total * 0.10) as comissao_plataforma,
    SUM(pi.preco_total * 0.90) as valor_costureira
FROM public.costureiras c
JOIN public.profiles prof ON prof.id = c.id
JOIN public.pedido_itens pi ON pi.costureira_id = c.id
JOIN public.pedidos ped ON ped.id = pi.pedido_id
WHERE 
    ped.status = 'entregue'
    AND ped.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY prof.nome_completo, DATE_TRUNC('month', ped.created_at)
ORDER BY mes DESC, faturamento_bruto DESC;

-- 5.2 Análise de abandono de carrinho
SELECT 
    DATE_TRUNC('week', c.created_at) as semana,
    COUNT(DISTINCT c.user_id) as usuarios_com_carrinho,
    COUNT(c.id) as itens_no_carrinho,
    COUNT(DISTINCT ped.cliente_id) as usuarios_que_compraram,
    ROUND(
        COUNT(DISTINCT ped.cliente_id)::DECIMAL / 
        NULLIF(COUNT(DISTINCT c.user_id), 0) * 100, 2
    ) as taxa_conversao_pct
FROM public.carrinho c
LEFT JOIN public.pedidos ped ON ped.cliente_id = c.user_id 
    AND ped.created_at >= c.created_at
    AND ped.created_at <= c.created_at + INTERVAL '7 days'
WHERE c.created_at >= CURRENT_DATE - INTERVAL '8 weeks'
GROUP BY DATE_TRUNC('week', c.created_at)
ORDER BY semana DESC;

-- 5.3 Produtos com melhor performance (avaliação vs vendas)
SELECT 
    p.nome,
    prof.nome_completo as costureira,
    cat.nome as categoria,
    p.preco,
    p.vendas_total,
    p.avaliacoes_media,
    p.total_avaliacoes,
    CASE 
        WHEN p.total_avaliacoes >= 5 AND p.avaliacoes_media >= 4.5 AND p.vendas_total >= 10 
        THEN 'Excelente'
        WHEN p.total_avaliacoes >= 3 AND p.avaliacoes_media >= 4.0 AND p.vendas_total >= 5 
        THEN 'Bom'
        WHEN p.total_avaliacoes >= 1 AND p.avaliacoes_media >= 3.5 
        THEN 'Regular'
        ELSE 'Novo/Sem dados'
    END as performance_categoria
FROM public.produtos p
JOIN public.profiles prof ON prof.id = p.costureira_id
JOIN public.categorias cat ON cat.id = p.categoria_id
WHERE p.status = 'ativo'
ORDER BY p.avaliacoes_media DESC, p.vendas_total DESC;

-- 5.4 Análise de retenção de clientes
WITH cliente_pedidos AS (
    SELECT 
        cliente_id,
        MIN(created_at) as primeira_compra,
        MAX(created_at) as ultima_compra,
        COUNT(*) as total_pedidos,
        SUM(total) as valor_total_gasto
    FROM public.pedidos 
    WHERE status = 'entregue'
    GROUP BY cliente_id
)
SELECT 
    CASE 
        WHEN total_pedidos = 1 THEN 'Cliente único'
        WHEN total_pedidos BETWEEN 2 AND 5 THEN 'Cliente recorrente'
        WHEN total_pedidos > 5 THEN 'Cliente fiel'
    END as tipo_cliente,
    COUNT(*) as quantidade_clientes,
    AVG(valor_total_gasto) as valor_medio_gasto,
    AVG(total_pedidos) as media_pedidos_por_cliente
FROM cliente_pedidos
GROUP BY 
    CASE 
        WHEN total_pedidos = 1 THEN 'Cliente único'
        WHEN total_pedidos BETWEEN 2 AND 5 THEN 'Cliente recorrente'
        WHEN total_pedidos > 5 THEN 'Cliente fiel'
    END
ORDER BY quantidade_clientes DESC;

-- 5.5 Produtos que precisam de reposição de estoque
SELECT 
    p.nome,
    prof.nome_completo as costureira,
    p.estoque,
    p.vendas_total,
    ROUND(p.vendas_total::DECIMAL / GREATEST(
        EXTRACT(DAYS FROM (NOW() - p.created_at)) / 30, 1
    ), 2) as vendas_por_mes,
    CASE 
        WHEN p.estoque = 0 THEN 'Urgente - Sem estoque'
        WHEN p.estoque <= 2 AND p.vendas_total > 5 THEN 'Alto - Estoque baixo produto popular'
        WHEN p.estoque <= 5 THEN 'Médio - Estoque baixo'
        ELSE 'Normal'
    END as prioridade_reposicao
FROM public.produtos p
JOIN public.profiles prof ON prof.id = p.costureira_id
WHERE 
    p.status = 'ativo'
    AND p.estoque <= 5
ORDER BY 
    CASE 
        WHEN p.estoque = 0 THEN 1
        WHEN p.estoque <= 2 AND p.vendas_total > 5 THEN 2
        WHEN p.estoque <= 5 THEN 3
        ELSE 4
    END,
    p.vendas_total DESC;

-- =======================================================
-- 6. VIEWS ÚTEIS PARA O SISTEMA
-- =======================================================

-- 6.1 View de produtos com informações completas
CREATE OR REPLACE VIEW vw_produtos_completos AS
SELECT 
    p.id,
    p.nome,
    p.descricao,
    p.descricao_curta,
    p.preco,
    p.preco_promocional,
    p.sku,
    p.estoque,
    p.avaliacoes_media,
    p.total_avaliacoes,
    p.vendas_total,
    p.tempo_producao,
    p.status,
    p.destaque,
    p.created_at,
    prof.nome_completo as costureira_nome,
    prof.foto_perfil as costureira_foto,
    c.avaliacoes_media as costureira_rating,
    c.verificada as costureira_verificada,
    cat.nome as categoria_nome,
    cat.slug as categoria_slug,
    pi.url_imagem as imagem_principal,
    array_agg(DISTINCT pv.valor) FILTER (WHERE pv.valor IS NOT NULL) as variacoes_disponiveis
FROM public.produtos p
JOIN public.costureiras c ON c.id = p.costureira_id
JOIN public.profiles prof ON prof.id = c.id
JOIN public.categorias cat ON cat.id = p.categoria_id
LEFT JOIN public.produto_imagens pi ON pi.produto_id = p.id AND pi.is_principal = true
LEFT JOIN public.produto_variacoes pv ON pv.produto_id = p.id AND pv.ativa = true
GROUP BY 
    p.id, prof.nome_completo, prof.foto_perfil, c.avaliacoes_media, 
    c.verificada, cat.nome, cat.slug, pi.url_imagem;

-- 6.2 View de estatísticas da plataforma
CREATE OR REPLACE VIEW vw_estatisticas_plataforma AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles WHERE tipo_usuario = 'costureira') as total_costureiras,
    (SELECT COUNT(*) FROM public.profiles WHERE tipo_usuario = 'cliente') as total_clientes,
    (SELECT COUNT(*) FROM public.produtos WHERE status = 'ativo') as produtos_ativos,
    (SELECT COUNT(*) FROM public.pedidos WHERE status = 'entregue') as pedidos_entregues,
    (SELECT SUM(total) FROM public.pedidos WHERE status = 'entregue') as faturamento_total,
    (SELECT AVG(avaliacoes_media) FROM public.produtos WHERE total_avaliacoes >= 3) as avaliacao_media_produtos,
    (SELECT AVG(avaliacoes_media) FROM public.costureiras WHERE total_avaliacoes >= 3) as avaliacao_media_costureiras;
