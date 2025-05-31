
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabase = createServerComponentClient<Database>({ cookies })
  return supabase
}
