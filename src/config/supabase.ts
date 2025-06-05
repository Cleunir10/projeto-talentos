import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseAnonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

export const getSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },    global: {
      fetch: (url: RequestInfo, init?: RequestInit) => {
        const options: RequestInit = {
          ...init,
          headers: {
            ...init?.headers,
            'X-Client-Info': 'supabase-js/2.x',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'include'
        }
        
        return fetch(url, options)
      }
    },
  })
}
