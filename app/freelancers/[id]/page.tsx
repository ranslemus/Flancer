import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, MessageSquare } from "lucide-react"
import Link from "next/link"

interface FreelancerProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FreelancerProfilePage(props: FreelancerProfilePageProps) {
  const params = await props.params;
  const supabase = createClient()

  // Fetch freelancer profile
  const { data: freelancer } = await supabase
    .from("profiles")
    .select(`
      *,
      freelancer_skills(
        *,
        skills(*)
      )
    `)
    .eq("id", params.id)
    .eq("user_type", "freelancer")
    .single()

  if (!freelancer) {
    notFound()
  }

  // Get current user profile to determine if they're a client
  const currentUserProfile = await getUserProfile()
  const isClient = currentUserProfile?.user_type === "client"

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar with freelancer info */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={freelancer.avatar_url || ""} alt={freelancer.name} />
                  <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{freelancer.name}</h1>
                <p className="text-muted-foreground mb-2">{freelancer.title || "Freelancer"}</p>

                {freelancer.location && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                    <MapPin className="mr-1 h-4 w-4" />
                    {freelancer.location}
                  </div>
                )}

                {isClient && (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <Button asChild>
                      <Link href={`/jobs/invite/${freelancer.id}`}>Invite to Job</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/messages/new?recipient=${freelancer.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {freelancer.hourly_rate && (
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-sm font-medium">Hourly Rate</span>
                    <span className="font-bold">${freelancer.hourly_rate}/hr</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-medium">Member Since</span>
                  <span>{new Date(freelancer.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {freelancer.freelancer_skills && freelancer.freelancer_skills.length > 0 ? (
                  freelancer.freelancer_skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.skills?.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{freelancer.bio || "This freelancer hasn't added a bio yet."}</p>
            </CardContent>
          </Card>

          {/* Projects section would go here */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Projects completed by this freelancer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No portfolio items yet</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews section would go here */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>Feedback from previous clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
