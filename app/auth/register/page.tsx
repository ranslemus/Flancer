"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"
import { signUp } from "@/lib/supabase/actions"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [userType, setUserType] = useState("freelancer")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFormSuccess(null)

    const formData = new FormData(e.currentTarget)
    formData.set("userType", userType)

    // Check if passwords match
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Passwords do not match",
      })
      return
    }

    const result = await signUp(formData)

    if (result?.error) {
      setFormError(result.error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: result.error,
      })
    } else if (result?.success) {
      setFormSuccess(result.success)
      toast({
        title: "Registration successful",
        description: result.success,
      })
    }

    setIsLoading(false)
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
              "Flancer helped me showcase my skills and connect with clients even though I had no professional
              experience. Within months, I built a portfolio that landed me my dream job."
            </p>
            <footer className="text-sm">Sarah Parker</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Sign up to start your journey as a freelancer or client</p>
          </div>

          {formSuccess ? (
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">Check your email</CardTitle>
                <CardDescription className="text-center">{formSuccess}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
                <p>Didn't receive an email? Check your spam folder or try again.</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/auth/login")}>
                  Back to login
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs defaultValue="freelancer" value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="freelancer">Freelancer</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
              </TabsList>

              <TabsContent value="freelancer">
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Sign up as a Freelancer</CardTitle>
                    <CardDescription>Create your profile and start offering your services</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {formError && (
                        <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">{formError}</div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" name="confirm-password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Skill Area</Label>
                        <RadioGroup defaultValue="web-development" name="skill-area" className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="web-development" id="web-development" />
                            <Label htmlFor="web-development">Web Development</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mobile-apps" id="mobile-apps" />
                            <Label htmlFor="mobile-apps">Mobile Apps</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ui-ux" id="ui-ux" />
                            <Label htmlFor="ui-ux">UI/UX Design</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" name="terms" required />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary underline">
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary underline">
                            privacy policy
                          </Link>
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary underline">
                    Sign in
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="client">
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Sign up as a Client</CardTitle>
                    <CardDescription>Create your account to find and hire talented freelancers</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {formError && (
                        <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">{formError}</div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="client-name">Full Name</Label>
                        <Input id="client-name" name="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-email">Email</Label>
                        <Input id="client-email" name="email" type="email" placeholder="john@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input id="company" name="company" placeholder="Your Company" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-password">Password</Label>
                        <Input id="client-password" name="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-confirm-password">Confirm Password</Label>
                        <Input id="client-confirm-password" name="confirm-password" type="password" required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="client-terms" name="terms" required />
                        <label
                          htmlFor="client-terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary underline">
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary underline">
                            privacy policy
                          </Link>
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary underline">
                    Sign in
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="px-8 text-center text-sm text-muted-foreground">
            <div className="mt-4 flex flex-col space-y-2">
              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>
              <div className="flex justify-center space-x-6">
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                  <span>No Experience Required</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                  <span>Free to Join</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
