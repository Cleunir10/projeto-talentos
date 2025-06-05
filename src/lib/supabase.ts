import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Verifica se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY')

// Cria o cliente Supabase com as configurações adequadas
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Initial-Referrer': 'https://cleunir10.github.io',
        'X-Client-Info': 'supabase-js/2.x',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type'
      }
    },
    db: {
      schema: 'public'
    }
  }
)
