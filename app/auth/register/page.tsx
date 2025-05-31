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

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
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

          <Tabs defaultValue="freelancer" className="w-full">
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
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Skill Area</Label>
                      <RadioGroup defaultValue="web-development" className="grid grid-cols-2 gap-2">
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
                      <Checkbox id="terms" required />
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
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Full Name</Label>
                      <Input id="client-name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <Input id="client-email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" placeholder="Your Company" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-password">Password</Label>
                      <Input id="client-password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-confirm-password">Confirm Password</Label>
                      <Input id="client-confirm-password" type="password" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="client-terms" required />
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
            </div>More actions
          </div>
        </div>
      </div>
    </div>
  )
}