import { createClient } from '@supabase/supabase-js'

// Estas credenciais são públicas e só têm acesso a dados públicos
const supabaseUrl = 'https://rlfqurnrqufpkzygryue.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZnF1cm5ycXVmcGt6eWdyeXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MDI4MTcsImV4cCI6MjAxNzk3ODgxN30.DSOB_XMkAhBLPIQFG-OFGYqGHm3XPGS6lvfW87qIHE8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
