"use client"

// DYNAMIC ROUTING EXPLANATION:
// File path: app/services/[id]/page.tsx
// URL: http://localhost:3000/services/ea86f2e3-2e28-48c9-ba3b-7a1163184dcc
//
// The [id] in the folder name creates a dynamic route parameter
// Next.js automatically captures "ea86f2e3-2e28-48c9-ba3b-7a1163184dcc"
// and makes it available as params.id
//
// So when someone visits /services/ea86f2e3-2e28-48c9-ba3b-7a1163184dcc
// → params.id = "ea86f2e3-2e28-48c9-ba3b-7a1163184dcc"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Mail, MessageCircle, DollarSign, User, Calendar, Clock } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ServiceData {
  service_id: string
  freelancer_id: string
  service_name: string
  price_range: [number, number]
  service_description: string
  category: string[]
  service_pictures?: string
  created_at: string
}

interface FreelancerData {
  user_id: string
  earnings: number
  skills: string[]
  jobs_finished: number
  ongoing_jobs: number
  rating: number
  bio?: string
}

interface ClientData {
  user_id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()

  // This extracts the ID from the URL
  // URL: /services/ea86f2e3-2e28-48c9-ba3b-7a1163184dcc
  // Result: serviceId = "ea86f2e3-2e28-48c9-ba3b-7a1163184dcc"
  const serviceId = params.id as string

  console.log("Service ID from URL:", serviceId) // Debug log to see the extracted ID

  const [service, setService] = useState<ServiceData | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null)
  const [freelancerProfile, setFreelancerProfile] = useState<ClientData | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        console.log("🔍 Fetching service with ID:", serviceId)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setCurrentUser(user)
        console.log("👤 Current user:", user?.id)

        // Fetch service data with better error handling
        const { data: serviceData, error: serviceError } = await supabase
          .from("serviceList")
          .select("*")
          .eq("service_id", serviceId)
          .single()

        console.log("📊 Service query result:", { serviceData, serviceError })

        if (serviceError) {
          console.error("❌ Service error details:", serviceError)

          // Check if it's a "not found" error vs other errors
          if (serviceError.code === "PGRST116") {
            setError(`Service with ID ${serviceId} not found in database`)
          } else {
            setError(`Database error: ${serviceError.message}`)
          }
          return
        }

        if (!serviceData) {
          console.error("❌ No service data returned")
          setError("No service data found")
          return
        }

        console.log("✅ Service found:", serviceData.service_name)
        setService(serviceData)

        // Fetch freelancer data
        console.log("🔍 Fetching freelancer data for:", serviceData.freelancer_id)
        const { data: freelancerData, error: freelancerError } = await supabase
          .from("freelancer")
          .select("*")
          .eq("user_id", serviceData.freelancer_id)
          .single()

        console.log("👨‍💼 Freelancer query result:", { freelancerData, freelancerError })

        if (!freelancerError && freelancerData) {
          setFreelancer(freelancerData)
        }

        // Fetch freelancer profile data
        console.log("🔍 Fetching profile data for:", serviceData.freelancer_id)
        const { data: profileData, error: profileError } = await supabase
          .from("client")
          .select("*")
          .eq("user_id", serviceData.freelancer_id)
          .single()

        console.log("👤 Profile query result:", { profileData, profileError })

        if (!profileError && profileData) {
          setFreelancerProfile(profileData)
        }
      } catch (error) {
        console.error("💥 Unexpected error in fetchServiceData:", error)
        setError(`Unexpected error: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchServiceData()
    }
  }, [serviceId])

  const handleContactFreelancer = () => {
    if (freelancerProfile?.email) {
      window.location.href = `mailto:${freelancerProfile.email}?subject=Interested in ${service?.service_name}`
    }
  }

  const isOwner = currentUser?.id === service?.freelancer_id

  const handleDeleteService = async () => {
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase.from("serviceList").delete().eq("service_id", serviceId)

      if (error) {
        console.error("Error deleting service:", error)
        alert("Failed to delete service. Please try again.")
        return
      }

      alert("Service deleted successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading service...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "The service you're looking for doesn't exist."}</p>

          {/* Debug information */}
          <div className="bg-muted p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p className="text-sm">Service ID: {serviceId}</p>
            <p className="text-sm">Error: {error || "No error message"}</p>
            <p className="text-sm">Service Data: {service ? "Found" : "Not found"}</p>
          </div>

          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const memberSince = freelancerProfile ? new Date(freelancerProfile.created_at).getFullYear() : null

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Service Image */}
          {service.service_pictures && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={service.service_pictures || "/placeholder.svg?height=400&width=800"}
                alt={service.service_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=800"
                }}
              />
            </div>
          )}

          {/* Service Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl lg:text-3xl">{service.service_name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Listed {new Date(service.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {isOwner && <Badge variant="secondary">Your Service</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  ${service.price_range[0]} - ${service.price_range[1]}
                </span>
                <span className="text-muted-foreground">USD</span>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {service.category.map((cat, index) => (
                    <Badge key={index} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold">Service Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {service.service_description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Freelancer Profile */}
          {freelancerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Freelancer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {freelancerProfile.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{freelancerProfile.full_name}</h4>
                    <p className="text-sm text-muted-foreground">Freelancer</p>
                  </div>
                </div>

                {freelancer && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        Rating
                      </span>
                      <span>{freelancer.rating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        Jobs Completed
                      </span>
                      <span>{freelancer.jobs_finished}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        Ongoing Jobs
                      </span>
                      <span>{freelancer.ongoing_jobs}</span>
                    </div>
                    {memberSince && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Member since</span>
                        <span>{memberSince}</span>
                      </div>
                    )}
                  </div>
                )}

                {freelancer?.bio && (
                  <div className="space-y-2">
                    <h5 className="font-medium">Bio</h5>
                    <p className="text-sm text-muted-foreground">{freelancer.bio}</p>
                  </div>
                )}

                {freelancer?.skills && freelancer.skills.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium">Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{freelancer.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact Actions */}
          {!isOwner && currentUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get Started</CardTitle>
                <CardDescription>Ready to work with {freelancerProfile?.full_name}?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleContactFreelancer} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Freelancer
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Chat (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/services/${service.service_id}/edit`}>Edit Service</Link>
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDeleteService} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Service"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Login Prompt for Non-authenticated Users */}
          {!currentUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interested?</CardTitle>
                <CardDescription>Sign in to contact this freelancer</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
