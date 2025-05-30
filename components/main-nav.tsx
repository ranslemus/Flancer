"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils"
import type { Profile } from "@/types/supabase"

interface MainNavProps {
  user: Profile | null
}

export function MainNav({ user }: MainNavProps) {
  const pathname = usePathname()
  const isClient = user?.user_type === "client"
  const isFreelancer = user?.user_type === "freelancer"

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Flancer</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>

        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>

        {/* Client-specific navigation items */}
        {isClient && (
          <>
            <Link
              href="/find-freelancers"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/find-freelancers") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Find Freelancers
            </Link>
            <Link
              href="/jobs/post"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/jobs/post" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Post a Job
            </Link>
          </>
        )}

        {/* Freelancer-specific navigation items */}
        {isFreelancer && (
          <Link
            href="/jobs"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/jobs" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Find Jobs
          </Link>
        )}

        {/* Public navigation items */}
        <Link
          href="/how-it-works"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/how-it-works" ? "text-foreground" : "text-foreground/60",
          )}
        >
          How It Works
        </Link>
      </nav>
    </div>
  )
}
