"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, User } from "lucide-react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import type { Database } from "@/types/supabase"

interface Job {
  job_id: string
  created_at: string
  status: string
  payment: number
  client_id: string
  freelancer_id: string
  service_id: string
  deadline: string
  description: string
  updated_at: string
  // Joined data
  service?: {
    service_name: string
    category: string
  }
  client?: {
    full_name: string
  }
  freelancer?: {
    user_id: string
    skills: string
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"client" | "freelancer" | null>(null)
  const user = useUser()
  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    if (user) {
      fetchUserRoleAndJobs()
    }
  }, [user])

  const fetchUserRoleAndJobs = async () => {
    if (!user?.id) return

    setLoading(true)

    try {
      // First, determine user role
      const { data: clientData } = await supabase.from("client").select("user_id").eq("user_id", user.id).single()

      const { data: freelancerData } = await supabase
        .from("freelancer")
        .select("user_id")
        .eq("user_id", user.id)
        .single()

      let role: "client" | "freelancer" | null = null
      if (clientData) role = "client"
      else if (freelancerData) role = "freelancer"

      setUserRole(role)

      if (!role) {
        setLoading(false)
        return
      }

      // Fetch jobs based on user role
      let query = supabase.from("job").select(`
          *,
          service:serviceList(service_name, category),
          client:client(full_name),
          freelancer:freelancer(user_id, skills)
        `)

      if (role === "client") {
        query = query.eq("client_id", user.id)
      } else {
        query = query.eq("freelancer_id", user.id)
      }

      const { data: jobsData, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
        toast.error("Failed to load jobs")
      } else {
        setJobs(jobsData || [])
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while loading jobs")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your jobs</h1>
          <Button onClick={() => (window.location.href = "/auth/login")}>Log In</Button>
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
        <p className="text-muted-foreground mt-2">
          {userRole === "freelancer"
            ? "Manage your active and completed projects"
            : "Track your hired services and projects"}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6">
            {userRole === "freelancer"
              ? "You haven't received any job offers yet. Keep building your profile!"
              : "You haven't hired any services yet. Browse our talented freelancers!"}
          </p>
          <Button onClick={() => (window.location.href = userRole === "freelancer" ? "/services" : "/freelancers")}>
            {userRole === "freelancer" ? "Browse Services" : "Find Freelancers"}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.job_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{job.service?.service_name || "Service"}</CardTitle>
                    <CardDescription className="mt-1">{job.service?.category}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(job.status)}>{job.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>
                    {userRole === "freelancer"
                      ? `Client: ${job.client?.full_name || "Unknown"}`
                      : `Freelancer: ${job.freelancer?.user_id || "Unknown"}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  <span>${job.payment.toFixed(2)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => (window.location.href = `/jobs/${job.job_id}`)}
                >
                  View Details
                </Button>
                {job.status === "in_progress" && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => (window.location.href = `/jobs/${job.job_id}/upload`)}
                  >
                    Open J*b
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
