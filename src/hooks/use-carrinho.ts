import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './use-auth'
import type { Database } from '../lib/database.types'

type Produto = Database['public']['Tables']['produtos']['Row']
type ItemCarrinho = Database['public']['Tables']['carrinho_itens']['Row']

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCarrinho()
    }
  }, [user])

  async function fetchCarrinho() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carrinho_itens')
        .select('*, produto:produtos(*)')
        .eq('usuario_id', user?.id)

      if (error) {
        throw error
      }

      setItens(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar carrinho'))
    } finally {
      setLoading(false)
    }
  }

  async function adicionarAoCarrinho(produto: Produto, quantidade = 1) {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      const itemExistente = itens.find(item => item.produto_id === produto.id)

      if (itemExistente) {
        const { error } = await supabase
          .from('carrinho_itens')
          .update({ quantidade: itemExistente.quantidade + quantidade })
          .eq('id', itemExistente.id)

        if (error) throw error

        setItens(itens.map(item =>
          item.id === itemExistente.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        ))
      } else {
        const { data, error } = await supabase
          .from('carrinho_itens')
          .insert({
            usuario_id: user.id,
            produto_id: produto.id,
            quantidade,
            preco_unitario: produto.preco
          })
          .select('*, produto:produtos(*)')
          .single()

        if (error) throw error

        setItens([...itens, data])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao adicionar ao carrinho'))
      throw err
    }
  }

  async function removerDoCarrinho(itemId: string) {
    try {
      const { error } = await supabase
        .from('carrinho_itens')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItens(itens.filter(item => item.id !== itemId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao remover do carrinho'))
      throw err
    }
  }

  async function atualizarQuantidade(itemId: string, quantidade: number) {
    try {
      if (quantidade <= 0) {
        return removerDoCarrinho(itemId)
      }

      const { error } = await supabase
        .from('carrinho_itens')
        .update({ quantidade })
        .eq('id', itemId)

      if (error) throw error

      setItens(itens.map(item =>
        item.id === itemId
          ? { ...item, quantidade }
          : item
      ))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar quantidade'))
      throw err
    }
  }

  const total = itens.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0)

  return {
    itens,
    loading,
    error,
    total,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    fetchCarrinho
  }
}
