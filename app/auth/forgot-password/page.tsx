"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { resetPassword } from "@/lib/supabase/actions"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result?.error) {
      setFormError(result.error)
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else if (result?.success) {
      setIsSubmitted(true)
      toast({
        title: "Success",
        description: result.success,
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {!isSubmitted ? (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Forgot password</CardTitle>
                <CardDescription>Enter your email address and we'll send you a reset link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formError && (
                  <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">{formError}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to your email address. Please check your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
              <p>Didn't receive an email? Check your spam folder or try again.</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                Try again
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/auth/login" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
