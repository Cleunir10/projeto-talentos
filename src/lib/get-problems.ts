import { Database } from './database.types'

type Product = Database['public']['Tables']['produtos']['Row']
type CartItem = Database['public']['Tables']['carrinho_itens']['Row'] & {
  produtos: Product
}
type Order = Database['public']['Tables']['pedidos']['Row'] & {
  pedido_itens: (Database['public']['Tables']['pedido_itens']['Row'] & {
    produtos: Product
  })[]
}

export type ProblemStatus = 'resolved' | 'in_progress' | 'pending'

export type Problem = {
  id: string
  title: string
  description: string
  solution: string
  status: ProblemStatus
}

export function getProblems(): Problem[] {
  const problems: Problem[] = [
    {
      id: 'auth-state',
      title: 'Gerenciamento de Estado de Autenticação',
      description: 'O estado de autenticação está sendo gerenciado em múltiplos lugares, o que pode levar a inconsistências.',
      solution: 'Unificar o gerenciamento de estado de autenticação em um único contexto.',
      status: 'resolved'
    },
    {
      id: 'global-state',
      title: 'Gerenciamento de Estado Global',
      description: 'O estado global da aplicação está fragmentado entre diferentes componentes.',
      solution: 'Centralizar o gerenciamento de estado em um único contexto.',
      status: 'resolved'
    },
    {
      id: 'component-isolation',
      title: 'Isolamento de Componentes',
      description: 'Os componentes estão muito acoplados, dificultando a manutenção e reutilização.',
      solution: 'Melhorar o isolamento dos componentes e criar interfaces bem definidas.',
      status: 'in_progress'
    },
    {
      id: 'profile-management',
      title: 'Gerenciamento de Perfis',
      description: 'A lógica de gerenciamento de perfis está duplicada em vários lugares.',
      solution: 'Centralizar a lógica de gerenciamento de perfis em um único serviço.',
      status: 'pending'
    },
    {
      id: 'type-duplication',
      title: 'Duplicação de Tipos',
      description: 'Existem tipos duplicados em diferentes arquivos, o que pode levar a inconsistências.',
      solution: 'Centralizar as definições de tipos em um único arquivo.',
      status: 'resolved'
    },
    {
      id: 'data-sync',
      title: 'Sincronização de Dados',
      description: 'A sincronização de dados entre o cliente e o servidor não está otimizada.',
      solution: 'Implementar um sistema de cache e invalidação mais eficiente.',
      status: 'in_progress'
    },
    {
      id: 'error-handling',
      title: 'Tratamento de Erros',
      description: 'O tratamento de erros não está padronizado em toda a aplicação.',
      solution: 'Implementar um sistema centralizado de tratamento de erros.',
      status: 'pending'
    },
    {
      id: 'form-validation',
      title: 'Validação de Formulários',
      description: 'A validação de formulários está inconsistente e incompleta.',
      solution: 'Implementar um sistema de validação de formulários mais robusto.',
      status: 'pending'
    },
    {
      id: 'testing',
      title: 'Testes',
      description: 'A cobertura de testes está baixa e os testes existentes não são abrangentes.',
      solution: 'Aumentar a cobertura de testes e implementar testes mais abrangentes.',
      status: 'pending'
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'A aplicação apresenta problemas de performance em algumas operações.',
      solution: 'Otimizar as operações mais lentas e implementar lazy loading onde apropriado.',
      status: 'pending'
    }
  ]

  return problems
} 