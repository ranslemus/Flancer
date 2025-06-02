import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, BarChart3, Briefcase, Users, Star, CheckCircle } from "lucide-react"



export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="inline-flex bg-primary text-primary-foreground">Showcase Your Skills</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Where Emerging Tech Talent Gets Discovered
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Flancer helps new developers showcase their skills and get discovered by clients. Create your profile,
                  offer your services, and build your portfolio.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-1">
                  <Link href="/signup">
                    Offer Your Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No Experience Required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Build Your Portfolio</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Get Paid</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/homepage1.jpg?height=500&width=500"
                width={500}
                height={500}
                alt="Hero Image"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline">Simple Process</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How Flancer Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes it easy for new developers to showcase their skills and for clients to discover fresh
                talent.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sign up and create your profile showcasing your skills, education, and portfolio. No experience? No
                  problem!
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Offer Your Services</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create service listings that showcase your skills and expertise. Set your own rates and availability.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Grow Your Career</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete projects, get reviews, track your progress with analytics, and build a professional
                  portfolio.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline">Tech Categories</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Showcase Your Skills</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Offer services in popular tech categories and get discovered by clients looking for your skills.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-3 lg:grid-cols-4">
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">Web Development</CardTitle>
              <CardDescription>1,234 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
              <CardTitle className="text-lg">Mobile Apps</CardTitle>
              <CardDescription>876 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <path d="M12 2H2v10h10V2Z" />
                <path d="M22 12h-10v10h10V12Z" />
                <path d="M12 12H2v10h10V12Z" />
                <path d="M22 2h-10v10h10V2Z" />
              </svg>
              <CardTitle className="text-lg">UI/UX Design</CardTitle>
              <CardDescription>543 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
                <line x1="8" x2="8" y1="16" y2="16" />
                <line x1="8" x2="8" y1="20" y2="20" />
                <line x1="12" x2="12" y1="18" y2="18" />
                <line x1="12" x2="12" y1="22" y2="22" />
                <line x1="16" x2="16" y1="16" y2="16" />
                <line x1="16" x2="16" y1="20" y2="20" />
              </svg>
              <CardTitle className="text-lg">Cloud Services</CardTitle>
              <CardDescription>321 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <CardTitle className="text-lg">QA & Testing</CardTitle>
              <CardDescription>432 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
              </svg>
              <CardTitle className="text-lg">DevOps</CardTitle>
              <CardDescription>234 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              <CardTitle className="text-lg">Data Science</CardTitle>
              <CardDescription>187 freelancers</CardDescription>
            </Card>
            <Card className="flex flex-col items-center text-center p-4 hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-2 text-primary"
              >
                <path d="M3 7v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                <rect width="20" height="5" x="2" y="2" rx="2" />
                <path d="M12 12v6" />
                <path d="M10 18h4" />
              </svg>
              <CardTitle className="text-lg">Game Development</CardTitle>
              <CardDescription>156 freelancers</CardDescription>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                Browse All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline">Success Stories</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">From Beginners to Professionals</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from freelancers who started with no experience and built successful careers on Flancer.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt="@user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Jane Doe</CardTitle>
                    <CardDescription>Web Developer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "I started on Flancer with zero professional experience. Within 6 months, I had built a portfolio of
                  10 projects and landed a full-time job at a tech startup."
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt="@user" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Michael Smith</CardTitle>
                    <CardDescription>Mobile App Developer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "The analytics dashboard helped me understand which skills to focus on. I went from small $50 projects
                  to $5,000 contracts in just one year on Flancer."
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt="@user" />
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Sarah Parker</CardTitle>
                    <CardDescription>UI/UX Designer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "As a self-taught designer, I struggled to find clients who would take a chance on me. Flancer
                  connected me with clients who valued my fresh perspective."
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                  <Star className="h-4 w-4 fill-primary" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Your Journey?</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of emerging developers who are building their careers on Flancer.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/register">Sign Up as Freelancer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/browse">Browse Freelancers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
