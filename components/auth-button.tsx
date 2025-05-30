"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/lib/supabase/actions"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

interface AuthButtonProps {
  session: boolean
}

export function AuthButton({ session }: AuthButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }

  return session ? (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? (
        "Signing out..."
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </>
      )}
    </Button>
  ) : (
    <Button asChild>
      <Link href="/auth/login">Sign in</Link>
    </Button>
  )
}
