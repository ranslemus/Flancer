import { requireClientRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { DollarSign, MapPin } from "lucide-react"

export default async function FindFreelancersPage() {
  // Ensure only clients can access this page
  await requireClientRole()

  const supabase = createClient()

  // Fetch freelancers
  const { data: freelancers } = await supabase
    .from("profiles")
    .select(`
      *,
      freelancer_skills(
        *,
        skills(*)
      )
    `)
    .eq("user_type", "freelancer")
    .order("created_at", { ascending: false })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Freelancers</h1>
        <p className="mt-2 text-muted-foreground">Discover talented freelancers for your projects</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {freelancers && freelancers.length > 0 ? (
          freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={freelancer.avatar_url || ""} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      <Link href={`/freelancers/${freelancer.id}`} className="hover:text-primary">
                        {freelancer.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm font-medium">{freelancer.title || "Freelancer"}</p>
                    {freelancer.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {freelancer.location}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {freelancer.freelancer_skills?.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.skills?.name}
                    </Badge>
                  ))}
                  {(freelancer.freelancer_skills?.length || 0) > 3 && (
                    <Badge variant="outline">+{(freelancer.freelancer_skills?.length || 0) - 3} more</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {freelancer.bio || "No bio provided."}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {freelancer.hourly_rate && (
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>${freelancer.hourly_rate}/hr</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">No freelancers found</h3>
            <p className="mb-6 text-muted-foreground">There are no freelancers available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
