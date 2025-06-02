"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, Upload, Loader2, AlertTriangle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { StringToBoolean } from "class-variance-authority/types"

interface Job {
  job_id: string
  created_at: string
  status: "in_progress" | "submitted" | "done" | "cancelled"
  payment: number
  client_id: string
  freelancer_id: string
  service_id: string
  deadline: string
  description: StringToBoolean
  service?: {
    service_name: string
    service_pictures?: string
  }
  client_profile?: {
    full_name: string
  }
  freelancer_profile?: {
    full_name: string
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<"client" | "freelancer" | null>(null)
  const [activeTab, setActiveTab] = useState("active")

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = "/login"
          return
        }
        setUser(user)

        // Get user role
        const { data: clientData } = await supabase.from("client").select("role").eq("user_id", user.id).single()

        const role = clientData?.role === "freelancer" ? "freelancer" : "client"
        setUserRole(role)

        // Fetch jobs based on role
        await fetchJobs(user.id, role)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndJobs()
  }, [])

  const fetchJobs = async (userId: string, role: "client" | "freelancer") => {
    try {
      const column = role === "freelancer" ? "freelancer_id" : "client_id"

      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select(`
          *,
          service:serviceList(service_name, service_pictures),
          client_profile:client!jobs_client_id_fkey(full_name),
          freelancer_profile:client!jobs_freelancer_id_fkey(full_name)
        `)
        .eq(column, userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
        return
      }

      setJobs(jobsData || [])
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500"
      case "submitted":
        return "bg-yellow-500"
      case "done":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <Upload className="h-4 w-4" />
      case "done":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffInMs = deadlineDate.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays < 0) return "Overdue"
    if (diffInDays === 0) return "Due today"
    if (diffInDays === 1) return "Due tomorrow"
    return `${diffInDays} days remaining`
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const filteredJobs = jobs.filter((job) => {
    switch (activeTab) {
      case "active":
        return job.status === "in_progress" || job.status === "submitted"
      case "completed":
        return job.status === "done"
      case "cancelled":
        return job.status === "cancelled"
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading jobs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {userRole === "freelancer" ? "My Jobs" : "Hired Services"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {userRole === "freelancer"
            ? "Manage your ongoing projects and deliverables"
            : "Track your hired services and project progress"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Jobs
            <Badge variant="secondary" className="ml-2">
              {jobs.filter((j) => j.status === "in_progress" || j.status === "submitted").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {jobs.filter((j) => j.status === "done").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            <Badge variant="secondary" className="ml-2">
              {jobs.filter((j) => j.status === "cancelled").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.job_id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        <Link href={`/jobs/${job.job_id}`} className="hover:text-primary">
                          {job.service?.service_name || "Unknown Service"}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {userRole === "freelancer"
                                ? job.client_profile?.full_name?.charAt(0) || "C"
                                : job.freelancer_profile?.full_name?.charAt(0) || "F"}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {userRole === "freelancer"
                              ? `Client: ${job.client_profile?.full_name || "Unknown"}`
                              : `Freelancer: ${job.freelancer_profile?.full_name || "Unknown"}`}
                          </span>
                        </div>
                        <span>•</span>
                        <span>Started {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`${getStatusColor(job.status)} text-white`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status.replace("_", " ")}</span>
                      </Badge>
                      {isOverdue(job.deadline) && job.status !== "done" && job.status !== "cancelled" && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.description && <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                      <span className="font-medium">${job.payment}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                      <span className={isOverdue(job.deadline) ? "text-red-600 font-medium" : ""}>
                        {formatTimeRemaining(job.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-600" />
                      <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {job.status === "in_progress" && "33%"}
                        {job.status === "submitted" && "66%"}
                        {job.status === "done" && "100%"}
                        {job.status === "cancelled" && "0%"}
                      </span>
                    </div>
                    <Progress
                      value={
                        job.status === "in_progress"
                          ? 33
                          : job.status === "submitted"
                            ? 66
                            : job.status === "done"
                              ? 100
                              : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild>
                      <Link href={`/jobs/${job.job_id}`}>View Details</Link>
                    </Button>
                    {userRole === "freelancer" && job.status === "in_progress" && (
                      <Button variant="outline" asChild>
                        <Link href={`/jobs/${job.job_id}/upload`}>Upload Work</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 rounded-full bg-muted p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No {activeTab} jobs</h3>
              <p className="text-muted-foreground mb-6">
                {userRole === "freelancer"
                  ? "You don't have any jobs in this category yet."
                  : "You haven't hired any services in this category yet."}
              </p>
              {activeTab === "active" && userRole === "client" && (
                <Button asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
