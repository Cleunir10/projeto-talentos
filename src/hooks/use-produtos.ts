import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Produto = Database['public']['Tables']['produtos']['Row']
type ProdutoInsert = Database['public']['Tables']['produtos']['Insert']
type ProdutoUpdate = Database['public']['Tables']['produtos']['Update']

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchProdutos()
  }, [])

  async function fetchProdutos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome')

      if (error) {
        throw error
      }

      setProdutos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar produtos'))
    } finally {
      setLoading(false)
    }
  }

  async function adicionarProduto(produto: ProdutoInsert) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert(produto)
        .select()
        .single()

      if (error) {
        throw error
      }

      setProdutos([...produtos, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao adicionar produto'))
      throw err
    }
  }

  async function atualizarProduto(id: string, produto: ProdutoUpdate) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setProdutos(produtos.map(p => p.id === id ? data : p))
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar produto'))
      throw err
    }
  }

  async function removerProduto(id: string) {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setProdutos(produtos.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao remover produto'))
      throw err
    }
  }

  return {
    produtos,
    loading,
    error,
    fetchProdutos,
    adicionarProduto,
    atualizarProduto,
    removerProduto
  }
}
