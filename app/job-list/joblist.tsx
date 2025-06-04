"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, DollarSign, Search, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Star, MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// Mock data for demonstration
const jobs = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description: "Build a modern e-commerce platform with React and Node.js",
    freelancer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4.9,
    },
    status: "in-progress",
    budget: 2500,
    datePosted: "2024-01-15",
    deadline: "2024-02-15",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Design user interface for iOS and Android fitness app",
    freelancer: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4.8,
    },
    status: "under-review",
    budget: 1200,
    datePosted: "2024-01-10",
    deadline: "2024-01-30",
  },
  {
    id: 3,
    title: "Content Writing for Blog",
    description: "Write 10 SEO-optimized blog posts about digital marketing",
    freelancer: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4.7,
    },
    status: "completed",
    budget: 800,
    datePosted: "2024-01-05",
    deadline: "2024-01-25",
  },
  {
    id: 4,
    title: "Logo Design and Branding",
    description: "Create logo and brand identity for tech startup",
    freelancer: null,
    status: "open",
    budget: 600,
    datePosted: "2024-01-20",
    deadline: "2024-02-10",
  },
  {
    id: 5,
    title: "Python Data Analysis Script",
    description: "Develop automated data analysis tool for sales reports",
    freelancer: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4.9,
    },
    status: "in-progress",
    budget: 1500,
    datePosted: "2024-01-12",
    deadline: "2024-02-05",
  },
  {
    id: 6,
    title: "WordPress Website Maintenance",
    description: "Monthly maintenance and updates for business website",
    freelancer: {
      name: "Lisa Thompson",
      avatar: "/placeholder.svg?height=32&width=32",
      rating: 4.6,
    },
    status: "cancelled",
    budget: 300,
    datePosted: "2024-01-08",
    deadline: "2024-01-31",
  },
]

export default function Component() {
  const { theme, setTheme } = useTheme()
  const [selectedJob, setSelectedJob] = useState<(typeof jobs)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewDetails = (job: (typeof jobs)[0]) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "under-review":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open"
      case "in-progress":
        return "In Progress"
      case "under-review":
        return "Under Review"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Jobs</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage all your freelance projects</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search jobs..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-gray-900 dark:text-gray-100">{job.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                      {job.description}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(job.status)}>{getStatusText(job.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Freelancer */}
                  <div className="flex items-center gap-3">
                    {job.freelancer ? (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={job.freelancer.avatar || "/placeholder.svg"} alt={job.freelancer.name} />
                          <AvatarFallback>
                            {job.freelancer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{job.freelancer.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">★ {job.freelancer.rating}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-500 dark:text-gray-400">No freelancer</p>
                          <p className="text-xs text-gray-400">Awaiting proposals</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        ${job.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                    </div>
                  </div>

                  {/* Date Posted */}
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {new Date(job.datePosted).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Posted</p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(job)}>
                    View Details
                  </Button>
                  {job.status === "open" && (
                    <Button variant="outline" size="sm">
                      View Proposals
                    </Button>
                  )}
                  {job.status === "under-review" && <Button size="sm">Review Work</Button>}
                  {job.status === "in-progress" && (
                    <Button variant="outline" size="sm">
                      Message Freelancer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no jobs) */}
        {jobs.length === 0 && (
          <Card className="text-center py-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No jobs posted yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by posting your first job to find talented freelancers
              </p>
              <Button>Post a Job</Button>
            </CardContent>
          </Card>
        )}

        {/* Job Details Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {selectedJob && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl mb-2 text-gray-900 dark:text-gray-100">
                        {selectedJob.title}
                      </DialogTitle>
                      <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                        Posted on {new Date(selectedJob.datePosted).toLocaleDateString()}
                      </DialogDescription>
                    </div>
                    <Badge className={getStatusColor(selectedJob.status)}>{getStatusText(selectedJob.status)}</Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Job Overview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Job Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  <Separator />

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Project Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              ${selectedJob.budget.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {new Date(selectedJob.deadline).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Remote</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Freelancer Information</h4>
                      {selectedJob.freelancer ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={selectedJob.freelancer.avatar || "/placeholder.svg"}
                                alt={selectedJob.freelancer.name}
                              />
                              <AvatarFallback>{selectedJob.freelancer.name.split(" ").map((n) => n[0])}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {selectedJob.freelancer.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {selectedJob.freelancer.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="font-medium text-gray-600 dark:text-gray-400">No freelancer assigned</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            This job is still open for proposals
                          </p>
                          <Button size="sm">View Proposals</Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Requirements</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>3+ years of experience in relevant field</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Portfolio showcasing similar projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Excellent communication skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Ability to meet deadlines</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* Project Timeline */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Project Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Job Posted</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedJob.datePosted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedJob.freelancer && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Freelancer Hired</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedJob.freelancer.name} was assigned to this project
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Deadline</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedJob.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {selectedJob.status === "open" && (
                      <>
                        <Button>View Proposals</Button>
                        <Button variant="outline">Edit Job</Button>
                      </>
                    )}
                    {selectedJob.status === "in-progress" && (
                      <>
                        <Button>Message Freelancer</Button>
                        <Button variant="outline">Request Update</Button>
                      </>
                    )}
                    {selectedJob.status === "under-review" && (
                      <>
                        <Button>Review Work</Button>
                        <Button variant="outline">Request Revision</Button>
                      </>
                    )}
                    {selectedJob.status === "completed" && (
                      <>
                        <Button variant="outline">Download Files</Button>
                        <Button variant="outline">Leave Review</Button>
                      </>
                    )}
                    <Button variant="destructive" className="ml-auto">
                      Cancel Job
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
