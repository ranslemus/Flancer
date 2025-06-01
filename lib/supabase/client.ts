// app/lib/supabase/client.ts
import { Database } from '@/types/supabase'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createPagesBrowserClient<Database>()
