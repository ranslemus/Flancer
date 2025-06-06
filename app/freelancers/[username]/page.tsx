"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, ExternalLink, Github, Globe, Linkedin, Mail, MapPin, Star, Twitter } from "lucide-react"

// Mock user data - in a real app, this would come from your database based on the username
const userData = {
  name: "Alex Johnson",
  username: "alexj",
  title: "Frontend Developer",
  location: "San Francisco, CA",
  email: "alex@example.com",
  bio: "Self-taught developer with a passion for creating clean, user-friendly interfaces. Specializing in React and Next.js development.",
  profile_picture_url: "/placeholder.svg?height=96&width=96", // Updated to use profile_picture_url
  skills: [
    { name: "React", level: 85 },
    { name: "Next.js", level: 75 },
    { name: "JavaScript", level: 90 },
    { name: "Tailwind CSS", level: 80 },
    { name: "Node.js", level: 60 },
    { name: "TypeScript", level: 70 },
  ],
  education: [
    {
      institution: "Online Learning",
      degree: "Frontend Web Development",
      date: "2021 - 2022",
      description: "Self-taught through online courses and tutorials",
    },
    {
      institution: "City College",
      degree: "Associate's in Computer Science",
      date: "2019 - 2021",
      description: "Focused on programming fundamentals and web technologies",
    },
  ],
  services: [
    {
      id: 1,
      title: "Responsive Website Development",
      description: "I'll build a fully responsive website using React, Next.js, and Tailwind CSS.",
      image: "/placeholder.svg",
      price: "$500-$1000",
      deliveryTime: "2-4 weeks",
      skills: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Frontend Bug Fixing",
      description: "I'll fix frontend bugs and improve the performance of your React application.",
      image: "/placeholder.svg",
      price: "$100-$300",
      deliveryTime: "1-3 days",
      skills: ["React", "JavaScript", "Debugging"],
    },
    {
      id: 3,
      title: "UI Component Development",
      description: "I'll create reusable UI components for your design system or application.",
      image: "/placeholder.svg",
      price: "$200-$500",
      deliveryTime: "1-2 weeks",
      skills: ["React", "TypeScript", "Styled Components"],
    },
  ],
  reviews: [
    {
      id: 1,
      client: "Jane Smith",
      project: "E-commerce Website Redesign",
      rating: 5,
      comment:
        "Alex did an amazing job redesigning our e-commerce website. The new design is clean, modern, and has significantly improved our conversion rates.",
      date: "May 15, 2023",
    },
    {
      id: 2,
      client: "Michael Brown",
      project: "Mobile App UI Development",
      rating: 4.5,
      comment:
        "Great work on our mobile app UI. Alex was responsive, professional, and delivered high-quality designs on time.",
      date: "April 28, 2023",
    },
    {
      id: 3,
      client: "Sarah Johnson",
      project: "Landing Page Creation",
      rating: 5,
      comment:
        "Alex created a beautiful landing page for our product launch. The page looks fantastic and has helped us generate many leads.",
      date: "April 10, 2023",
    },
  ],
  social: {
    github: "github.com/alexj",
    linkedin: "linkedin.com/in/alexj",
    twitter: "twitter.com/alexj",
    website: "alexjohnson.dev",
  },
  memberSince: "2022",
  completedProjects: 15,
  rating: 4.8,
  totalReviews: 12,
}

export default function FreelancerProfilePage({ params }) {
  const [activeTab, setActiveTab] = useState("services")
  const { username } = params

  // In a real app, you would fetch the user data based on the username
  // const { data: userData, isLoading, error } = useSWR(`/api/freelancers/${username}`, fetcher)

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>User not found</div>

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.profile_picture_url || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4">{userData.name}</CardTitle>
              <CardDescription>{userData.title}</CardDescription>
              <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {userData.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>
                    {userData.rating} ({userData.totalReviews} reviews)
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Member since {userData.memberSince}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`https://${userData.social.github}`} target="_blank">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`https://${userData.social.linkedin}`} target="_blank">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`https://${userData.social.twitter}`} target="_blank">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`https://${userData.social.website}`} target="_blank">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Website</span>
                  </Link>
                </Button>
              </div>
              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link href={`mailto:${userData.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Me
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{userData.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-sm">{edu.degree}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {edu.date}
                  </div>
                  <p className="text-xs text-muted-foreground">{edu.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{userData.name}</h1>
            <Button variant="outline" asChild>
              <Link href={`/messages/new?recipient=${userData.username}`}>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="services" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userData.services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        width={300}
                        height={200}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between text-sm">
                        <div className="flex items-center">
                          <span className="font-medium">{service.price}</span>
                        </div>
                        <div className="flex items-center">
                          <span>{service.deliveryTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/services/${service.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {userData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{review.client}</CardTitle>
                        <CardDescription>{review.project}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <div className="flex text-yellow-500">
                          {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500" />
                          ))}
                          {review.rating % 1 !== 0 && <Star className="h-4 w-4 fill-yellow-500" />}
                        </div>
                        <span className="ml-2 text-sm">{review.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Freelance Web Developer</h3>
                      <Badge>Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Working with clients to build responsive websites and web applications using modern technologies
                      like React, Next.js, and Tailwind CSS.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      2022 - Present
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Junior Web Developer - TechStart Inc.</h3>
                    <p className="text-sm text-muted-foreground">
                      Assisted in developing and maintaining client websites. Collaborated with the design team to
                      implement responsive layouts.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      2021 - 2022
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">React Developer Certification</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive course covering React fundamentals, hooks, state management, and advanced patterns.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      2022
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Responsive Web Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Course focused on creating responsive layouts using CSS Grid, Flexbox, and media queries.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      2021
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>English</span>
                    <Badge variant="outline">Native</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Spanish</span>
                    <Badge variant="outline">Intermediate</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
