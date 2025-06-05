import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Pedido = Database['public']['Tables']['pedidos']['Row']

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchPedidos()
    }
  }, [user])

  async function fetchPedidos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('cliente_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPedidos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar pedidos'))
    } finally {
      setLoading(false)
    }
  }

  async function criarPedido(
    itensCarrinho: Array<{produto_id: string; quantidade: number; preco_unitario: number}>,
    enderecoEntrega: any,
    metodoPagamento: string
  ) {
    try {
      // Calcular valores do pedido
      const subtotal = itensCarrinho.reduce((acc, item) => 
        acc + (item.preco_unitario * item.quantidade), 0
      )
      const frete = 0 // Implementar cálculo de frete
      const taxaPlataforma = subtotal * 0.05 // 5% de taxa
      const total = subtotal + frete + taxaPlataforma

      // Criar pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: user?.id,
          numero_pedido: `PED-${Date.now()}`,
          status: 'pendente',
          subtotal,
          frete,
          taxa_plataforma: taxaPlataforma,
          total,
          endereco_entrega: enderecoEntrega,
          metodo_pagamento: metodoPagamento,
          status_pagamento: 'pendente'
        })
        .select()
        .single()

      if (pedidoError) throw pedidoError

      // Criar itens do pedido
      const { error: itensError } = await supabase
        .from('pedido_itens')
        .insert(
          itensCarrinho.map(item => ({
            pedido_id: pedido.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario
          }))
        )

      if (itensError) throw itensError

      // Limpar carrinho
      const { error: carrinhoError } = await supabase
        .from('carrinho_itens')
        .delete()
        .eq('usuario_id', user?.id)

      if (carrinhoError) throw carrinhoError

      setPedidos([pedido, ...pedidos])
      return pedido
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar pedido'))
      throw err
    }
  }

  async function atualizarStatusPedido(pedidoId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('id', pedidoId)
        .select()
        .single()

      if (error) throw error

      setPedidos(pedidos.map(p => p.id === pedidoId ? data : p))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar status do pedido'))
      throw err
    }
  }

  return {
    pedidos,
    loading,
    error,
    criarPedido,
    atualizarStatusPedido,
    fetchPedidos
  }
}
