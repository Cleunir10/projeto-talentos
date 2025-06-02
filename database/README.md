# Talentos Marketplace - Banco de Dados Supabase

Este diretório contém a modelagem completa do banco de dados para o marketplace de moda sustentável "Talentos".

## 📁 Estrutura dos Arquivos

### 1. `01_schema.sql` - Estrutura do Banco
Contém a definição completa do esquema do banco de dados:
- **Tabelas principais**: profiles, costureiras, produtos, pedidos, etc.
- **Relacionamentos**: Chaves estrangeiras e restrições
- **Índices**: Para otimização de performance
- **Comentários**: Documentação das tabelas

### 2. `02_triggers.sql` - Automações e Regras de Negócio
Implementa triggers e funções para:
- Atualização automática de timestamps
- Geração de números de pedido
- Controle de estoque automático
- Cálculo de médias de avaliações
- Logs de atividade
- Notificações automáticas

### 3. `03_rls.sql` - Segurança (Row Level Security)
Define políticas de acesso:
- Controle de acesso baseado em usuário
- Separação de dados por tipo de usuário
- Proteção de dados sensíveis
- Políticas para cada tabela

### 4. `04_sample_data.sql` - Dados de Exemplo
Dados iniciais para teste:
- Usuários (costureiras, clientes, admin)
- Produtos com variações e imagens
- Pedidos e avaliações
- Configurações da plataforma

### 5. `05_queries.sql` - Consultas e Operações
Exemplos de manipulação de dados:
- Operações CRUD completas
- Consultas complexas de relatório
- Views úteis para a aplicação
- Análises de performance

## 🗂️ Modelagem do Banco

### Entidades Principais

#### 👤 **Usuários**
- `profiles` - Dados básicos dos usuários
- `enderecos` - Endereços de entrega
- `costureiras` - Dados específicos das artesãs

#### 🛍️ **Produtos**
- `categorias` - Categorização dos produtos
- `produtos` - Catálogo principal
- `produto_imagens` - Galeria de fotos
- `produto_variacoes` - Cores, tamanhos, etc.

#### 📦 **Vendas**
- `pedidos` - Pedidos realizados
- `pedido_itens` - Itens de cada pedido
- `carrinho` - Carrinho de compras

#### ⭐ **Interações**
- `avaliacoes_produto` - Avaliações dos produtos
- `avaliacoes_costureira` - Avaliações das artesãs
- `favoritos` - Produtos favoritados

#### 💬 **Comunicação**
- `conversas` - Chats entre usuários
- `mensagens` - Mensagens das conversas
- `notificacoes` - Sistema de notificações

#### ⚙️ **Sistema**
- `configuracoes` - Configurações da plataforma
- `logs_atividade` - Auditoria de ações

### Relacionamentos Principais

```
profiles (1) ←→ (1) costureiras
profiles (1) ←→ (N) enderecos
profiles (1) ←→ (N) pedidos

costureiras (1) ←→ (N) produtos
produtos (1) ←→ (N) produto_imagens
produtos (1) ←→ (N) produto_variacoes

pedidos (1) ←→ (N) pedido_itens
produtos (1) ←→ (N) pedido_itens

produtos (1) ←→ (N) avaliacoes_produto
costureiras (1) ←→ (N) avaliacoes_costureira
```

## 🚀 Como Usar no Supabase

### 1. Criar Projeto no Supabase
```bash
# Acesse https://supabase.com
# Crie um novo projeto
# Anote a URL e as chaves de API
```

### 2. Executar Scripts SQL
Execute os arquivos na ordem correta:

```sql
-- 1. Criar estrutura
\i 01_schema.sql

-- 2. Adicionar triggers
\i 02_triggers.sql

-- 3. Configurar segurança
\i 03_rls.sql

-- 4. Inserir dados de exemplo
\i 04_sample_data.sql
```

### 3. Testar Consultas
```sql
-- Execute as consultas do arquivo 05_queries.sql
-- para testar o funcionamento
```

