import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://simqszeoovjipujuxeus.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbXFzemVvb3ZqaXB1anV4ZXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjY2MjcsImV4cCI6MjA3MDQ0MjYyN30.69H00rw0lDckdon_YvZet-O66qqo3a7sLPCY9M3DxJw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)