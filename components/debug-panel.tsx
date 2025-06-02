"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Bug, Database } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DebugPanelProps {
  data?: any
  error?: string | null
  loading?: boolean
}

export function DebugPanel({ data, error, loading }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const supabase = createClientComponentClient()

  const runDatabaseTests = async () => {
    setTesting(true)
    const results: any = {}

    try {
      // Test notifications table
      console.log("🧪 Testing notifications table...")
      const { data: notificationsTest, error: notificationsError } = await supabase
        .from("notifications")
        .select("count")
        .limit(1)

      results.notifications = {
        exists: !notificationsError,
        error: notificationsError?.message,
        code: notificationsError?.code,
      }

      // Test user authentication
      console.log("🧪 Testing user authentication...")
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      results.auth = {
        authenticated: !!user,
        userId: user?.id,
        error: userError?.message,
      }

      // Test client table
      console.log("🧪 Testing client table...")
      if (user) {
        const { data: clientTest, error: clientError } = await supabase
          .from("client")
          .select("user_id")
          .eq("user_id", user.id)
          .limit(1)

        results.client = {
          exists: !clientError,
          hasProfile: !!clientTest?.length,
          error: clientError?.message,
        }
      }

      // Test serviceList table
      console.log("🧪 Testing serviceList table...")
      const { data: servicesTest, error: servicesError } = await supabase.from("serviceList").select("count").limit(1)

      results.services = {
        exists: !servicesError,
        error: servicesError?.message,
      }
    } catch (error) {
      console.error("Test error:", error)
      results.general = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    setTestResults(results)
    setTesting(false)
  }

  if (process.env.NODE_ENV === "production") {
    return null // Don't show debug panel in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="bg-background">
            <Bug className="mr-2 h-4 w-4" />
            Debug
            {isOpen ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2 w-80 max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Debug Information</CardTitle>
              <CardDescription className="text-xs">Development mode only</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Indicators */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <div className="flex gap-2">
                  <Badge variant={loading ? "secondary" : "outline"}>{loading ? "Loading" : "Loaded"}</Badge>
                  <Badge variant={error ? "destructive" : "default"}>{error ? "Error" : "OK"}</Badge>
                </div>
              </div>

              {/* Error Details */}
              {error && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-600">Error</h4>
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-700 font-mono">{error}</p>
                  </div>
                </div>
              )}

              {/* Data Preview */}
              {data && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data</h4>
                  <div className="bg-muted rounded p-2 max-h-32 overflow-y-auto">
                    <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Database Tests */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Database Tests</h4>
                  <Button size="sm" variant="outline" onClick={runDatabaseTests} disabled={testing}>
                    <Database className="mr-1 h-3 w-3" />
                    {testing ? "Testing..." : "Run Tests"}
                  </Button>
                </div>

                {Object.keys(testResults).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(testResults).map(([key, result]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="capitalize">{key}</span>
                        <Badge
                          variant={result.exists || result.authenticated ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {result.exists || result.authenticated ? "✓" : "✗"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => console.log("Current data:", data)}>
                    Log Data
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                    Reload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
