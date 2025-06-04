"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Save, User, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/hooks/use-toast"

export default function EditProfile() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [clientData, setClientData] = useState(null)
  const [freelancerData, setFreelancerData] = useState(null)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    bio: "",
  })

  // Fetch user session and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error fetching user:", userError)
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Fetch client profile data
        const { data: client, error: clientError } = await supabase
          .from("client")
          .select("full_name, role")
          .eq("user_id", user.id)
          .single()

        if (clientError && clientError.code !== "PGRST116") {
          console.error("Error fetching client data:", clientError)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
        } else {
          setClientData(client)
        }

        // Fetch freelancer data (for bio)
        const { data: freelancer, error: freelancerError } = await supabase
          .from("freelancer")
          .select("bio")
          .eq("user_id", user.id)
          .single()

        if (freelancerError && freelancerError.code !== "PGRST116") {
          console.error("Error fetching freelancer data:", freelancerError)
          // Don't show toast for this error as the user might not be a freelancer
        } else if (freelancer) {
          setFreelancerData(freelancer)
        }

        // Combine data from both tables
        setFormData({
          full_name: client?.full_name || "",
          email: user.email || "",
          role: client?.role || "",
          bio: freelancer?.bio || "",
        })
      } catch (error) {
        console.error("Error in fetchUserData:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!formData.full_name.trim()) {
      toast({
        title: "Error",
        description: "Full name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Update client table
      const clientUpdateData = {
        full_name: formData.full_name.trim(),
        created_at: new Date().toISOString(),
      }

      const { error: clientError } = await supabase.from("client").update(clientUpdateData).eq("user_id", user.id)

      if (clientError) {
        throw clientError
      }

      // Update freelancer table if the user is a freelancer
      if (formData.role === "freelancer" || freelancerData) {
        // Check if freelancer record exists
        const { data: existingFreelancer, error: checkError } = await supabase
          .from("freelancer")
          .select("user_id")
          .eq("user_id", user.id)
          .single()

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking freelancer record:", checkError)
        }

        if (existingFreelancer) {
          // Update existing freelancer record
          const { error: freelancerError } = await supabase
            .from("freelancer")
            .update({ bio: formData.bio.trim() })
            .eq("user_id", user.id)

          if (freelancerError) {
            console.error("Error updating freelancer bio:", freelancerError)
            // Don't throw here, we already updated the client table successfully
          }
        } else if (formData.role === "freelancer") {
          // Create new freelancer record if user is a freelancer but record doesn't exist
          const { error: createError } = await supabase.from("freelancer").insert({
            user_id: user.id,
            bio: formData.bio.trim(),
          })

          if (createError) {
            console.error("Error creating freelancer record:", createError)
            // Don't throw here, we already updated the client table successfully
          }
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Redirect back to dashboard after successful update
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
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
      if (isNaN(date.getTime())) {
        return "Not available"
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Not available"
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not available"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Not available"
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting datetime:", error)
      return "Not available"
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please log in to edit your profile.</p>
            <Button asChild>
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
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
                maxLength={100}
              />
            </div>

            {/* Bio Field - Only show for freelancers */}
            {(formData.role === "freelancer" || freelancerData) && (
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself, your skills, and experience..."
                  rows={4}
                  className="resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Share your professional background, skills, and what makes you unique.
                  </p>
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Role Field (Read-only) */}
            {formData.role && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  disabled
                  className="bg-muted capitalize"
                />
                <p className="text-xs text-muted-foreground">Your account role cannot be changed.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link href="/dashboard">Cancel</Link>
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
              <span className="font-mono text-xs">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Created:</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sign In:</span>
              <span>{formatDateTime(user.last_sign_in_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email Verified:</span>
              <span className={user.email_confirmed_at ? "text-green-600" : "text-orange-600"}>
                {user.email_confirmed_at ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
