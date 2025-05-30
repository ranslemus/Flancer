import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react"
import Link from "next/link"
import { ApplyForm } from "./apply-form"

interface JobDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobDetailsPage(props: JobDetailsPageProps) {
  const params = await props.params;
  const supabase = createClient()

  // Fetch job details
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      profiles(*),
      job_skills(
        skills(*)
      )
    `)
    .eq("id", params.id)
    .single()

  if (!job) {
    notFound()
  }

  // Get current user profile
  const currentUserProfile = await getUserProfile()
  const isFreelancer = currentUserProfile?.user_type === "freelancer"
  const isClient = currentUserProfile?.user_type === "client"
  const isJobOwner = currentUserProfile?.id === job.client_id

  // Check if the freelancer has already applied
  let hasApplied = false

  if (isFreelancer && currentUserProfile) {
    const { data: application } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", job.id)
      .eq("freelancer_id", currentUserProfile.id)
      .maybeSingle()

    hasApplied = !!application
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    {job.deadline && (
                      <>
                        <span className="mx-2">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="md:ml-auto">
                  <DollarSign className="mr-1 h-3 w-3" />${job.budget_min} - ${job.budget_max}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Job Description</h3>
                <div className="text-sm whitespace-pre-line">{job.description}</div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.job_skills && job.job_skills.length > 0 ? (
                    job.job_skills.map((skill) => (
                      <Badge key={skill.skills?.id} variant="secondary">
                        {skill.skills?.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific skills listed</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply form for freelancers */}
          {isFreelancer && !isJobOwner && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Submit a Proposal</CardTitle>
                <CardDescription>Tell the client why you're the best fit for this job</CardDescription>
              </CardHeader>
              <CardContent>
                {hasApplied ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="text-muted-foreground mb-2">You have already applied to this job.</p>
                    <Button variant="outline" asChild>
                      <Link href="/jobs/applications">View Your Applications</Link>
                    </Button>
                  </div>
                ) : (
                  <ApplyForm jobId={job.id} />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar with client info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>About the Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={job.profiles?.avatar_url || ""} alt={job.profiles?.name} />
                  <AvatarFallback>{job.profiles?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{job.profiles?.name}</h3>
                  {job.profiles?.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.profiles.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Member since {new Date(job.profiles?.created_at || "").toLocaleDateString()}</p>
              </div>
            </CardContent>
            <CardFooter>
              {isClient && isJobOwner ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/jobs/edit/${job.id}`}>Edit Job</Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/messages/new?recipient=${job.client_id}`}>Contact Client</Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge>{job.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Budget</span>
                <span>
                  ${job.budget_min} - ${job.budget_max}
                </span>
              </div>
              {job.deadline && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span>{new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span>{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
