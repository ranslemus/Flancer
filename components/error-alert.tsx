"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorAlertProps {
  message: string
  onDismiss?: () => void
  title?: string
}

export function ErrorAlert({ message, onDismiss, title = "Error" }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <div className="flex items-start justify-between">
        <AlertDescription className="mt-1">{message}</AlertDescription>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="ml-2 h-8 px-2">
            Dismiss
          </Button>
        )}
      </div>
    </Alert>
  )
}
