"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Github } from "lucide-react"
import { signIn } from "@/app/lib/supabase/actions"
import { createClient } from "@/app/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const supabase = React.useMemo(() => createClient(), [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

    if (result?.error) {
      setFormError(result.error)
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: result.error,
      })
    }
    // No need to handle success case as the action redirects to dashboard
  }

  const handleGithubSignIn = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      setFormError(error.message)
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message,
      })
    }
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        >
          <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for better text readability */}
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            Flancer
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Flancer connected me with clients who valued my fresh perspective, even as a self-taught developer with
              no formal experience."
            </p>
            <footer className="text-sm">Michael Smith</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Sign in</CardTitle>
                <CardDescription>Enter your email and password to sign in to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formError && (
                  <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">{formError}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-primary underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" name="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleGithubSignIn}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline">
              Sign up
            </Link>
          </div>

          <div className="px-8 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
