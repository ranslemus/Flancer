// app/lib/supabase/server.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  return createServerComponentClient<Database>({ cookies: () => cookies() })
}
