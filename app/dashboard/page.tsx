"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, Calendar, CheckCircle, DollarSign, PlusCircle, Star } from "lucide-react"
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
  id: string
  service_name: string
  price_range: string
  service_description: string
  service_pictures?: string
}

interface JobData {
  id: string
  title: string
  description: string
  budget: number
  deadline: string
  status: "not_done" | "in_progress" | "submitted" | "paid"
  client_name: string
  freelancer_id?: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(null)
  const [serviceData, setServiceData] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [clientJobs, setClientJobs] = useState<JobData[]>([])
  const [freelancerJobs, setFreelancerJobs] = useState<JobData[]>([])

  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchClientData(user.id)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const fetchClientData = async (userId: string) => {
    try {
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

      if (client.role === "freelancer") {
        await fetchFreelancerData(userId)
      }

      await fetchJobs(userId, client.role)
    } catch (error) {
      console.error("Error in fetchClientData:", error)
    }
  }

  const fetchFreelancerData = async (userId: string) => {
    try {
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

      if (freelancer.services_id) {
        const { data: service, error: serviceError } = await supabase
          .from("serviceList")
          .select("*")
          .eq("service_id", freelancer.services_id)
          .single()

        if (!serviceError) {
          setServiceData(service)
        }
      }
    } catch (error) {
      console.error("Error in fetchFreelancerData:", error)
    }
  }

