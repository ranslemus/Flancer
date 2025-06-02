"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const serviceId = params.id as string

  const [service, setService] = useState<ServiceData | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null)
  const [freelancerProfile, setFreelancerProfile] = useState<ClientData | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

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

        // Fetch service data
        const { data: serviceData, error: serviceError } = await supabase
          .from("serviceList")
          .select("*")
          .eq("service_id", serviceId)
          .single()

        if (serviceError) {
          console.error("❌ Service error details:", serviceError)
          if (serviceError.code === "PGRST116") {
            setError(`Service with ID ${serviceId} not found in database`)
          } else {
            setError(`Database error: ${serviceError.message}`)
          }
          return
        }

        if (!serviceData) {
          setError("No service data found")
          return
        }

        setService(serviceData)

        // Fetch freelancer data
        const { data: freelancerData, error: freelancerError } = await supabase
          .from("freelancer")
          .select("*")
          .eq("user_id", serviceData.freelancer_id)
          .single()

        if (!freelancerError && freelancerData) {
          setFreelancer(freelancerData)
        }

        // Fetch freelancer profile data
        const { data: profileData, error: profileError } = await supabase
          .from("client")
          .select("*")
          .eq("user_id", serviceData.freelancer_id)
          .single()

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

  const handleContactFreelancer = async () => {
    if (!currentUser) {
      alert("Please sign in to contact the freelancer")
      return
    }

    if (!contactMessage.trim()) {
      alert("Please enter a message")
      return
    }

    if (contactMessage.length > 500) {
      alert("Message is too long. Please keep it under 500 characters.")
      return
    }

    setSendingMessage(true)

    try {
      // Get sender's profile
      const { data: senderProfile, error: profileError } = await supabase
        .from("client")
        .select("full_name")
        .eq("user_id", currentUser.id)
        .single()

      if (profileError) {
        console.warn("Could not fetch sender profile:", profileError)
      }

      // Create notification for job inquiry with service price range
      const notificationData = {
        user_id: service?.freelancer_id,
        type: "job_inquiry",
        title: `New job inquiry for "${service?.service_name}"`,
        message: contactMessage.trim(),
        metadata: {
          service_id: serviceId,
          service_name: service?.service_name,
          service_price_range: service?.price_range, // Include price range for negotiation
          client_id: currentUser.id,
          client_name: senderProfile?.full_name || "Unknown User",
          inquiry_message: contactMessage.trim(),
        },
        is_read: false,
      }

      // Send notification directly without additional validation since we're already checking above
      const { data: notificationResult, error: notificationError } = await supabase
        .from("notifications")
        .insert(notificationData)
        .select()

      if (notificationError) {
        console.error("❌ Notification error details:", notificationError)
        throw new Error(`Failed to send notification: ${notificationError.message}`)
      }

      alert("Job inquiry sent successfully! The freelancer will respond with job details and pricing.")
      setContactDialogOpen(false)
      setContactMessage("")
    } catch (error) {
      console.error("💥 Error sending inquiry:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      alert(`Failed to send inquiry: ${errorMessage}`)
    } finally {
      setSendingMessage(false)
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
                <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Job Inquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact {freelancerProfile?.full_name}</DialogTitle>
                      <DialogDescription>
                        Send a job inquiry about "{service.service_name}". The freelancer will receive your message and
                        can respond with job details including timeline and final pricing.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Hi! I'm interested in your service. Could you tell me more about..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                        />
                        <p className="text-sm text-muted-foreground">{contactMessage.length}/500 characters</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setContactDialogOpen(false)} disabled={sendingMessage}>
                        Cancel
                      </Button>
                      <Button onClick={handleContactFreelancer} disabled={sendingMessage || !contactMessage.trim()}>
                        {sendingMessage ? "Sending..." : "Send Message"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full" disabled>
                  <Mail className="mr-2 h-4 w-4" />
                  Email (Coming Soon)
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
