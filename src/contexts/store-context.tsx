import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { useAuth } from './auth-context'
import { useRealtime } from '../hooks/use-realtime'

type Product = Database['public']['Tables']['produtos']['Row']
type CartItem = Database['public']['Tables']['carrinho_itens']['Row'] & {
  produtos: Product
}
type Order = Database['public']['Tables']['pedidos']['Row'] & {
  pedido_itens: (Database['public']['Tables']['pedido_itens']['Row'] & {
    produtos: Product
  })[]
}

interface StoreContextType {
  // Produtos
  products: Product[]
  isLoadingProducts: boolean
  errorProducts: Error | null
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Carrinho
  cart: CartItem[]
  isLoadingCart: boolean
  errorCart: Error | null
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateCartItem: (id: string, quantity: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  clearCart: () => Promise<void>

  // Pedidos
  orders: Order[]
  isLoadingOrders: boolean
  errorOrders: Error | null
  createOrder: (items: CartItem[]) => Promise<void>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Queries
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: errorProducts 
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Product[]
    }
  })

  const { 
    data: cart = [], 
    isLoading: isLoadingCart,
    error: errorCart 
  } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from('carrinho_itens')
        .select('*, produtos(*)')
        .eq('usuario_id', user.id)
      if (error) throw error
      return data as CartItem[]
    },
    enabled: !!user?.id
  })

  const { 
    data: orders = [], 
    isLoading: isLoadingOrders,
    error: errorOrders 
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, pedido_itens(*, produtos(*))')
        .eq('cliente_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Order[]
    },
    enabled: !!user?.id
  })

  // Realtime subscriptions
  useRealtime({
    table: 'produtos',
    onEvent: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  useRealtime({
    table: 'carrinho_itens',
    filter: user?.id ? `usuario_id=eq.${user.id}` : undefined,
    onEvent: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
    enabled: !!user?.id
  })

  useRealtime({
    table: 'pedidos',
    filter: user?.id ? `cliente_id=eq.${user.id}` : undefined,
    onEvent: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    },
    enabled: !!user?.id
  })

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      const { error } = await supabase
        .from('produtos')
        .insert(product)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string, product: Partial<Product> }) => {
      const { error } = await supabase
        .from('produtos')
        .update(product)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
      if (!user?.id) throw new Error('Usuário não autenticado')
      
      const { error } = await supabase
        .from('carrinho_itens')
        .insert({
          usuario_id: user.id,
          produto_id: productId,
          quantity
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string, quantity: number }) => {
      const { error } = await supabase
        .from('carrinho_itens')
        .update({ quantity })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('carrinho_itens')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado')
      
      const { error } = await supabase
        .from('carrinho_itens')
        .delete()
        .eq('usuario_id', user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  const createOrderMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      if (!user?.id) throw new Error('Usuário não autenticado')

      // Criar o pedido
      const { data: orderData, error: orderError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: user.id,
          status: 'pending',
          total: items.reduce((acc, item) => acc + (item.produtos?.preco || 0) * item.quantidade, 0)
        })
        .select()
        .single()
      
      if (orderError) throw orderError
      if (!orderData) throw new Error('Falha ao criar pedido')

      // Criar os itens do pedido
      const { error: itemsError } = await supabase
        .from('pedido_itens')
        .insert(
          items.map(item => ({
            pedido_id: orderData.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco: item.produtos?.preco || 0
          }))
        )
      
      if (itemsError) throw itemsError

      // Limpar o carrinho
      await clearCartMutation.mutateAsync()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    }
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Order['status'] }) => {
      const { error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    }
  })

  return (
    <StoreContext.Provider
      value={{
        // Produtos
        products,
        isLoadingProducts,
        errorProducts: errorProducts as Error | null,
        addProduct: addProductMutation.mutateAsync,
        updateProduct: (id, product) => updateProductMutation.mutateAsync({ id, product }),
        deleteProduct: deleteProductMutation.mutateAsync,

        // Carrinho
        cart,
        isLoadingCart,
        errorCart: errorCart as Error | null,
        addToCart: (productId, quantity) => addToCartMutation.mutateAsync({ productId, quantity }),
        updateCartItem: (id, quantity) => updateCartItemMutation.mutateAsync({ id, quantity }),
        removeFromCart: removeFromCartMutation.mutateAsync,
        clearCart: clearCartMutation.mutateAsync,

        // Pedidos
        orders,
        isLoadingOrders,
        errorOrders: errorOrders as Error | null,
        createOrder: createOrderMutation.mutateAsync,
        updateOrderStatus: (id, status) => updateOrderStatusMutation.mutateAsync({ id, status })
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
} 