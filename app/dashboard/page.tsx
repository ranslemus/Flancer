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
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "@/components/ui/chart"
import { ArrowUpRight, Briefcase, CheckCircle, Clock, DollarSign, MessageSquare, Star, Users } from "lucide-react"

// Mock data for the dashboard
const projectStats = {
  completed: 12,
  inProgress: 3,
  totalEarnings: 4850,
  clientSatisfaction: 4.8,
}

const recentProjects = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    client: "Fashion Boutique",
    status: "Completed",
    earnings: 950,
    date: "Apr 15, 2023",
    rating: 5,
  },
  {
    id: 2,
    title: "Mobile App UI Development",
    client: "Health Tracker",
    status: "In Progress",
    earnings: 650,
    date: "May 2, 2023",
    progress: 75,
  },
  {
    id: 3,
    title: "Landing Page Creation",
    client: "Tech Startup",
    status: "Completed",
    earnings: 450,
    date: "Apr 28, 2023",
    rating: 4.5,
  },
]

const monthlyEarnings = [
  { name: "Jan", earnings: 350 },
  { name: "Feb", earnings: 450 },
  { name: "Mar", earnings: 320 },
  { name: "Apr", earnings: 580 },
  { name: "May", earnings: 650 },
  { name: "Jun", earnings: 800 },
]

const skillDistribution = [
  { name: "React", value: 40 },
  { name: "Next.js", value: 30 },
  { name: "Tailwind", value: 20 },
  { name: "Node.js", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const projectTypes = [
  { name: "Web Dev", count: 8 },
  { name: "Mobile", count: 4 },
  { name: "UI/UX", count: 3 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your freelancing activity.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/profile">View Profile</Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">Find Jobs</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${projectStats.totalEarnings}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.completed}</div>
                <p className="text-xs text-muted-foreground">+3 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">+1 new project this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.clientSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">Based on {projectStats.completed} reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Recent Projects</h2>
            <div className="grid gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>Client: {project.client}</CardDescription>
                      </div>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.status === "In Progress" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex text-primary">
                          {Array.from({ length: Math.floor(project.rating) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary" />
                          ))}
                          {project.rating % 1 !== 0 && <Star className="h-4 w-4 fill-primary" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{project.rating} rating</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.date}
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {project.earnings}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Your earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.completed + projectStats.inProgress}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/projects">View All</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.completed}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/projects?status=completed">View Completed</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.inProgress}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/projects?status=in-progress">View Active</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Types</CardTitle>
              <CardDescription>Distribution of your projects by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Recent Projects</h2>
            <div className="grid gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>Client: {project.client}</CardDescription>
                      </div>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.status === "In Progress" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex text-primary">
                          {Array.from({ length: Math.floor(project.rating) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary" />
                          ))}
                          {project.rating % 1 !== 0 && <Star className="h-4 w-4 fill-primary" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{project.rating} rating</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {project.date}
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {project.earnings}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Project Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Math.round(projectStats.totalEarnings / projectStats.completed)}
                </div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proposal Success Rate</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+18 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">-0.5h from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your earnings growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="earnings" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>Projects by skill category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {skillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Opportunities</CardTitle>
              <CardDescription>Skills in demand that match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>React Native</span>
                    <span>High Demand</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>TypeScript</span>
                    <span>Medium Demand</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GraphQL</span>
                    <span>Medium Demand</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AWS</span>
                    <span>High Demand</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/skills">Improve Your Skills</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/messages">View Messages</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/messages">View Chats</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/messages/stats">View Stats</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Recent Messages</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">John Doe</CardTitle>
                      <CardDescription>E-commerce Website Redesign</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hi there! I just reviewed your latest design mockups and they look fantastic. Could we schedule a
                    call to discuss a few minor adjustments?
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                  <Button size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Alice Smith</CardTitle>
                      <CardDescription>Mobile App UI Development</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Just wanted to check in on the progress of the app screens. Do you have an updated timeline for when
                    you'll have the next batch ready?
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">Yesterday</div>
                  <Button size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Robert Johnson</CardTitle>
                      <CardDescription>Landing Page Creation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The landing page looks great! I've shared it with my team and they're very impressed. We'd like to
                    discuss another project with you.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">2 days ago</div>
                  <Button size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/messages">View All Messages</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
