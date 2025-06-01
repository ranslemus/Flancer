"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Filter,
  MessageSquare,
  MoreHorizontal,
  PlusCircle,
  Search,
  Send,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "@supabase/auth-helpers-react"

// Mock data for the dashboard
const mockActiveJobs = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    client: "Global Retail Inc.",
    clientAvatar: "/placeholder.svg",
    deadline: "May 20, 2025",
    progress: 65,
    payment: "$800",
    status: "In Progress",
    messages: 3,
  },
  {
    id: 2,
    title: "React Dashboard Development",
    client: "Tech Solutions Ltd.",
    clientAvatar: "/placeholder.svg",
    deadline: "May 15, 2025",
    progress: 40,
    payment: "$1200",
    status: "In Progress",
    messages: 0,
  },
  {
    id: 3,
    title: "Landing Page Optimization",
    client: "Startup Ventures",
    clientAvatar: "/placeholder.svg",
    deadline: "May 25, 2025",
    progress: 20,
    payment: "$400",
    status: "In Progress",
    messages: 2,
  },
]

const mockDeadlines = [
  {
    id: 1,
    title: "Submit Homepage Wireframes",
    project: "E-commerce Website Redesign",
    dueDate: "May 12, 2025",
    daysLeft: 2,
    priority: "High",
  },
  {
    id: 2,
    title: "Complete User Authentication",
    project: "React Dashboard Development",
    dueDate: "May 14, 2025",
    daysLeft: 4,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Finalize Color Scheme",
    project: "Landing Page Optimization",
    dueDate: "May 13, 2025",
    daysLeft: 3,
    priority: "Low",
  },
]

const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer for SaaS Platform",
    company: "SaaS Innovations",
    appliedDate: "May 5, 2025",
    status: "Under Review",
    budget: "$30-40/hr",
    proposal: "I have extensive experience with React and Next.js...",
  },
  {
    id: 2,
    jobTitle: "UI Component Library Development",
    company: "Design Systems Co.",
    appliedDate: "May 3, 2025",
    status: "Shortlisted",
    budget: "$2000-3000",
    proposal: "I've built several component libraries using...",
  },
  {
    id: 3,
    jobTitle: "E-commerce Site Maintenance",
    company: "Fashion Outlet Online",
    appliedDate: "May 1, 2025",
    status: "Viewed",
    budget: "$25-35/hr",
    proposal: "I can help maintain and improve your e-commerce...",
  },
  {
    id: 4,
    jobTitle: "JavaScript Performance Optimization",
    company: "Web Performance Inc.",
    appliedDate: "April 28, 2025",
    status: "Under Review",
    budget: "$45-55/hr",
    proposal: "I specialize in optimizing JavaScript applications...",
  },
  {
    id: 5,
    jobTitle: "Responsive Email Template Design",
    company: "Marketing Solutions",
    appliedDate: "April 25, 2025",
    status: "Rejected",
    budget: "$500-800",
    proposal: "I can create responsive email templates that work...",
  },
]

