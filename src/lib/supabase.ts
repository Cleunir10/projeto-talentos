import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Supabase configuration
const supabaseUrl = 'https://xutuizuvnscadwrllmkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dHVpenV2bnNjYWR3cmxsbWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODkzMTQsImV4cCI6MjA2NDQ2NTMxNH0.fdAlCDBE3h270sd4TY-T8XANKb_2nw6cAhv8PT8Xgg4'

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
        'X-Client-Info': 'supabase-js/2.x',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    },
    db: {
      schema: 'public'
    }
  }
)

// Função auxiliar para verificar a conexão e autenticação
export const testDatabaseConnection = async () => {
  try {
    // Verificar status da autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Erro ao verificar sessão:', authError)
    }

    // Tentar acessar a tabela produtos
    const { data, error } = await supabase
      .from('produtos')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      console.error('Erro na conexão com o Supabase:', error)
      return { 
        success: false, 
        error: error.message,
        isAuthenticated: !!session,
        statusCode: error.code 
      }
    }
    
    return { 
      success: true, 
      data,
      isAuthenticated: !!session 
    }
  } catch (err) {
    console.error('Erro inesperado ao testar conexão:', err)
    return { 
      success: false, 
      error: 'Erro inesperado ao conectar com o banco de dados',
      isAuthenticated: false
    }
  }
}
