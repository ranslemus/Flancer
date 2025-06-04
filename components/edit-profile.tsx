"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Save, User } from "lucide-react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { toast } from "@/hooks/use-toast"

export default function EditProfile() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [client, setClient] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [userMetadata, setUserMetadata] = useState(null)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
  })
  const [navigating, setNavigating] = useState(false)

  // Use refs to prevent unnecessary re-renders and race conditions
  const isInitialized = useRef(false)
  const authSubscription = useRef(null)
  const loadingTimeout = useRef(null)

  // Handle session loading and user metadata
  useEffect(() => {
    let isMounted = true

    const initializeSession = async () => {
      if (isInitialized.current) return

      try {
        // Clear any existing timeout
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current)
        }

        // Set a timeout to prevent infinite loading
        loadingTimeout.current = setTimeout(() => {
          if (isMounted) {
            setSessionLoading(false)
            setLoading(false)
          }
        }, 10000) // 10 second timeout

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (currentSession?.user && isMounted) {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (isMounted) {
            setUserMetadata(user)
            setSessionLoading(false)
            isInitialized.current = true
          }
        } else if (isMounted) {
          setSessionLoading(false)
          isInitialized.current = true
        }

        // Clear the timeout since we completed successfully
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current)
          loadingTimeout.current = null
        }
      } catch (error) {
        console.error("Error initializing session:", error)
        if (isMounted) {
          setSessionLoading(false)
          setLoading(false)
        }
      }
    }

    // Only initialize if we don't have a session yet or if it's the first load
    if (!isInitialized.current) {
      initializeSession()
    }

    // Set up auth state listener with debouncing
    if (!authSubscription.current) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        // Only handle significant auth events, ignore token refresh
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          if (newSession?.user && isMounted) {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser()

              if (isMounted) {
                setUserMetadata(user)
              }
            } catch (error) {
              console.error("Error updating user metadata:", error)
            }
          } else if (event === "SIGNED_OUT" && isMounted) {
            setUserMetadata(null)
          }
        }
      })

      authSubscription.current = subscription
    }

    return () => {
      isMounted = false
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
    }
  }, [supabase])

  // Handle visibility change to prevent unnecessary reloads
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Don't do anything special on visibility change
      // Let the existing session management handle it
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      if (!session?.user || loading === false) return

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("client")
          .select("full_name, role")
          .eq("user_id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching client info:", error.message)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
        } else {
          setClient(data)
          setFormData({
            full_name: data.full_name || "",
            email: session.user.email || "",
            role: data.role || "",
          })
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if session is ready and we're not already loading
    if (!sessionLoading && session && isInitialized.current) {
      fetchClientData()
    }
  }, [session, sessionLoading, supabase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (authSubscription.current) {
        authSubscription.current.unsubscribe()
        authSubscription.current = null
      }
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from("client")
        .update({
          full_name: formData.full_name,
        })
        .eq("user_id", session.user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Set navigating state before redirect
      setNavigating(true)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not available"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Not available"
      return date.toLocaleDateString()
    } catch {
      return "Not available"
    }
  }

  // Show loading only if we're actually loading and haven't timed out
  if (sessionLoading && isInitialized.current === false) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading session...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please log in to edit your profile.</p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Use userMetadata if available, fallback to session.user
  const userData = userMetadata || session.user

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setNavigating(true)
              router.push("/dashboard")
            }}
            disabled={saving || navigating}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarFallback className="text-2xl">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  router.push("/dashboard")
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-xs">{userData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Created:</span>
              <span>{formatDate(userData.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sign In:</span>
              <span>{formatDate(userData.last_sign_in_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
