import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Clock, DollarSign, PlusCircle, Search, Users } from "lucide-react"

interface ClientDashboardProps {
  profile: Profile
}

export async function ClientDashboard({ profile }: ClientDashboardProps) {
  const supabase = createClient()

  // Fetch client's posted jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      *,
      job_applications(count)
    `)
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch active projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      jobs(*),
      profiles!projects_freelancer_id_fkey(*)
    `)
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and find talented freelancers</p>
          </div>
          <Button asChild>
            <Link href="/jobs/post">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posted Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active job postings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Projects in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs?.reduce((sum, job) => sum + (job.job_applications?.[0]?.count || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Freelancers applied to your jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Total spent on projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Jobs */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your most recently posted jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{job.job_applications?.[0]?.count || 0} applications</span>
                        <span className="mx-2">•</span>
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                      {job.status === "open" ? "Active" : job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-muted p-3">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No jobs posted yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Post your first job to find talented freelancers</p>
                <Button asChild size="sm">
                  <Link href="/jobs/post">Post a Job</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {jobs && jobs.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs/my-jobs">View All Jobs</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Active Projects */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Projects currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.profiles?.avatar_url || ""} alt={project.profiles?.name || ""} />
                      <AvatarFallback>{project.profiles?.name?.charAt(0) || "F"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{project.jobs?.title}</h3>
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground">Freelancer: {project.profiles?.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{project.progress || 0}% complete</span>
                      </div>
                    </div>
                    <Badge>{project.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-muted p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No active projects</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  When you hire freelancers, your projects will appear here
                </p>
                <Button asChild size="sm">
                  <Link href="/find-freelancers">Find Freelancers</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {projects && projects.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Find Freelancers */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Find Talented Freelancers</CardTitle>
            <CardDescription>Discover freelancers with the skills you need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Browse Freelancers</h3>
                <p className="mb-4 text-sm text-muted-foreground">Search through our talented freelancer profiles</p>
                <Button asChild size="sm">
                  <Link href="/find-freelancers">Browse Now</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Post a Job</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create a job posting and let freelancers come to you
                </p>
                <Button asChild size="sm">
                  <Link href="/jobs/post">Post Job</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Invite Freelancers</h3>
                <p className="mb-4 text-sm text-muted-foreground">Directly invite freelancers to your projects</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/find-freelancers">Find Talent</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
