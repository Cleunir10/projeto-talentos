import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import type { User } from '@supabase/supabase-js'

export type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id!)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
    },
  })
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      profile,
    }: {
      email: string
      password: string
      profile: Omit<Profile, 'id' | 'email'>
    }) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            ...profile,
            id: authData.user.id,
            email,
          })
        if (profileError) throw profileError
      }

      return authData
    },
  })
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  })
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar conta'))
      throw err
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao fazer login'))
      throw err
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao fazer logout'))
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }
}
