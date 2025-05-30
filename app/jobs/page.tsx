import { requireFreelancerRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, DollarSign } from "lucide-react"

export default async function JobsPage() {
  // Ensure only freelancers can access this page
  await requireFreelancerRole()

  const supabase = createClient()

  // Fetch open jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      *,
      profiles(name, avatar_url),
      job_skills(
        skills(*)
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
        <p className="mt-2 text-muted-foreground">Browse available jobs and submit proposals</p>
      </div>

      <div className="grid gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>Posted by {job.profiles?.name}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="ml-auto">
                      <DollarSign className="mr-1 h-3 w-3" />${job.budget_min} - ${job.budget_max}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.job_skills?.map((skill) => (
                    <Badge key={skill.skills?.id} variant="secondary">
                      {skill.skills?.name}
                    </Badge>
                  ))}
                </div>

                {job.deadline && (
                  <div className="flex items-center mt-4 text-sm">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full md:w-auto">
                  <Link href={`/jobs/${job.id}`}>View Details & Apply</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">No jobs found</h3>
            <p className="mb-6 text-muted-foreground">
              There are no open jobs available at the moment. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
