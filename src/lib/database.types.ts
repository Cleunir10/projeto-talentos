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
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          cliente_id: string | null
          status: string | null
          subtotal: number
          desconto: number | null
          frete: number | null
          taxa_plataforma: number | null
          total: number
          endereco_entrega: Json
          metodo_envio: string | null
          codigo_rastreamento: string | null
          previsao_entrega: string | null
          data_envio: string | null
          data_entrega: string | null
          metodo_pagamento: string | null
          status_pagamento: string | null
          id_pagamento_externo: string | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          numero_pedido: string
          cliente_id?: string | null
          status?: string | null
          subtotal: number
          desconto?: number | null
          frete?: number | null
          taxa_plataforma?: number | null
          total: number
          endereco_entrega: Json
          metodo_envio?: string | null
          codigo_rastreamento?: string | null
          previsao_entrega?: string | null
          data_envio?: string | null
          data_entrega?: string | null
          metodo_pagamento?: string | null
          status_pagamento?: string | null
          id_pagamento_externo?: string | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          numero_pedido?: string
          cliente_id?: string | null
          status?: string | null
          subtotal?: number
          desconto?: number | null
          frete?: number | null
          taxa_plataforma?: number | null
          total?: number
          endereco_entrega?: Json
          metodo_envio?: string | null
          codigo_rastreamento?: string | null
          previsao_entrega?: string | null
          data_envio?: string | null
          data_entrega?: string | null
          metodo_pagamento?: string | null
          status_pagamento?: string | null
          id_pagamento_externo?: string | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      pedido_itens: {
        Row: {
          id: string
          pedido_id: string | null
          produto_id: string | null
          costureira_id: string | null
          quantidade: number
          preco_unitario: number
          preco_total: number
          variacoes: Json | null
          personalizacoes: string | null
          status_item: string | null
          tempo_producao_estimado: number | null
          data_inicio_producao: string | null
          data_conclusao_producao: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          pedido_id?: string | null
          produto_id?: string | null
          costureira_id?: string | null
          quantidade: number
          preco_unitario: number
          preco_total: number
          variacoes?: Json | null
          personalizacoes?: string | null
          status_item?: string | null
          tempo_producao_estimado?: number | null
          data_inicio_producao?: string | null
          data_conclusao_producao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          pedido_id?: string | null
          produto_id?: string | null
          costureira_id?: string | null
          quantidade?: number
          preco_unitario?: number
          preco_total?: number
          variacoes?: Json | null
          personalizacoes?: string | null
          status_item?: string | null
          tempo_producao_estimado?: number | null
          data_inicio_producao?: string | null
          data_conclusao_producao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      avaliacoes_costureira: {
        Row: {
          id: string
          costureira_id: string | null
          cliente_id: string | null
          pedido_id: string | null
          nota: number
          comentario: string | null
          aspectos: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          costureira_id?: string | null
          cliente_id?: string | null
          pedido_id?: string | null
          nota: number
          comentario?: string | null
          aspectos?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          costureira_id?: string | null
          cliente_id?: string | null
          pedido_id?: string | null
          nota?: number
          comentario?: string | null
          aspectos?: Json | null
          created_at?: string | null
        }
      }
      avaliacoes_produto: {
        Row: {
          id: string
          produto_id: string | null
          cliente_id: string | null
          pedido_item_id: string | null
          nota: number
          titulo: string | null
          comentario: string | null
          fotos: string[] | null
          verificada: boolean | null
          util_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          produto_id?: string | null
          cliente_id?: string | null
          pedido_item_id?: string | null
          nota: number
          titulo?: string | null
          comentario?: string | null
          fotos?: string[] | null
          verificada?: boolean | null
          util_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          produto_id?: string | null
          cliente_id?: string | null
          pedido_item_id?: string | null
          nota?: number
          titulo?: string | null
          comentario?: string | null
          fotos?: string[] | null
          verificada?: boolean | null
          util_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      carrinho: {
        Row: {
          id: string
          user_id: string | null
          produto_id: string | null
          quantidade: number
          variacoes: Json | null
          personalizacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          produto_id?: string | null
          quantidade: number
          variacoes?: Json | null
          personalizacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          produto_id?: string | null
          quantidade?: number
          variacoes?: Json | null
          personalizacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categorias: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          categoria_pai: string | null
          slug: string
          icone: string | null
          ativa: boolean | null
          ordem: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          categoria_pai?: string | null
          slug: string
          icone?: string | null
          ativa?: boolean | null
          ordem?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          categoria_pai?: string | null
          slug?: string
          icone?: string | null
          ativa?: boolean | null
          ordem?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      costureiras: {
        Row: {
          id: string
          especialidades: string[] | null
          experiencia_anos: number | null
          portfolio_url: string | null
          certificacoes: string[] | null
          avaliacoes_media: number | null
          total_vendas: number | null
          total_avaliacoes: number | null
          comissao_plataforma: number | null
          dados_bancarios: Json | null
          verificada: boolean | null
          data_verificacao: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          especialidades?: string[] | null
          experiencia_anos?: number | null
          portfolio_url?: string | null
          certificacoes?: string[] | null
          avaliacoes_media?: number | null
          total_vendas?: number | null
          total_avaliacoes?: number | null
          comissao_plataforma?: number | null
          dados_bancarios?: Json | null
          verificada?: boolean | null
          data_verificacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          especialidades?: string[] | null
          experiencia_anos?: number | null
          portfolio_url?: string | null
          certificacoes?: string[] | null
          avaliacoes_media?: number | null
          total_vendas?: number | null
          total_avaliacoes?: number | null
          comissao_plataforma?: number | null
          dados_bancarios?: Json | null
          verificada?: boolean | null
          data_verificacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      produtos: {
        Row: {
          id: string
          costureira_id: string | null
          categoria_id: string | null
          nome: string
          descricao: string
          descricao_curta: string | null
          preco: number
          preco_promocional: number | null
          sku: string | null
          estoque: number | null
          peso: number | null
          dimensoes: Json | null
          materiais: string[] | null
          cores_disponiveis: string[] | null
          tamanhos_disponiveis: string[] | null
          tempo_producao: number | null
          produto_personalizado: boolean | null
          sustentavel: boolean | null
          origem_materiais: string | null
          tecnicas_utilizadas: string[] | null
          cuidados_conservacao: string | null
          status: string | null
          destaque: boolean | null
          visualizacoes: number | null
          vendas_total: number | null
          avaliacoes_media: number | null
          total_avaliacoes: number | null
          created_at: string | null
          updated_at: string | null
          imagem_url: string | null
        }
        Insert: {
          id?: string
          costureira_id?: string | null
          categoria_id?: string | null
          nome: string
          descricao: string
          descricao_curta?: string | null
          preco: number
          preco_promocional?: number | null
          sku?: string | null
          estoque?: number | null
          peso?: number | null
          dimensoes?: Json | null
          materiais?: string[] | null
          cores_disponiveis?: string[] | null
          tamanhos_disponiveis?: string[] | null
          tempo_producao?: number | null
          produto_personalizado?: boolean | null
          sustentavel?: boolean | null
          origem_materiais?: string | null
          tecnicas_utilizadas?: string[] | null
          cuidados_conservacao?: string | null
          status?: string | null
          destaque?: boolean | null
          visualizacoes?: number | null
          vendas_total?: number | null
          avaliacoes_media?: number | null
          total_avaliacoes?: number | null
          created_at?: string | null
          updated_at?: string | null
          imagem_url?: string | null
        }
        Update: {
          id?: string
          costureira_id?: string | null
          categoria_id?: string | null
          nome?: string
          descricao?: string
          descricao_curta?: string | null
          preco?: number
          preco_promocional?: number | null
          sku?: string | null
          estoque?: number | null
          peso?: number | null
          dimensoes?: Json | null
          materiais?: string[] | null
          cores_disponiveis?: string[] | null
          tamanhos_disponiveis?: string[] | null
          tempo_producao?: number | null
          produto_personalizado?: boolean | null
          sustentavel?: boolean | null
          origem_materiais?: string | null
          tecnicas_utilizadas?: string[] | null
          cuidados_conservacao?: string | null
          status?: string | null
          destaque?: boolean | null
          visualizacoes?: number | null
          vendas_total?: number | null
          avaliacoes_media?: number | null
          total_avaliacoes?: number | null
          created_at?: string | null
          updated_at?: string | null
          imagem_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          nome_completo: string
          telefone: string | null
          data_nascimento: string | null
          foto_perfil: string | null
          tipo_usuario: string
          status: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          nome_completo: string
          telefone?: string | null
          data_nascimento?: string | null
          foto_perfil?: string | null
          tipo_usuario: string
          status?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          nome_completo?: string
          telefone?: string | null
          data_nascimento?: string | null
          foto_perfil?: string | null
          tipo_usuario?: string
          status?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
