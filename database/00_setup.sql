-- Talentos Marketplace - Script de Configuração Inicial para Supabase
-- Execute este arquivo após criar o projeto no Supabase

-- =======================================================
-- INSTRUÇÕES DE EXECUÇÃO
-- =======================================================
-- 1. Acesse o painel do Supabase (https://supabase.com)
-- 2. Vá em SQL Editor
-- 3. Execute cada seção deste arquivo em ordem
-- 4. Verifique se todas as tabelas foram criadas
-- 5. Teste as consultas de exemplo

-- =======================================================
-- VERIFICAÇÃO DE EXTENSÕES
-- =======================================================
SELECT 
    extname as "Extensão",
    extversion as "Versão"
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Se alguma extensão não estiver presente, execute:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================================================
-- VERIFICAÇÃO DAS TABELAS CRIADAS
-- =======================================================
SELECT 
    table_name as "Tabela",
    table_type as "Tipo"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =======================================================
-- VERIFICAÇÃO DOS TRIGGERS
-- =======================================================
SELECT 
    trigger_name as "Trigger",
    event_object_table as "Tabela",
    action_timing as "Quando",
    event_manipulation as "Evento"
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =======================================================
-- VERIFICAÇÃO DAS POLÍTICAS RLS
-- =======================================================
SELECT 
    schemaname as "Schema",
    tablename as "Tabela",
    policyname as "Política",
    permissive as "Permissiva",
    cmd as "Comando"
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =======================================================
-- VERIFICAÇÃO DOS DADOS DE EXEMPLO
-- =======================================================

-- Contar registros em cada tabela
SELECT 
    'profiles' as tabela, COUNT(*) as registros FROM public.profiles
UNION ALL
SELECT 
    'costureiras' as tabela, COUNT(*) as registros FROM public.costureiras
UNION ALL
SELECT 
    'categorias' as tabela, COUNT(*) as registros FROM public.categorias
UNION ALL
SELECT 
    'produtos' as tabela, COUNT(*) as registros FROM public.produtos
UNION ALL
SELECT 
    'pedidos' as tabela, COUNT(*) as registros FROM public.pedidos
UNION ALL
SELECT 
    'configuracoes' as tabela, COUNT(*) as registros FROM public.configuracoes
ORDER BY tabela;

-- =======================================================
-- TESTE DE FUNCIONALIDADES BÁSICAS
-- =======================================================

-- 1. Teste da geração de número de pedido
SELECT gerar_numero_pedido() as "Teste Geração Número Pedido";

-- 2. Teste das views criadas
SELECT * FROM vw_produtos_completos LIMIT 3;

-- 3. Teste das estatísticas da plataforma
SELECT * FROM vw_estatisticas_plataforma;

-- =======================================================
-- CONFIGURAÇÃO DE AUTENTICAÇÃO
-- =======================================================

-- Verificar se auth.users existe (tabela do Supabase Auth)
SELECT COUNT(*) as "Usuários Auth" FROM auth.users;

-- =======================================================
-- CONSULTAS DE VALIDAÇÃO
-- =======================================================

-- 1. Produtos com imagens
SELECT 
    p.nome,
    COUNT(pi.id) as total_imagens
FROM public.produtos p
LEFT JOIN public.produto_imagens pi ON pi.produto_id = p.id
GROUP BY p.id, p.nome
ORDER BY total_imagens DESC;

-- 2. Pedidos com itens
SELECT 
    ped.numero_pedido,
    ped.status,
    COUNT(pi.id) as total_itens,
    SUM(pi.preco_total) as valor_total_calculado,
    ped.total as valor_total_pedido
FROM public.pedidos ped
LEFT JOIN public.pedido_itens pi ON pi.pedido_id = ped.id
GROUP BY ped.id, ped.numero_pedido, ped.status, ped.total
ORDER BY ped.created_at DESC;

-- 3. Costureiras com produtos
SELECT 
    prof.nome_completo,
    COUNT(p.id) as total_produtos,
    AVG(p.preco) as preco_medio
FROM public.costureiras c
JOIN public.profiles prof ON prof.id = c.id
LEFT JOIN public.produtos p ON p.costureira_id = c.id
GROUP BY c.id, prof.nome_completo
ORDER BY total_produtos DESC;

-- =======================================================
-- TESTES DE SEGURANÇA RLS
-- =======================================================

-- IMPORTANTE: Estes testes devem ser executados após criar usuários reais
-- no Supabase Auth e configurar o contexto adequado

-- Exemplo de como testar RLS:
-- SET app.current_user_id = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM public.produtos; -- Deve mostrar apenas produtos da costureira

-- =======================================================
-- LIMPEZA DE DADOS DE TESTE (OPCIONAL)
-- =======================================================

-- ATENÇÃO: Execute apenas se quiser remover os dados de exemplo
-- Descomente as linhas abaixo APENAS se necessário

/*
-- Remover dados de exemplo (manter estrutura)
DELETE FROM public.pedido_itens;
DELETE FROM public.pedidos;
DELETE FROM public.produto_variacoes;
DELETE FROM public.produto_imagens;
DELETE FROM public.produtos;
DELETE FROM public.costureiras;
DELETE FROM public.enderecos;
DELETE FROM public.profiles WHERE tipo_usuario != 'admin';
DELETE FROM public.avaliacoes_produto;
DELETE FROM public.avaliacoes_costureira;
DELETE FROM public.favoritos;
DELETE FROM public.carrinho;
DELETE FROM public.conversas;
DELETE FROM public.mensagens;
DELETE FROM public.notificacoes;

-- Resetar sequências se necessário
-- SELECT setval(pg_get_serial_sequence('public.produtos', 'id'), 1, false);
*/

-- =======================================================
-- CONFIGURAÇÕES FINAIS RECOMENDADAS
-- =======================================================

-- 1. Configurar backup automático no painel do Supabase
-- 2. Configurar alertas de uso de recursos
-- 3. Revisar políticas de RLS se necessário
-- 4. Configurar variáveis de ambiente no projeto
-- 5. Testar conexão da aplicação

-- =======================================================
-- INFORMAÇÕES DE CONEXÃO
-- =======================================================

-- Após executar este script, você precisará das seguintes informações
-- para conectar sua aplicação:

-- URL do Projeto: https://[SEU-ID-PROJETO].supabase.co
-- Anon Key: [SUA-CHAVE-ANON] (disponível em Settings > API)
-- Service Role Key: [SUA-CHAVE-SERVICE] (apenas para operações admin)

-- Exemplo de conexão TypeScript:
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
*/

-- =======================================================
-- PRÓXIMOS PASSOS
-- =======================================================

-- 1. ✅ Estrutura do banco criada
-- 2. ✅ Triggers e automações configuradas  
-- 3. ✅ Segurança RLS implementada
-- 4. ✅ Dados de exemplo inseridos
-- 5. 🔄 Configurar autenticação na aplicação
-- 6. 🔄 Implementar upload de imagens
-- 7. 🔄 Configurar webhooks de pagamento
-- 8. 🔄 Testar integração completa

SELECT 'Banco de dados configurado com sucesso! ✅' as "Status";
