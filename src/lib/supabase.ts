import { createClient } from '@supabase/supabase-js'

// Estas credenciais são públicas e só têm acesso a dados públicos
const supabaseUrl = 'https://gdbpyoysmmcjirdsonhr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYnB5b3lzbW1jamlydHNvbmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MDM3MDgsImV4cCI6MjAxNzk3OTcwOH0.Cd7o0NGMk7KHB0tUCUVdzsJQ2MYCaX0-Zg-X6uBFQ6o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
