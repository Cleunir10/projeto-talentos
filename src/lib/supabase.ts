import { createClient } from '@supabase/supabase-js'

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.__SUPABASE_URL__
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.__SUPABASE_ANON_KEY__

if (!supabaseUrl) throw new Error('Missing Supabase URL')
if (!supabaseAnonKey) throw new Error('Missing Supabase Anon Key')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Initial-Referrer': 'https://cleunir10.github.io/projeto-talentos/',
      'X-Client-Info': 'projeto-talentos'
    },
  }
})
