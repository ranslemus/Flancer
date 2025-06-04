"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { EditProfile } from "@/components/edit-profile"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
        return
      }

      setUserId(user.id)
      setLoading(false)
    }

    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Please log in to edit your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <EditProfile userId={userId} />
      </div>
    </div>
  )
}
