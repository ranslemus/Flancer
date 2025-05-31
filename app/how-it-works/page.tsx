import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Users,
  MessageSquare,
  Sparkles,
  Lightbulb,
  UserCheck,
  Rocket,
  FileText,
  Laptop,
  PenTool,
  Code,
  BarChart,
  Palette,
  Headphones,
  Search,
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <Badge className="mb-2">How It Works</Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Freelancing Made Simple for Beginners
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Flancer is designed specifically for emerging tech talent with little to no professional experience. We
              remove the barriers that make it hard to get started in freelancing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/auth/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline">Who We Serve</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Built For New Freelancers</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Flancer is designed specifically for those just starting their freelancing journey in the digital space.
            </p>
          </div>

          <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-background border-2 border-primary/20">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Rocket className="h-6 w-6" />
                </div>
                <CardTitle>New Freelancers</CardTitle>
                <CardDescription>
                  Just starting out with digital skills but no professional experience? Flancer is built for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">No portfolio or previous work experience required</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Simple application process with no complex verification</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">AI tools to help you create professional proposals</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Laptop className="h-6 w-6" />
                </div>
                <CardTitle>Digital Creators</CardTitle>
                <CardDescription>
                  Focused on digital skills like web development, design, writing, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Web development and programming</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Design and creative work</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Content creation and digital marketing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Clients Seeking Fresh Talent</CardTitle>
                <CardDescription>
                  Businesses and individuals looking for affordable, enthusiastic new talent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Access to motivated freelancers at competitive rates</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Simple project management tools</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Secure payment protection</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Tabs */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline">Simple Process</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How Flancer Works</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              We've simplified the freelancing process to help you get started quickly and build your career.
            </p>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="freelancers" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="freelancers">For Freelancers</TabsTrigger>
                  <TabsTrigger value="clients">For Clients</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="freelancers" className="space-y-12">
                {/* Step 1 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 1
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Create Your Profile</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Sign up in minutes with just your basic information. No complex verification process or ID
                        required to get started.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Simple sign-up with email</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Add your skills and interests</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">No portfolio required to get started</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Create profile illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Browse jobs illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 2
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Browse Beginner-Friendly Jobs</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Explore jobs specifically tagged for beginners. Our platform highlights opportunities that
                        welcome new freelancers.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Filter jobs by experience level</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Find projects that match your skill level</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Receive job recommendations based on your skills</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 3
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Apply With AI Assistance</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Our AI tools help you create professional proposals and applications, even if you've never
                        written one before.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">AI-powered proposal templates</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Suggestions to improve your application</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Simple application process with guided steps</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="AI assistance illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Complete projects illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 4
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Complete Projects & Build Your Portfolio</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        As you complete projects, they automatically become part of your growing portfolio. Get reviews
                        and build your reputation.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Automatic portfolio building</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Client reviews and ratings</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Track your progress and growth</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 5
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Get Mentorship & Grow</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Connect with experienced mentors who can guide your freelancing journey and help you improve
                        your skills.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Access to experienced mentors</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Skill development resources</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Career growth path recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Mentorship illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="space-y-12">
                {/* Step 1 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 1
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Create Your Client Account</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Sign up as a client looking for fresh talent. Set up your company profile to attract motivated
                        freelancers.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Quick registration process</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Create your company profile</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Define your project needs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Client registration illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Post job illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 2
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Post Your Project</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Create a detailed project listing with clear requirements. Specify if you're open to working
                        with beginners.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Easy-to-use project posting form</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Set your budget and timeline</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Specify required skills and experience level</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 3
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Review Applications</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Browse through applications from motivated freelancers. Our AI helps match you with the best
                        candidates for your project.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">AI-powered candidate matching</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Review freelancer profiles and skills</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Chat with potential candidates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Review applications illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Manage project illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 4
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Collaborate & Manage</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Use our simple project management tools to track progress, communicate, and manage deliverables.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Built-in messaging and file sharing</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Milestone tracking and payments</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Feedback and revision management</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-4">
                      Step 5
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Complete & Review</h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Once the project is complete, release payment and leave a review to help the freelancer build
                        their reputation.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Secure payment release</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Provide detailed feedback and ratings</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm">Build long-term relationships with talented freelancers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Complete project illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline">Platform Features</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Makes Flancer Different</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Our platform is specifically designed to help new freelancers succeed in the digital marketplace.
            </p>
          </div>

          <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <CardTitle>No Experience Required</CardTitle>
                <CardDescription>
                  Apply for jobs without needing a portfolio or previous work experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We've removed the traditional barriers to entry in freelancing. Our platform welcomes newcomers and
                  helps you build experience from scratch.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>AI-Assisted Tools</CardTitle>
                <CardDescription>Get help with proposals, project management, and skill development.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI tools help you create professional proposals, manage your projects effectively, and identify
                  skills you need to develop.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle>Mentorship Program</CardTitle>
                <CardDescription>
                  Connect with experienced professionals who can guide your freelancing journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get advice, feedback, and guidance from experienced freelancers who can help you navigate challenges
                  and grow your skills.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Automatic Portfolio Building</CardTitle>
                <CardDescription>
                  Your completed projects automatically become part of your growing portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As you complete projects, they're added to your portfolio with client reviews, helping you showcase
                  your growing experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>Simple Communication</CardTitle>
                <CardDescription>
                  User-friendly messaging and project management tools for smooth collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our platform makes it easy to communicate with clients, share files, and track project progress
                  without complicated tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <BarChart className="h-6 w-6" />
                </div>
                <CardTitle>Growth Analytics</CardTitle>
                <CardDescription>Track your progress, earnings, and skill development over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our dashboard shows you how you're growing as a freelancer, with insights on your earnings, client
                  satisfaction, and skill improvements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Digital Skills Categories */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline">Digital Skills</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Find Work In These Categories</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Flancer focuses on digital work across various categories, perfect for new freelancers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12 md:grid-cols-3 lg:grid-cols-4">
            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
              <Code className="h-10 w-10 mb-4 text-primary" />
              <CardTitle className="text-lg mb-2">Web Development</CardTitle>
              <CardDescription>HTML, CSS, JavaScript, React, and more</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
              <Palette className="h-10 w-10 mb-4 text-primary" />
              <CardTitle className="text-lg mb-2">UI/UX Design</CardTitle>
              <CardDescription>Web design, app interfaces, and user experience</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
              <PenTool className="h-10 w-10 mb-4 text-primary" />
              <CardTitle className="text-lg mb-2">Content Creation</CardTitle>
              <CardDescription>Writing, editing, and content strategy</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
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
                className="h-10 w-10 mb-4 text-primary"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
              <CardTitle className="text-lg mb-2">Mobile Development</CardTitle>
              <CardDescription>iOS, Android, and cross-platform apps</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
              <Search className="h-10 w-10 mb-4 text-primary" />
              <CardTitle className="text-lg mb-2">Digital Marketing</CardTitle>
              <CardDescription>SEO, social media, and email campaigns</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
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
                className="h-10 w-10 mb-4 text-primary"
              >
                <path d="M12 2H2v10h10V2Z" />
                <path d="M22 12h-10v10h10V12Z" />
                <path d="M12 12H2v10h10V12Z" />
                <path d="M22 2h-10v10h10V2Z" />
              </svg>
              <CardTitle className="text-lg mb-2">Graphic Design</CardTitle>
              <CardDescription>Logos, illustrations, and visual assets</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
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
                className="h-10 w-10 mb-4 text-primary"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <CardTitle className="text-lg mb-2">Data Analysis</CardTitle>
              <CardDescription>Data visualization, reporting, and insights</CardDescription>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 hover:bg-accent transition-colors">
              <Headphones className="h-10 w-10 mb-4 text-primary" />
              <CardTitle className="text-lg mb-2">Customer Support</CardTitle>
              <CardDescription>Remote customer service and technical support</CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline">Questions & Answers</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Find answers to common questions about using Flancer as a new freelancer or client.
            </p>
          </div>

          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Do I need previous work experience to join?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No! Flancer is specifically designed for freelancers who are just starting out. You can join with no
                  previous professional experience or portfolio. Our platform helps you build experience through
                  beginner-friendly projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How does the mentorship program work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our mentorship program connects you with experienced freelancers who can provide guidance, review your
                  work, and help you improve your skills. You can schedule one-on-one sessions, get feedback on your
                  projects, and receive career advice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What kind of AI tools are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Flancer offers several AI-powered tools to help new freelancers succeed. These include proposal
                  generators that help you create professional client proposals, skill analyzers that identify areas for
                  improvement, and job matching algorithms that connect you with suitable projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do payments work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We use a secure milestone-based payment system. Clients fund milestones upfront, and the money is held
                  in escrow until you complete the work. Once the client approves the work, the payment is released to
                  you. This ensures you always get paid for completed work.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>As a client, why should I hire beginners?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hiring emerging talent offers several benefits: competitive rates, fresh perspectives, enthusiasm for
                  your projects, and the opportunity to build long-term relationships with growing professionals. Many
                  clients find that new freelancers are highly motivated to deliver quality work to build their
                  reputation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What types of projects can I find on Flancer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Flancer focuses on digital work across various categories including web development, design, content
                  creation, mobile development, digital marketing, and more. Projects range from small tasks perfect for
                  beginners to larger projects for those ready to take on more responsibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Your Freelancing Journey?
            </h2>
            <p className="max-w-[800px] md:text-xl">
              Join Flancer today and take the first step toward building your freelancing career, no experience
              required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/register">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/jobs">Browse Available Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
