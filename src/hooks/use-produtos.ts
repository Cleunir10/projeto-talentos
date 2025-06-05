import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'

export type Produto = Database['public']['Tables']['produtos']['Row']
export type ProdutoInsert = Database['public']['Tables']['produtos']['Insert']
export type ProdutoUpdate = Database['public']['Tables']['produtos']['Update']

export function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*, costureira:costureiras(id, profiles(*)), categoria:categorias(*)')
        .eq('status', 'ativo')
      if (error) throw error
      return data as Produto[]
    },
  })
}

export function useProduto(id: string | undefined) {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('produtos')
        .select('*, costureira:costureiras(id, profiles(*)), categoria:categorias(*), avaliacoes:avaliacoes_produto(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Produto
    },
    enabled: !!id,
  })
}

export function useCreateProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (produto: ProdutoInsert) => {
      const { data, error } = await supabase
        .from('produtos')
        .insert(produto)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
  })
}

export function useUpdateProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...produto }: ProdutoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      queryClient.invalidateQueries({ queryKey: ['produto', data.id] })
    },
  })
}

export function useDeleteProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
  })
}
