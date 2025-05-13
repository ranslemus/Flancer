"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Home, RefreshCcw } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            We apologize for the inconvenience. An error occurred while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">Error: {error.message || "An unexpected error occurred"}</p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex w-full space-x-2">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button className="flex-1" onClick={reset}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
