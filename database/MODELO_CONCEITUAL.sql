-- Talentos Marketplace - Modelo Conceitual e Diagrama de Relacionamentos

-- =======================================================
-- ENTIDADE-RELACIONAMENTO (CONCEITUAL)
-- =======================================================

/*
ENTIDADES PRINCIPAIS:

1. USUÁRIO (profiles)
   - Pessoa física que usa a plataforma
   - Pode ser Cliente, Costureira ou Admin
   - Attributes: id, email, nome, telefone, tipo_usuario, foto_perfil

2. COSTUREIRA (costureiras)
   - Especialização do Usuário
   - Profissional que cria produtos artesanais
   - Attributes: especialidades, experiencia, portfolio, verificada

3. PRODUTO (produtos)
   - Item disponível para venda
   - Criado por uma Costureira
   - Attributes: nome, descricao, preco, estoque, materiais

4. CATEGORIA (categorias)
   - Classificação dos produtos
   - Hierárquica (pode ter categoria pai)
   - Attributes: nome, descricao, slug, icone

5. PEDIDO (pedidos)
   - Solicitação de compra de um Cliente
   - Contém múltiplos produtos
   - Attributes: numero, status, total, endereco_entrega

6. AVALIAÇÃO (avaliacoes_produto/avaliacoes_costureira)
   - Feedback do Cliente sobre produto ou costureira
   - Após entrega do pedido
   - Attributes: nota, comentario, fotos

RELACIONAMENTOS:

USUÁRIO ─── É ──→ COSTUREIRA (1:1, opcional)
USUÁRIO ─── Tem ──→ ENDEREÇO (1:N)
USUÁRIO ─── Faz ──→ PEDIDO (1:N)
USUÁRIO ─── Avalia ──→ PRODUTO (N:M)
USUÁRIO ─── Favorita ──→ PRODUTO (N:M)

COSTUREIRA ─── Cria ──→ PRODUTO (1:N)
PRODUTO ─── Pertence ──→ CATEGORIA (N:1)
PRODUTO ─── Tem ──→ IMAGEM (1:N)
PRODUTO ─── Tem ──→ VARIAÇÃO (1:N)

PEDIDO ─── Contém ──→ PRODUTO (N:M via PEDIDO_ITEM)
PEDIDO ─── Gera ──→ AVALIAÇÃO (1:N)

USUÁRIO ─── Conversa ──→ USUÁRIO (N:M via CONVERSA)
CONVERSA ─── Tem ──→ MENSAGEM (1:N)
*/

-- =======================================================
-- DIAGRAMA DE RELACIONAMENTOS (LÓGICO)
-- =======================================================

