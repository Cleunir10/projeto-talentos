import { createClient } from '@supabase/supabase-js'

// Import a nova configuração
import { getSupabaseClient } from '../config/supabase'

// Cria o cliente usando a nova configuração
export const supabase = getSupabaseClient()

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Initial-Referrer': 'https://cleunir10.github.io',
      'X-Client-Info': 'supabase-js/2.x',
    },
  },
  db: {
    schema: 'public'
  },
}

// Função para verificar se uma URL é válida
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}

// Validação das variáveis de ambiente
if (!isValidUrl(supabaseUrl)) {
  throw new Error(`URL do Supabase inválida: ${supabaseUrl}`)
}

// Criação do cliente com retry
let retryCount = 0
const maxRetries = 3

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options)
