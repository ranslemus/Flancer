"use client"

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
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Star,
  Loader2,
  AlertTriangle,
  MessageCircle,
  FileText,
  ImageIcon,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Job {
  job_id: string
  service_id: string
  client_id: string
  freelancer_id: string
  status: "in_progress" | "submitted" | "done" | "cancelled"
  payment: number
  deadline: string
  description: string
  created_at: string
  service?: {
    service_name: string
    service_pictures?: string
  }
  client_profile?: {
    full_name: string
    email: string
  }
  freelancer_profile?: {
    full_name: string
    email: string
  }
}

interface JobDeliverable {
  id: string
  job_id: string
  file_name: string
  file_url: string
  file_type: string
  description: string
  uploaded_at: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [deliverables, setDeliverables] = useState<JobDeliverable[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<"client" | "freelancer" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [extendDeadlineOpen, setExtendDeadlineOpen] = useState(false)
  const [newDeadline, setNewDeadline] = useState("")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")

  // Action states
  const [submitting, setSubmitting] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        console.log("Fetching job data for ID:", jobId)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("User auth error:", userError)
          setError("Authentication error")
          return
        }

        if (!user) {
          console.log("No user found, redirecting to login")
          router.push("/auth/login")
          return
        }

        console.log("Current user:", user.id)
        setCurrentUser(user)

        // Get user role by checking both client and freelancer tables
        console.log("Checking user role...")

        const { data: clientData, error: clientError } = await supabase
          .from("client")
          .select("role, full_name")
          .eq("user_id", user.id)
          .single()

        console.log("Client data:", clientData, "Client error:", clientError)

        let role: "client" | "freelancer" = "client"

        if (clientData?.role === "freelancer") {
          role = "freelancer"
        } else if (!clientData) {
          // Check freelancer table if not found in client
          const { data: freelancerData, error: freelancerError } = await supabase
            .from("freelancer")
            .select("user_id")
            .eq("user_id", user.id)
            .single()

          console.log("Freelancer data:", freelancerData, "Freelancer error:", freelancerError)

          if (freelancerData) {
            role = "freelancer"
          }
        }

        console.log("User role determined:", role)
        setUserRole(role)

        // Fetch job data with better error handling
        console.log("Fetching job with ID:", jobId)

        const { data: jobData, error: jobError } = await supabase
          .from("job")
          .select(`
            job_id,
            service_id,
            client_id,
            freelancer_id,
            status,
            payment,
            deadline,
            description,
            created_at,
            updated_at
          `)
          .eq("job_id", jobId)
          .single()

        console.log("Job query result:", { jobData, jobError })

        if (jobError) {
          console.error("Job fetch error:", jobError)
          if (jobError.code === "PGRST116") {
            setError("Job not found")
          } else {
            setError(`Failed to fetch job: ${jobError.message || "Unknown error"}`)
          }
          return
        }

        if (!jobData) {
          console.error("No job data returned")
          setError("Job not found")
          return
        }

        // Check if user has access to this job
        if (jobData.client_id !== user.id && jobData.freelancer_id !== user.id) {
          console.error(
            "Access denied. User ID:",
            user.id,
            "Client ID:",
            jobData.client_id,
            "Freelancer ID:",
            jobData.freelancer_id,
          )
          setError("You don't have access to this job")
          return
        }

        console.log("Job data fetched successfully:", jobData)

        // Fetch service information
        let serviceData = null
        if (jobData.service_id) {
          const { data: service, error: serviceError } = await supabase
            .from("serviceList")
            .select("service_name, service_pictures")
            .eq("service_id", jobData.service_id)
            .single()

          if (service && !serviceError) {
            serviceData = service
          } else {
            console.warn("Could not fetch service data:", serviceError)
          }
        }

        // Fetch client profile
        let clientProfile = null
        if (jobData.client_id) {
          const { data: client, error: clientProfileError } = await supabase
            .from("client")
            .select("full_name, email")
            .eq("user_id", jobData.client_id)
            .single()

          if (client && !clientProfileError) {
            clientProfile = client
          } else {
            console.warn("Could not fetch client profile:", clientProfileError)
          }
        }

