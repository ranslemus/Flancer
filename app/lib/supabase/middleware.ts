import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create the Supabase client bound to the request and response
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Get current session info
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Example: Redirect to login if user is not authenticated and accessing /dashboard
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Continue with the response if no redirect
  return res
}

// Define paths this middleware applies to
export const config = {
  matcher: ['/dashboard/:path*'],
}
