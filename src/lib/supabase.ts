import { createClient } from '@supabase/supabase-js'

// Estas credenciais são públicas e só têm acesso a dados públicos
const supabaseUrl = 'https://rftmgmpxcnkkheyrxzwa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdG1nbXB4Y25ra2hleXJ4endhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MDQ5ODAsImV4cCI6MjAxNzk4MDk4MH0.LxVZsdZ_t5EFFPBBy2OC6thF0ddmLIivOoQVezEo_dI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
