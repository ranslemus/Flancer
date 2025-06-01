import { createClient } from "@/app/lib/supabase/server"
import type { Profile } from "@/types/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, DollarSign, FileText, Search, Star } from "lucide-react"

interface FreelancerDashboardProps {
  profile: Profile
}

export async function FreelancerDashboard({ profile }: FreelancerDashboardProps) {
  const supabase = createClient()

  // Fetch freelancer's job applications
  const { data: applications } = await supabase
    .from("job_applications")
    .select(`
      *,
      jobs(*)
    `)
    .eq("freelancer_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch active projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      jobs(*),
      profiles!projects_client_id_fkey(*)
    `)
    .eq("freelancer_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Calculate earnings
  const totalEarnings =
    projects?.reduce((sum, project) => {
      // In a real app, you would have a payment/earnings table
      return sum + (project.jobs?.budget_max || 0)
    }, 0) || 0

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and find new opportunities</p>
          </div>
          <Button asChild>
            <Link href="/jobs">
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Projects in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Pending job applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">No reviews yet</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                  <div key={project.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{project.jobs?.title}</h3>
                        <div className="flex items-center text-sm">
                          <Avatar className="mr-1 h-4 w-4">
                            <AvatarImage src={project.profiles?.avatar_url || ""} alt={project.profiles?.name || ""} />
                            <AvatarFallback>{project.profiles?.name?.charAt(0) || "C"}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{project.profiles?.name}</span>
                        </div>
                      </div>
                      <Badge>{project.status}</Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Started {new Date(project.start_date).toLocaleDateString()}
                      </span>
                      <span className="font-medium">${project.jobs?.budget_max}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-muted p-3">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No active projects</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  When clients hire you, your projects will appear here
                </p>
                <Button asChild size="sm">
                  <Link href="/jobs">Find Jobs</Link>
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

        {/* Recent Applications */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your most recent job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{application.jobs?.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>
                          ${application.jobs?.budget_min} - ${application.jobs?.budget_max}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        application.status === "accepted"
                          ? "success"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {application.status === "pending"
                        ? "Pending"
                        : application.status === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-muted p-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No applications yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Apply to jobs to start building your freelance career
                </p>
                <Button asChild size="sm">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {applications && applications.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs/applications">View All Applications</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Profile Completion */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>A complete profile helps you win more projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Profile Completion</span>
                  <span>{profile.title && profile.bio && profile.location && profile.hourly_rate ? "100" : "50"}%</span>
                </div>
                <Progress
                  value={profile.title && profile.bio && profile.location && profile.hourly_rate ? 100 : 50}
                  className="h-2"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <div
                    className={`mb-3 rounded-full p-3 ${profile.title ? "bg-green-100 text-green-700" : "bg-muted"}`}
                  >
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium">Professional Title</h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {profile.title ? "Added" : "Add your professional title"}
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <div className={`mb-3 rounded-full p-3 ${profile.bio ? "bg-green-100 text-green-700" : "bg-muted"}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium">Bio</h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {profile.bio ? "Added" : "Add your professional bio"}
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <div
                    className={`mb-3 rounded-full p-3 ${profile.location ? "bg-green-100 text-green-700" : "bg-muted"}`}
                  >
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium">Location</h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {profile.location ? "Added" : "Add your location"}
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <div
                    className={`mb-3 rounded-full p-3 ${profile.hourly_rate ? "bg-green-100 text-green-700" : "bg-muted"}`}
                  >
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium">Hourly Rate</h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {profile.hourly_rate ? `$${profile.hourly_rate}/hr` : "Set your hourly rate"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/profile/edit">Complete Your Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
