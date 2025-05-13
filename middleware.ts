import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition for protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (request.nextUrl.pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check role-based access for client-only pages
  if (
    (request.nextUrl.pathname.startsWith("/find-freelancers") ||
      request.nextUrl.pathname.startsWith("/jobs/post") ||
      request.nextUrl.pathname.startsWith("/jobs/my-jobs")) &&
    session
  ) {
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

    if (!profile || profile.user_type !== "client") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Check role-based access for freelancer-only pages
  if ((request.nextUrl.pathname === "/jobs" || request.nextUrl.pathname.startsWith("/jobs/applications")) && session) {
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

    if (!profile || profile.user_type !== "freelancer") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/find-freelancers/:path*",
    "/jobs/:path*",
    "/projects/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
}
