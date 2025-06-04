import { Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Sent!</CardTitle>
          <CardDescription className="text-base">Please check your email</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            We've sent you an email with further instructions. Please check your inbox and follow the link to continue.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Don't see the email? Check your spam folder or try again.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
