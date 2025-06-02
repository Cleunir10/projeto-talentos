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
          id: number
          nome: string
          descricao: string | null
          preco: number
          imagem_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nome: string
          descricao?: string | null
          preco: number
          imagem_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nome?: string
          descricao?: string | null
          preco?: number
          imagem_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
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
