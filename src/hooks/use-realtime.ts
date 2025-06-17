import { useEffect } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useToast } from './use-toast'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface UseRealtimeOptions {
  table: string
  event?: RealtimeEvent
  filter?: string
  onEvent?: (payload: any) => void
  enabled?: boolean
}

export function useRealtime({
  table,
  event = 'INSERT',
  filter,
  onEvent,
  enabled = true
}: UseRealtimeOptions) {
  const { toast } = useToast()

  useEffect(() => {
    if (!enabled) return

    let channel: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Configurar o canal de assinatura
        channel = supabase
          .channel(`${table}_changes`)
          .on(
            'postgres_changes',
            {
              event,
              schema: 'public',
              table,
              filter
            },
            (payload) => {
              if (onEvent) {
                onEvent(payload)
              }

              // Notificar o usuário sobre a mudança
              const eventMessage = {
                INSERT: 'Novo item adicionado',
                UPDATE: 'Item atualizado',
                DELETE: 'Item removido'
              }[event]

              toast({
                description: eventMessage,
                duration: 3000
              })
            }
          )
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      } catch (error) {
        console.error('Erro ao configurar assinatura em tempo real:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível sincronizar em tempo real',
          variant: 'destructive'
        })
      }
    }

    setupSubscription()
  }, [table, event, filter, onEvent, enabled, toast])
} 