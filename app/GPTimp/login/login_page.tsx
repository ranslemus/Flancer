"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Github } from "lucide-react"
import { emailLogin } from "./actions"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // You can change this route based on success
    }, 1500)
  }

  return (
    <section className="h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required name="password"/>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none"
              >
                Remember me
              </Label>
            </div>

            {searchParams.get("message") && (
              <div className="text-sm font-medium text-destructive">
                {searchParams.get("message")}
              </div>
            )}
            <Button
              className="w-full"
              formAction={emailLogin}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline text-primary">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </section>
  )
}
 