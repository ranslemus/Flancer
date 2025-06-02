"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, ExternalLink, Github, Globe, Linkedin, Mail, Star, Twitter } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Types
interface ClientData {
  user_id: string
  full_name: string
  role: "client" | "freelancer"
  email: string
  phone?: string
  created_at: string
}

interface FreelancerData {
  user_id: string
  earnings: number
  skills: string[]
  services_id?: string
  jobs_finished: number
  ongoing_jobs: number
  rating: number
  bio?: string
}

interface ServiceData {
  service_id: string
  service_name: string
  price_range: number[]
  service_description: string
  service_pictures?: string
  category: string[]
}

interface ReviewData {
  id: string
  client: string
  project: string
  rating: number
  comment: string
  date: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(null)
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("services")

  const supabase = createClientComponentClient()

  // Mock reviews data - replace with actual data from your database
  const mockReviews: ReviewData[] = [
    {
      id: "1",
      client: "Jane Smith",
      project: "E-commerce Website Redesign",
      rating: 5,
      comment: "Excellent work on our website redesign. Very professional and delivered on time.",
      date: "May 15, 2023",
    },
    {
      id: "2",
      client: "Michael Brown",
      project: "Mobile App UI Development",
      rating: 4.5,
      comment: "Great work on our mobile app UI. Responsive and professional throughout the project.",
      date: "April 28, 2023",
    },
  ]

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchUserData(user.id)
      } else {
        window.location.href = "/login"
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch client data
      const { data: client, error: clientError } = await supabase
        .from("client")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (clientError) {
        console.error("Error fetching client data:", clientError)
        return
      }

      setClientData(client)

      // Check if user is a freelancer
      if (client.role !== "freelancer") {
        // Redirect non-freelancers to dashboard
        window.location.href = "/dashboard"
        return
      }

      // Fetch freelancer data
      const { data: freelancer, error: freelancerError } = await supabase
        .from("freelancer")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (freelancerError) {
        console.error("Error fetching freelancer data:", freelancerError)
        return
      }

      setFreelancerData(freelancer)

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from("serviceList")
        .select("*")
        .eq("freelancer_id", userId)

      if (!servicesError) {
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!clientData || !freelancerData) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <p>Error loading profile data. Please try again.</p>
        </div>
      </div>
    )
  }

  const memberSince = new Date(clientData.created_at).getFullYear()

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {clientData.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4">{clientData.full_name}</CardTitle>
              <CardDescription>Freelancer</CardDescription>
              <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-4 w-4" />
                {clientData.email}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>
                    {freelancerData.rating}/5.0 ({freelancerData.jobs_finished} reviews)
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Member since {memberSince}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" disabled>
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Website</span>
                </Button>
              </div>
              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link href={`mailto:${clientData.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Me
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {freelancerData.bio || "No bio available. Add one to tell clients about yourself!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {freelancerData.skills && freelancerData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {freelancerData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills listed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{clientData.full_name}</h1>
            <Button variant="outline" asChild>
              <Link href="/edit-profile">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="services" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              {services.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <Card key={service.service_id} className="overflow-hidden">
                      {service.service_pictures && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={service.service_pictures || "/placeholder.svg?height=200&width=300"}
                            alt={service.service_name}
                            className="h-full w-full object-cover transition-all hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                            }}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl">{service.service_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{service.service_description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {service.category.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-between text-sm">
                          <div className="flex items-center">
                            <span className="font-medium">${service.price_range[0]} - ${service.price_range[1]}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/services/${service.service_id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Service
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No services created yet.</p>
                  <Button asChild>
                    <Link href="/add-service">Create Your First Service</Link>
                  </Button>
                </div>
              )}
              {services.length > 0 && (
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="add-service">Add New Service</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {mockReviews.length > 0 ? (
                mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{review.client}</CardTitle>
                          <CardDescription>{review.project}</CardDescription>
                        </div>
                        <div className="flex items-center">
                          <div className="flex text-yellow-500">
                            {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-500" />
                            ))}
                            {review.rating % 1 !== 0 && <Star className="h-4 w-4 fill-yellow-500" />}
                          </div>
                          <span className="ml-2 text-sm">{review.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews yet. Complete some projects to get reviews!</p>
                </div>
              )}
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Experience section coming soon!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This section will allow you to showcase your work history and achievements.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Certifications section coming soon!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add your professional certifications and achievements here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