## 📊 Principais Funcionalidades

### ✅ **Operações Implementadas**

#### **Inserção (CREATE)**
- ✅ Cadastro de usuários (costureiras/clientes)
- ✅ Criação de produtos com variações
- ✅ Realização de pedidos
- ✅ Sistema de avaliações
- ✅ Chat entre usuários

#### **Consulta (READ)**
- ✅ Catálogo de produtos com filtros
- ✅ Busca textual avançada
- ✅ Dashboard de costureiras
- ✅ Histórico de pedidos
- ✅ Relatórios de vendas

#### **Atualização (UPDATE)**
- ✅ Gerenciamento de estoque
- ✅ Status de pedidos
- ✅ Perfis de usuários
- ✅ Configurações da plataforma

#### **Remoção (DELETE)**
- ✅ Soft delete de produtos
- ✅ Limpeza de dados antigos
- ✅ Remoção de favoritos/carrinho

### 🔐 **Segurança**
- ✅ Row Level Security (RLS)
- ✅ Políticas por tipo de usuário
- ✅ Proteção de dados sensíveis
- ✅ Logs de auditoria

### 🤖 **Automações**
- ✅ Controle automático de estoque
- ✅ Cálculo de médias de avaliação
- ✅ Notificações automáticas
- ✅ Numeração de pedidos
- ✅ Timestamps automáticos

## 📈 **Consultas de Análise**

### **Dashboard Costureira**
- Total de vendas e faturamento
- Média de avaliações
- Pedidos pendentes
- Produtos em destaque

### **Relatórios Administrativos**
- Vendas por período
- Produtos mais populares
- Análise de abandono de carrinho
- Retenção de clientes
- Produtos com estoque baixo

### **Métricas da Plataforma**
- Total de usuários ativos
- Produtos no catálogo
- Faturamento total
- Avaliações médias

## 🔧 **Otimizações Implementadas**

### **Índices de Performance**
- Busca por costureira
- Filtros por categoria
- Status de pedidos
- Busca textual (GIN)

### **Views Otimizadas**
- `vw_produtos_completos` - Produtos com todos os dados
- `vw_estatisticas_plataforma` - Métricas consolidadas

### **Triggers Eficientes**
- Atualizações em lote
- Cálculos assíncronos
- Validações automáticas

## 🎯 **Casos de Uso Cobertos**

1. **👩‍💼 Costureira**
   - Cadastro e verificação
   - Gestão de produtos
   - Controle de pedidos
   - Chat com clientes
   - Relatórios de vendas

2. **🛒 Cliente**
   - Navegação no catálogo
   - Carrinho e favoritos
   - Realização de pedidos
   - Avaliações e feedback
   - Comunicação com costureiras

3. **⚡ Sistema**
   - Processamento de pagamentos
   - Controle de estoque
   - Notificações automáticas
   - Relatórios gerenciais
   - Auditoria de ações

## 📱 **Integração com Frontend**

O banco está preparado para integração com:
- **Supabase Client** (JavaScript/TypeScript)
- **API REST** automática do Supabase
- **Real-time subscriptions** para chat e notificações
- **Authentication** integrada
- **Storage** para imagens de produtos

### Exemplo de Conexão
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Buscar produtos
const { data: produtos } = await supabase
  .from('vw_produtos_completos')
  .select('*')
  .eq('status', 'ativo')
  .order('avaliacoes_media', { ascending: false })
```

## 🔄 **Próximos Passos**

1. **Configurar projeto no Supabase**
2. **Executar scripts SQL na ordem**
3. **Configurar autenticação**
4. **Testar operações básicas**
5. **Integrar com frontend React**
6. **Implementar uploads de imagem**
7. **Configurar webhooks para pagamentos**

---

**Nota**: Este banco de dados foi projetado seguindo as melhores práticas de segurança, performance e escalabilidade para aplicações modernas.
