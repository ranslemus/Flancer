'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  const supabase = await createServerComponentClient<Database>({ cookies })
  return supabase
}
