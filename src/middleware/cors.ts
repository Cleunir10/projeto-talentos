import { supabase } from '../lib/supabase'

// Adiciona interceptor para todas as requisições
supabase.rest.interceptors.request.use(async (config) => {
  // Adiciona headers CORS em todas as requisições
  config.headers = {
    ...config.headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, x-client-info, apikey, Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  }
  return config
})
