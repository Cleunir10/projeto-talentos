import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'

export type CarrinhoItem = Database['public']['Tables']['carrinho']['Row']
export type CarrinhoItemInsert = Database['public']['Tables']['carrinho']['Insert']
export type CarrinhoItemUpdate = Database['public']['Tables']['carrinho']['Update']

export function useCarrinho(userId: string | undefined) {
  return useQuery({
    queryKey: ['carrinho', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('carrinho')
        .select('*, produto:produtos(*)')
        .eq('user_id', userId)
      if (error) throw error
      return data as CarrinhoItem[]
    },
    enabled: !!userId,
  })
}

export function useAddToCarrinho() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: CarrinhoItemInsert) => {
      // Verifica se já existe o produto no carrinho
      const { data: existing } = await supabase
        .from('carrinho')
        .select('*')
        .eq('user_id', item.user_id!)
        .eq('produto_id', item.produto_id!)
        .maybeSingle()

      if (existing) {
        // Atualiza a quantidade se já existe
        const { data, error } = await supabase
          .from('carrinho')
          .update({ quantidade: existing.quantidade + item.quantidade })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        // Insere novo item se não existe
        const { data, error } = await supabase
          .from('carrinho')
          .insert(item)
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carrinho', variables.user_id] })
    },
  })
}

export function useUpdateCarrinhoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...item }: CarrinhoItemUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('carrinho')
        .update(item)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carrinho', variables.user_id] })
    },
  })
}

export function useRemoveFromCarrinho() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carrinho', variables.userId] })
    },
  })
}

export function useClearCarrinho() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['carrinho', userId] })
    },
  })
}
