// app/lib/supabase/server.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies() // ← safely get the cookies
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}
