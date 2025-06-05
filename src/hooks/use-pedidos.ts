import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'

export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert']
export type PedidoUpdate = Database['public']['Tables']['pedidos']['Update']
export type PedidoItem = Database['public']['Tables']['pedido_itens']['Row']

export function usePedidos(userId: string | undefined) {
  return useQuery({
    queryKey: ['pedidos', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, pedido_itens(*, produto:produtos(*))')
        .eq('cliente_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as (Pedido & { pedido_itens: PedidoItem[] })[]
    },
    enabled: !!userId,
  })
}

export function usePedido(id: string | undefined) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, pedido_itens(*, produto:produtos(*), costureira:costureiras(*, profile:profiles(*)))')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Pedido & { pedido_itens: PedidoItem[] }
    },
    enabled: !!id,
  })
}

export function useCreatePedido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pedido, itens }: { 
      pedido: PedidoInsert, 
      itens: Database['public']['Tables']['pedido_itens']['Insert'][] 
    }) => {
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single()
      if (pedidoError) throw pedidoError

      // Adiciona o id do pedido aos itens
      const itensComPedido = itens.map(item => ({
        ...item,
        pedido_id: pedidoData.id
      }))

      const { error: itensError } = await supabase
        .from('pedido_itens')
        .insert(itensComPedido)
      if (itensError) throw itensError

      return pedidoData
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.pedido.cliente_id] })
    },
  })
}

export function useUpdatePedido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...update 
    }: PedidoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('pedidos')
        .update(update)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', data.cliente_id] })
      queryClient.invalidateQueries({ queryKey: ['pedido', data.id] })
    },
  })
}

export function useUpdatePedidoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id,
      ...update 
    }: Database['public']['Tables']['pedido_itens']['Update'] & { id: string }) => {
      const { data, error } = await supabase
        .from('pedido_itens')
        .update(update)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', data.pedido_id] })
    },
  })
}
