"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, Home, RefreshCcw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertOctagon className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-xl">Critical Error</CardTitle>
              <CardDescription>
                We're sorry, but a critical error has occurred. Our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">Error: {error.message || "An unexpected error occurred"}</p>
                {error.digest && <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={reset}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