  const fetchJobs = async (userId: string, role: "client" | "freelancer") => {
    try {
      if (role === "client") {
        const { data: job, error } = await supabase
          .from("job")
          .select("*")
          .eq("client_id", userId)
          .order("created_at", { ascending: false })

        if (!error) {
          setClientJobs(job || [])
        }
      } else {
        const { data: job, error } = await supabase
          .from("job")
          .select("*")
          .eq("freelancer_id", userId)
          .order("created_at", { ascending: false })

        if (!error) {
          setFreelancerJobs(job || [])
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    }
  }

  const handleBecomeFreelancer = async () => {
    if (!user || !clientData) return

    try {
      console.log("Starting freelancer setup for user:", user.id)

      const { data: existingFreelancer, error: checkError } = await supabase
        .from("freelancer")
        .select("user_id")
        .eq("user_id", user.id)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing freelancer:", checkError)
        alert(`Error checking freelancer record: ${checkError.message}`)
        return
      }

      if (!existingFreelancer) {
        console.log("Creating new freelancer record...")
        const { error: freelancerError } = await supabase.from("freelancer").insert({
          user_id: user.id,
          earnings: 0.0,
          skills: [],
          jobs_finished: 0,
          ongoing_jobs: 0,
          rating: 0,
        })

        if (freelancerError) {
          console.error("Detailed freelancer error:", {
            message: freelancerError.message,
            details: freelancerError.details,
            hint: freelancerError.hint,
            code: freelancerError.code,
          })
          alert(
            `Error creating freelancer record: ${freelancerError.message}\nDetails: ${freelancerError.details || "None"}\nHint: ${freelancerError.hint || "None"}`,
          )
          return
        }

        console.log("Freelancer record created successfully")
      }

      // Direct to the freelancer-setup page (now at root level)
      window.location.href = "/freelancer-setup"
    } catch (error) {
      console.error("Unexpected error in handleBecomeFreelancer:", error)
      alert(`Unexpected error: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <p>Error loading user data. Please try again.</p>
        </div>
      </div>
    )
  }

  const isFreelancer = clientData.role === "freelancer"
  const activeJobs = isFreelancer ? freelancerJobs : clientJobs
  const completedJobs = activeJobs.filter((job) => job.status === "paid").length
  const inProgressJobs = activeJobs.filter((job) => job.status === "in_progress").length

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-background">
              <AvatarFallback>{clientData.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hi, {clientData.full_name}</h1>
              <p className="text-muted-foreground capitalize">{clientData.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/edit-profile">Edit Profile</Link>
            </Button>
            {!isFreelancer && (
              <Button size="sm" variant="secondary" onClick={handleBecomeFreelancer}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Become Freelancer
              </Button>
            )}
            {isFreelancer && (
              <Button size="sm" asChild>
                <Link href="/add-service">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post New Service
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Role-based Tabs */}
      <Tabs defaultValue={isFreelancer ? "freelancer" : "client"} className="space-y-4">
        <TabsList className={`grid ${isFreelancer ? "grid-cols-2" : "grid-cols-1"} md:w-auto`}>
          <TabsTrigger value="client">Client Dashboard</TabsTrigger>
          {isFreelancer && <TabsTrigger value="freelancer">Freelancer Dashboard</TabsTrigger>}
        </TabsList>

        {/* Client Dashboard */}
        <TabsContent value="client" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressJobs}</div>
                <p className="text-xs text-muted-foreground">Jobs currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Jobs Purchased</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedJobs}</div>
                <p className="text-xs text-muted-foreground">Total completed jobs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${activeJobs.reduce((sum, job) => sum + job.budget, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>Quick overview of your current projects</CardDescription>
            </CardHeader>
            <CardContent>
              {activeJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active jobs yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/services">Browse Available Services</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Budget: ${job.budget} • Due: {new Date(job.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            job.status === "paid"
                              ? "default"
                              : job.status === "submitted"
                                ? "secondary"
                                : job.status === "in_progress"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {job.status.replace("_", " ")}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Freelancer Dashboard */}
        {isFreelancer && (
          <TabsContent value="freelancer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback>{clientData.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{clientData.full_name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(freelancerData?.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">{freelancerData?.rating || 0}/5.0</span>
                        </div>
                        {freelancerData?.bio && (
                          <p className="text-sm text-muted-foreground mt-2">{freelancerData.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {freelancerData?.skills && freelancerData.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {freelancerData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {serviceData && (
                      <div>
                        <h4 className="font-medium mb-2">Services:</h4>
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-green-700">{serviceData.service_name}</h5>
                          <p className="text-sm text-muted-foreground">{serviceData.service_description}</p>
                          <p className="text-sm font-medium mt-1">Price Range: ${serviceData.price_range}</p>
                          {serviceData.service_pictures && (
                            <div className="mt-2">
                              <img
                                src={serviceData.service_pictures || "/placeholder.svg"}
                                alt={serviceData.service_name}
                                className="w-full h-32 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Freelancer Stats */}
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${freelancerData?.earnings || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Ongoing Jobs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{freelancerData?.ongoing_jobs || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{freelancerData?.jobs_finished || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deadline Reminders */}
            <Card>
              <CardHeader>
                <CardTitle>Deadline Reminders</CardTitle>
                <CardDescription>Upcoming deadlines for your active projects</CardDescription>
              </CardHeader>
              <CardContent>
                {freelancerJobs.filter((job) => job.status === "in_progress").length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {freelancerJobs
                      .filter((job) => job.status === "in_progress")
                      .slice(0, 3)
                      .map((job) => {
                        const daysLeft = Math.ceil(
                          (new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                        )
                        return (
                          <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Due: {new Date(job.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={daysLeft <= 2 ? "destructive" : daysLeft <= 7 ? "outline" : "secondary"}>
                              {daysLeft} days left
                            </Badge>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Jobs Tab */}
            <Card>
              <CardHeader>
                <CardTitle>My Jobs</CardTitle>
                <CardDescription>All jobs you're currently working on</CardDescription>
              </CardHeader>
              <CardContent>
                {freelancerJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {freelancerJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Client: {job.client_name} • Budget: ${job.budget}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(job.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              job.status === "paid"
                                ? "default"
                                : job.status === "submitted"
                                  ? "secondary"
                                  : job.status === "in_progress"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {job.status.replace("_", " ")}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