/*
┌─────────────────┐         ┌─────────────────┐
│    profiles     │◄────────┤   costureiras   │
│                 │   1:1   │                 │
│ • id (PK)      │         │ • id (PK/FK)   │
│ • email        │         │ • especialidade │
│ • nome_completo │         │ • experiencia   │
│ • tipo_usuario  │         │ • verificada    │
│ • created_at    │         │ • avaliacoes    │
└─────────────────┘         └─────────────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│    enderecos    │         │    produtos     │
│                 │         │                 │
│ • id (PK)       │         │ • id (PK)       │
│ • user_id (FK)  │         │ • costureira_id │
│ • logradouro    │         │ • categoria_id  │
│ • cidade        │         │ • nome          │
│ • is_principal  │         │ • preco         │
└─────────────────┘         │ • estoque       │
                            │ • status        │
┌─────────────────┐         └─────────────────┘
│   categorias    │                   │
│                 │◄──────────────────┘ N:1
│ • id (PK)       │
│ • nome          │         ┌─────────────────┐
│ • slug          │         │produto_imagens  │
│ • categoria_pai │         │                 │
└─────────────────┘         │ • id (PK)       │
                            │ • produto_id(FK)│
                            │ • url_imagem    │
                            │ • is_principal  │
                            └─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│     pedidos     │         │  pedido_itens   │
│                 │◄────────┤                 │
│ • id (PK)       │   1:N   │ • id (PK)       │
│ • numero_pedido │         │ • pedido_id(FK) │
│ • cliente_id(FK)│         │ • produto_id(FK)│
│ • status        │         │ • quantidade    │
│ • total         │         │ • preco_total   │
│ • created_at    │         │ • status_item   │
└─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│avaliacoes_costur│         │avaliacoes_produto│
│                 │         │                 │
│ • id (PK)       │         │ • id (PK)       │
│ • costureira_id │         │ • produto_id(FK)│
│ • cliente_id(FK)│         │ • cliente_id(FK)│
│ • pedido_id(FK) │         │ • pedido_item_id│
│ • nota          │         │ • nota          │
│ • comentario    │         │ • comentario    │
└─────────────────┘         └─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│    favoritos    │         │    carrinho     │
│                 │         │                 │
│ • id (PK)       │         │ • id (PK)       │
│ • user_id (FK)  │         │ • user_id (FK)  │
│ • produto_id(FK)│         │ • produto_id(FK)│
│ • created_at    │         │ • quantidade    │
└─────────────────┘         │ • variacoes     │
                            └─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│    conversas    │         │    mensagens    │
│                 │◄────────┤                 │
│ • id (PK)       │   1:N   │ • id (PK)       │
│ • cliente_id(FK)│         │ • conversa_id(FK)│
│ • costureira_id │         │ • remetente_id  │
│ • produto_id(FK)│         │ • conteudo      │
│ • status        │         │ • lida          │
└─────────────────┘         │ • created_at    │
                            └─────────────────┘

┌─────────────────┐
│  notificacoes   │
│                 │
│ • id (PK)       │
│ • user_id (FK)  │
│ • tipo          │
│ • titulo        │
│ • mensagem      │
│ • lida          │
│ • created_at    │
└─────────────────┘
*/

-- =======================================================
-- CARDINALIDADES E RESTRIÇÕES
-- =======================================================

/*
RELACIONAMENTOS E SUAS CARDINALIDADES:

1. profiles → costureiras (1:1 opcional)
   - Um usuário pode ser uma costureira
   - Uma costureira é sempre um usuário
   - Restrição: tipo_usuario = 'costureira'

2. profiles → enderecos (1:N)
   - Um usuário pode ter vários endereços
   - Um endereço pertence a um usuário
   - Restrição: Apenas um endereço principal por usuário

3. profiles → pedidos (1:N)
   - Um cliente pode fazer vários pedidos
   - Um pedido pertence a um cliente
   - Restrição: Apenas clientes podem fazer pedidos

4. costureiras → produtos (1:N)
   - Uma costureira pode criar vários produtos
   - Um produto pertence a uma costureira

5. categorias → produtos (1:N)
   - Uma categoria pode ter vários produtos
   - Um produto pertence a uma categoria

6. produtos → produto_imagens (1:N)
   - Um produto pode ter várias imagens
   - Uma imagem pertence a um produto
   - Restrição: Apenas uma imagem principal por produto

7. produtos → produto_variacoes (1:N)
   - Um produto pode ter várias variações
   - Uma variação pertence a um produto

8. pedidos → pedido_itens (1:N)
   - Um pedido pode ter vários itens
   - Um item pertence a um pedido

9. produtos ↔ pedidos (N:M via pedido_itens)
   - Um produto pode estar em vários pedidos
   - Um pedido pode conter vários produtos

10. profiles ↔ produtos (N:M via favoritos)
    - Um usuário pode favoritar vários produtos
    - Um produto pode ser favoritado por vários usuários

11. profiles ↔ produtos (N:M via carrinho)
    - Um usuário pode ter vários produtos no carrinho
    - Um produto pode estar no carrinho de vários usuários

12. profiles → avaliacoes_produto (1:N)
    - Um cliente pode avaliar vários produtos
    - Uma avaliação pertence a um cliente
    - Restrição: Apenas uma avaliação por produto por cliente

13. profiles → avaliacoes_costureira (1:N)
    - Um cliente pode avaliar várias costureiras
    - Uma avaliação pertence a um cliente
    - Restrição: Apenas uma avaliação por costureira por pedido

14. profiles ↔ profiles (N:M via conversas)
    - Clientes e costureiras podem conversar
    - Restrição: Apenas entre cliente e costureira

15. conversas → mensagens (1:N)
    - Uma conversa pode ter várias mensagens
    - Uma mensagem pertence a uma conversa
*/

