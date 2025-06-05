export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      produtos: {
        Row: {
          id: string
          costureira_id: string
          nome: string
          descricao: string
          descricao_curta: string
          preco: number
          preco_promocional: number | null
          categoria_id: string
          imagem_url: string
          estoque: number
          peso: number
          dimensoes: Json
          material: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['produtos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['produtos']['Insert']>
      }
      carrinho_itens: {
        Row: {
          id: string
          usuario_id: string
          produto_id: string
          quantidade: number
          preco_unitario: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['carrinho_itens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['carrinho_itens']['Insert']>
      }
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          cliente_id: string
          status: string
          subtotal: number
          desconto: number | null
          frete: number
          taxa_plataforma: number
          total: number
          endereco_entrega: {
            rua: string
            numero: string
            complemento?: string
            bairro: string
            cidade: string
            estado: string
            cep: string
          }
          metodo_envio: string | null
          codigo_rastreamento: string | null
          previsao_entrega: string | null
          data_envio: string | null
          data_entrega: string | null
          metodo_pagamento: string | null
          status_pagamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pedidos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pedidos']['Insert']>
      }
      pedido_itens: {
        Row: {
          id: string
          pedido_id: string
          produto_id: string
          quantidade: number
          preco_unitario: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pedido_itens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pedido_itens']['Insert']>
      }
      categorias: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categorias']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categorias']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          nome: string
          tipo: 'costureira' | 'cliente'
          telefone: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
}
