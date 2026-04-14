import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este objeto 'supabase' es el que usaremos para todas las consultas
export const supabase = createClient(supabaseUrl, supabaseAnonKey)