-- =======================================================
-- REGRAS DE NEGÓCIO IMPLEMENTADAS
-- =======================================================

/*
AUTOMATIZAÇÕES (TRIGGERS):

1. Geração automática de número de pedido
   - Formato: TAL{ANO}{SEQUENCIAL}
   - Exemplo: TAL2024000001

2. Controle automático de estoque
   - Reduz estoque ao confirmar pedido
   - Restaura estoque ao cancelar

3. Cálculo automático de médias de avaliação
   - Atualiza média do produto/costureira
   - Atualiza contador de avaliações

4. Atualização de timestamps
   - Campo updated_at automático
   - Rastreamento de mudanças

5. Notificações automáticas
   - Novo pedido para costureira
   - Mudança de status para cliente
   - Sistema de alertas

6. Logs de auditoria
   - Registra todas as operações
   - Rastreamento de usuário
   - Histórico de mudanças

VALIDAÇÕES:

1. Status válidos para pedidos
   - Fluxo: pendente → confirmado → pago → em_producao → 
           pronto → enviado → entregue

2. Apenas um endereço principal por usuário

3. Estoque não pode ser negativo

4. Preços devem ser positivos

5. Avaliações entre 1 e 5 estrelas

6. Apenas clientes autenticados podem comprar

7. Apenas costureiras podem criar produtos

8. Apenas compradores podem avaliar
*/

-- =======================================================
-- ÍNDICES DE PERFORMANCE
-- =======================================================

/*
ÍNDICES CRIADOS:

1. Busca de produtos:
   - idx_produtos_costureira (costureira_id)
   - idx_produtos_categoria (categoria_id) 
   - idx_produtos_status (status)
   - idx_produtos_destaque (destaque)

2. Busca textual:
   - idx_produtos_nome_busca (GIN - full text)

3. Pedidos:
   - idx_pedidos_cliente (cliente_id)
   - idx_pedidos_status (status)
   - idx_pedidos_data (created_at)

4. Avaliações:
   - idx_avaliacoes_produto (produto_id)
   - idx_avaliacoes_costureira (costureira_id)

5. Endereços:
   - idx_enderecos_user (user_id)
   - idx_enderecos_principal (user_id, is_principal)

OTIMIZAÇÕES:

1. Views materializadas para consultas complexas
2. Índices compostos para filtros frequentes
3. Índices parciais para dados específicos
4. Full-text search em português
*/

-- =======================================================
-- SEGURANÇA (RLS - Row Level Security)
-- =======================================================

/*
POLÍTICAS DE ACESSO:

1. Dados Públicos:
   - Produtos ativos
   - Perfis de costureiras
   - Avaliações de produtos
   - Categorias ativas

2. Dados Privados do Usuário:
   - Próprio perfil
   - Próprios endereços
   - Própros pedidos
   - Própro carrinho e favoritos

3. Dados da Costureira:
   - Próprios produtos
   - Pedidos dos próprios produtos
   - Conversas com clientes

4. Dados do Cliente:
   - Própros pedidos
   - Próprias avaliações
   - Conversas com costureiras

5. Dados do Administrador:
   - Acesso total para gestão
   - Relatórios e estatísticas
   - Configurações do sistema

NÍVEIS DE ACESSO:

• ANÔNIMO: Apenas leitura de dados públicos
• CLIENTE: CRUD nos próprios dados + leitura pública
• COSTUREIRA: CRUD nos próprios dados + gestão produtos
• ADMIN: Acesso total para administração
*/

-- =======================================================
-- ESCALABILIDADE E MANUTENÇÃO
-- =======================================================

/*
PREPARADO PARA CRESCIMENTO:

1. Particionamento futuro:
   - Pedidos por ano/mês
   - Logs por período
   - Mensagens por data

2. Arquivamento:
   - Pedidos antigos
   - Conversas inativas
   - Logs históricos

3. Cache:
   - Views materializadas
   - Consultas frequentes
   - Estatísticas consolidadas

4. Monitoramento:
   - Queries lentas
   - Uso de índices
   - Performance de triggers

5. Backup e Recovery:
   - Backup incremental
   - Point-in-time recovery
   - Replicação de dados
*/
