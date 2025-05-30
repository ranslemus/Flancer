'use server'
import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile } from "@/types/supabase"


export async function getSession() {
  const supabase = createClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // 🔍 Debugging logs
  console.log('[getSession] Session:', session)
  if (error) console.error('[getSession] Error:', error)

  return session
}



export async function getUserProfile() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const supabase = createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return profile as Profile | null
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    console.warn('[requireAuth] No session found, redirecting')
    redirect('/auth/login')
  }

  return session
}


export async function requireClientRole() {
  const session = await requireAuth()
  const supabase = createClient()

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  if (!profile || profile.user_type !== "client") {
    redirect("/dashboard")
  }

  return session
}

export async function requireFreelancerRole() {
  const session = await requireAuth()
  const supabase = createClient()

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  if (!profile || profile.user_type !== "freelancer") {
    redirect("/dashboard")
  }

  return session
}
