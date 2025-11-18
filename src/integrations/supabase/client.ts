// Sistema Mock para MVP - Remove dependência de Supabase
import { createClient as createMockClient } from '../../lib/mock/mockSupabase'

// Usar mock client para MVP - sem custos de API
export const supabase = createMockClient('', '')

// Para futura integração com Supabase real, descomente abaixo:
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
*/