        // Fetch freelancer profile
        let freelancerProfile = null
        if (jobData.freelancer_id) {
          const { data: freelancer, error: freelancerProfileError } = await supabase
            .from("client")
            .select("full_name, email")
            .eq("user_id", jobData.freelancer_id)
            .single()

          if (freelancer && !freelancerProfileError) {
            freelancerProfile = freelancer
          } else {
            console.warn("Could not fetch freelancer profile:", freelancerProfileError)
          }
        }

        // Combine all data
        const completeJobData = {
          ...jobData,
          service: serviceData,
          client_profile: clientProfile,
          freelancer_profile: freelancerProfile,
        }

        console.log("Complete job data:", completeJobData)
        setJob(completeJobData)

        // Fetch deliverables
        const { data: deliverablesData, error: deliverablesError } = await supabase
          .from("job_deliverables")
          .select("*")
          .eq("job_id", jobId)
          .order("uploaded_at", { ascending: false })

        if (deliverablesError) {
          console.warn("Could not fetch deliverables:", deliverablesError)
        } else {
          setDeliverables(deliverablesData || [])
        }
      } catch (error) {
        console.error("Unexpected error fetching job:", error)
        setError("An unexpected error occurred while loading the job")
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJobData()
    } else {
      setError("No job ID provided")
      setLoading(false)
    }
  }, [jobId, router, supabase])

  const handleApproveJob = async () => {
    if (!job) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("job").update({ status: "done" }).eq("job_id", jobId)

      if (error) {
        console.error("Error approving job:", error)
        alert("Failed to approve job. Please try again.")
        return
      }

      // Send notification to freelancer
      await supabase.from("notifications").insert({
        user_id: job.freelancer_id,
        type: "job_completed",
        title: `Job completed: "${job.service?.service_name || "Unknown Service"}"`,
        message: "Your work has been approved and the job is now complete!",
        metadata: {
          job_id: jobId,
          service_name: job.service?.service_name,
          payment: job.payment,
        },
        is_read: false,
      })

      setJob((prev) => (prev ? { ...prev, status: "done" } : null))
      alert("Job approved successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleExtendDeadline = async () => {
    if (!job || !newDeadline) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("job").update({ deadline: newDeadline }).eq("job_id", jobId)

      if (error) {
        console.error("Error extending deadline:", error)
        alert("Failed to extend deadline. Please try again.")
        return
      }

      // Send notification to freelancer
      await supabase.from("notifications").insert({
        user_id: job.freelancer_id,
        type: "deadline_extended",
        title: `Deadline extended: "${job.service?.service_name || "Unknown Service"}"`,
        message: `The deadline has been extended to ${new Date(newDeadline).toLocaleDateString()}`,
        metadata: {
          job_id: jobId,
          service_name: job.service?.service_name,
          new_deadline: newDeadline,
        },
        is_read: false,
      })

      setJob((prev) => (prev ? { ...prev, deadline: newDeadline } : null))
      setExtendDeadlineOpen(false)
      setNewDeadline("")
      alert("Deadline extended successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelJob = async () => {
    if (!job) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("job").update({ status: "cancelled" }).eq("job_id", jobId)

      if (error) {
        console.error("Error cancelling job:", error)
        alert("Failed to cancel job. Please try again.")
        return
      }

      // Send notification to freelancer
      await supabase.from("notifications").insert({
        user_id: job.freelancer_id,
        type: "job_cancelled",
        title: `Job cancelled: "${job.service?.service_name || "Unknown Service"}"`,
        message: "The job has been cancelled by the client.",
        metadata: {
          job_id: jobId,
          service_name: job.service?.service_name,
        },
        is_read: false,
      })

      setJob((prev) => (prev ? { ...prev, status: "cancelled" } : null))
      alert("Job cancelled successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!job || rating === 0) {
      alert("Please provide a rating")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("reviews").insert({
        job_id: jobId,
        service_id: job.service_id,
        client_id: job.client_id,
        freelancer_id: job.freelancer_id,
        rating,
        comment: reviewComment.trim() || null,
      })

      if (error) {
        console.error("Error submitting review:", error)
        alert("Failed to submit review. Please try again.")
        return
      }

      // Send notification to freelancer
      await supabase.from("notifications").insert({
        user_id: job.freelancer_id,
        type: "new_review",
        title: `New ${rating}-star review received`,
        message: reviewComment.trim() || "You received a new review!",
        metadata: {
          job_id: jobId,
          service_id: job.service_id,
          rating,
          service_name: job.service?.service_name,
        },
        is_read: false,
      })

      setReviewDialogOpen(false)
      setRating(0)
      setReviewComment("")
      alert("Review submitted successfully!")
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
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

  const isClient = userRole === "client"
  const isFreelancer = userRole === "freelancer"

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The job you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl lg:text-3xl">
                    {job.service?.service_name || "Unknown Service"}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>
                          {isClient
                            ? job.freelancer_profile?.full_name?.charAt(0) || "F"
                            : job.client_profile?.full_name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {isClient
                          ? `Freelancer: ${job.freelancer_profile?.full_name || "Unknown"}`
                          : `Client: ${job.client_profile?.full_name || "Unknown"}`}
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
            <CardContent className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-semibold text-green-600">${job.payment}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className={`font-semibold ${isOverdue(job.deadline) ? "text-red-600" : ""}`}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <p className={`font-semibold ${isOverdue(job.deadline) ? "text-red-600" : ""}`}>
                      {formatTimeRemaining(job.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
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
                  className="h-3"
                />
              </div>

              <Separator />

              {/* Job Description */}
              {job.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
                <CardDescription>Files and work submitted by the freelancer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded">
                        {deliverable.file_type === "image" ? (
                          <ImageIcon className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{deliverable.file_name}</p>
                        <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(deliverable.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={deliverable.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Freelancer Actions */}
              {isFreelancer && job.status === "in_progress" && (
                <Button className="w-full" asChild>
                  <Link href={`/jobs/${jobId}/upload`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Work
                  </Link>
                </Button>
              )}

              {/* Client Actions */}
              {isClient && job.status === "submitted" && (
                <>
                  <Button className="w-full" onClick={handleApproveJob} disabled={submitting}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {submitting ? "Approving..." : "Approve Work"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Request Changes
                  </Button>
                </>
              )}

              {isClient && job.status === "done" && (
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Star className="mr-2 h-4 w-4" />
                      Leave Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience working with {job.freelancer_profile?.full_name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`p-1 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                            >
                              <Star className="h-6 w-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="review-comment">Comment (Optional)</Label>
                        <Textarea
                          id="review-comment"
                          placeholder="Share your experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitReview} disabled={submitting || rating === 0}>
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Deadline Management */}
              {isClient && (job.status === "in_progress" || job.status === "submitted") && (
                <>
                  <Dialog open={extendDeadlineOpen} onOpenChange={setExtendDeadlineOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Extend Deadline
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Extend Deadline</DialogTitle>
                        <DialogDescription>Set a new deadline for this job</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-deadline">New Deadline</Label>
                          <Input
                            id="new-deadline"
                            type="datetime-local"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setExtendDeadlineOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleExtendDeadline} disabled={submitting || !newDeadline}>
                          {submitting ? "Extending..." : "Extend Deadline"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this job? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelJob} disabled={submitting}>
                          {submitting ? "Cancelling..." : "Cancel Job"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>{isClient ? "Freelancer" : "Client"} Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {isClient
                      ? job.freelancer_profile?.full_name?.charAt(0) || "F"
                      : job.client_profile?.full_name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {isClient
                      ? job.freelancer_profile?.full_name || "Unknown"
                      : job.client_profile?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isClient ? job.freelancer_profile?.email || "No email" : job.client_profile?.email || "No email"}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
