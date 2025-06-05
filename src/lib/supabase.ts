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
        'X-Custom-Header': 'application/json'
      }
    },
    db: {
      schema: 'public'
    }
  }
)

// Função auxiliar para verificar a conexão
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      console.error('Erro na conexão com o Supabase:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('Erro inesperado ao testar conexão:', err)
    return { success: false, error: 'Erro inesperado ao conectar com o banco de dados' }
  }
}