export default function DashboardClient() {
  const session = useSession() // 👈 use context here
  const [activeTab, setActiveTab] = useState("overview")

  if (!session) return <div>Loading...</div>

  const user = session.user


  // Mock user stats
  const mockUserStats = {
    earnings: 1250,
    completedJobs: 8,
    activeJobs: mockActiveJobs.length,
    pendingApplications: mockApplications.filter((a) => a.status !== "Rejected").length,
    rating: 4.8,
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-background">
              {/* <AvatarImage src="/placeholder.svg" alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hi, {user.name}</h1>
              <p className="text-muted-foreground">{user.userType === "freelancer" ? "Freelancer" : "Client"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              {user.userType === "freelancer" ? "Find New Jobs" : "Post New Job"}
            </Button>
            {/* <UserNav user={{ id: user.id, name: user.name, email: user.email }} /> */}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockUserStats.earnings}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">{mockUserStats.completedJobs} completed jobs total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">{mockApplications.length} total applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.rating}/5.0</div>
            <p className="text-xs text-muted-foreground">Based on {mockUserStats.completedJobs} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Active Jobs Section */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Jobs</CardTitle>
                  <CardDescription>Your active projects and their status</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#" onClick={() => setActiveTab("jobs")}>
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={job.clientAvatar || "/placeholder.svg"} alt={job.client} />
                        <AvatarFallback>{job.client.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{job.title}</p>
                          <Badge variant={job.status === "Completed" ? "success" : "default"}>{job.status}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{job.client}</span>
                          <span className="mx-2">•</span>
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Due {job.deadline}</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tasks due in the next week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDeadlines.slice(0, 3).map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          deadline.priority === "High"
                            ? "bg-destructive"
                            : deadline.priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">{deadline.project}</p>
                        <div className="flex items-center text-xs">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Due {deadline.dueDate}</span>
                          <span className="mx-1">•</span>
                          <span
                            className={
                              deadline.daysLeft <= 2 ? "text-destructive font-medium" : "text-muted-foreground"
                            }
                          >
                            {deadline.daysLeft} days left
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="#" onClick={() => setActiveTab("deadlines")}>
                    View All Deadlines
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Applications */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Status of your job applications</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#" onClick={() => setActiveTab("applications")}>
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{application.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">{application.company}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Applied {application.appliedDate}</span>
                          <span className="mx-1">•</span>
                          <span>{application.budget}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          application.status === "Shortlisted"
                            ? "success"
                            : application.status === "Rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your earnings for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Earnings chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search jobs..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: Recent
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Recent</DropdownMenuItem>
                  <DropdownMenuItem>Deadline (Soonest)</DropdownMenuItem>
                  <DropdownMenuItem>Payment (Highest)</DropdownMenuItem>
                  <DropdownMenuItem>Progress</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4">
            {mockActiveJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={job.clientAvatar || "/placeholder.svg"} alt={job.client} />
                              <AvatarFallback>{job.client.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {job.client}
                          </div>
                        </div>
                        <Badge variant={job.status === "Completed" ? "success" : "default"}>{job.status}</Badge>
                      </div>
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-between md:w-48 md:border-l md:pl-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {job.deadline}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Payment</p>
                        <p className="font-medium flex items-center">
                          <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                          {job.payment}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Messages
                          {job.messages > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              {job.messages}
                            </Badge>
                          )}
                        </Button>
                        <Button size="sm" className="w-full">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search deadlines..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: Due Date
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Due Date</DropdownMenuItem>
                  <DropdownMenuItem>Priority</DropdownMenuItem>
                  <DropdownMenuItem>Project</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4">
            {mockDeadlines.map((deadline) => (
              <Card key={deadline.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        deadline.priority === "High"
                          ? "bg-destructive"
                          : deadline.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{deadline.title}</h3>
                          <p className="text-sm text-muted-foreground">Project: {deadline.project}</p>
                        </div>
                        <Badge
                          variant={
                            deadline.priority === "High"
                              ? "destructive"
                              : deadline.priority === "Medium"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {deadline.priority} Priority
                        </Badge>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Due {deadline.dueDate}</span>
                        <span className="mx-2">•</span>
                        <span
                          className={deadline.daysLeft <= 2 ? "text-destructive font-medium" : "text-muted-foreground"}
                        >
                          {deadline.daysLeft} days left
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search applications..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: Recent
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Recent</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                  <DropdownMenuItem>Budget (Highest)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4">
            {mockApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                        </div>
                        <Badge
                          variant={
                            application.status === "Shortlisted"
                              ? "success"
                              : application.status === "Rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Applied {application.appliedDate}</span>
                          <span className="mx-2">•</span>
                          <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{application.budget}</span>
                        </div>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p className="font-medium mb-1">Your Proposal:</p>
                          <p className="text-muted-foreground line-clamp-2">{application.proposal}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col md:justify-center md:w-40">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        View Job
                      </Button>
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Proposal</DropdownMenuItem>
                          <DropdownMenuItem>Withdraw Application</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
