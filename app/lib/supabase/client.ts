// app/lib/supabase/client.ts
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'


export const createClient = () => {
  return createPagesBrowserClient<Database>()
}
