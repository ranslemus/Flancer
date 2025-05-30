import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">404</CardTitle>
          <CardTitle className="text-xl mb-2">Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist or has been moved.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Check the URL or navigate back to the homepage to find what you're looking for.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex w-full space-x-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
