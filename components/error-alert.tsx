"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface ErrorAlertProps {
  title?: string
  message: string
  onDismiss?: () => void
  onRetry?: () => void
  variant?: "default" | "destructive"
}

export function ErrorAlert({ title = "Error", message, onDismiss, onRetry, variant = "destructive" }: ErrorAlertProps) {
  return (
    <Alert variant={variant} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-1">{message}</AlertDescription>
      </div>
      <div className="flex gap-2 ml-4">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  )
}
