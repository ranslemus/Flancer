"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter, Bookmark, Clock, DollarSign } from "lucide-react"

// Mock data for jobs
const jobsData = [
  {
    id: 1,
    title: "Frontend Developer for E-commerce Website",
    company: "TechShop Inc.",
    location: "Remote",
    type: "Project",
    budget: "$500-$1000",
    duration: "2-4 weeks",
    skills: ["React", "Next.js", "Tailwind CSS"],
    description: "Looking for a frontend developer to build a responsive e-commerce website with modern UI/UX design.",
    postedDate: "2 days ago",
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Mobile App UI Design",
    company: "HealthApp",
    location: "Remote",
    type: "Project",
    budget: "$300-$600",
    duration: "1-2 weeks",
    skills: ["Figma", "UI/UX", "Mobile Design"],
    description: "Need a clean, modern UI design for a health tracking mobile application.",
    postedDate: "5 days ago",
    difficulty: "Intermediate",
    category: "UI/UX Design",
  },
  {
    id: 3,
    title: "WordPress Blog Setup and Customization",
    company: "FoodBlog",
    location: "Remote",
    type: "Project",
    budget: "$200-$400",
    duration: "1 week",
    skills: ["WordPress", "PHP", "CSS"],
    description: "Setting up a WordPress blog with custom theme and essential plugins for a food blogger.",
    postedDate: "1 week ago",
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: 4,
    title: "Simple Android App Development",
    company: "StartupX",
    location: "Remote",
    type: "Project",
    budget: "$800-$1500",
    duration: "3-5 weeks",
    skills: ["Java", "Android Studio", "Firebase"],
    description: "Develop a simple Android app for task management with user authentication and cloud storage.",
    postedDate: "3 days ago",
    difficulty: "Intermediate",
    category: "Mobile Apps",
  },
  {
    id: 5,
    title: "Landing Page Design and Development",
    company: "MarketingPro",
    location: "Remote",
    type: "Project",
    budget: "$300-$500",
    duration: "1-2 weeks",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "Create a high-converting landing page for a marketing campaign with responsive design.",
    postedDate: "4 days ago",
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: 6,
    title: "Database Design for Inventory System",
    company: "RetailSolutions",
    location: "Remote",
    type: "Project",
    budget: "$400-$700",
    duration: "2 weeks",
    skills: ["SQL", "Database Design", "ERD"],
    description: "Design a database schema for a retail inventory management system with documentation.",
    postedDate: "1 week ago",
    difficulty: "Intermediate",
    category: "Database",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: [],
    priceRange: [0, 2000],
    duration: [],
  })

  // Filter jobs based on search term and filters
  const filteredJobs = jobsData.filter((job) => {
    // Search term filter
    if (
      searchTerm &&
      !(
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some((skill) => skill?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) {
      return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(job.category)) {
      return false
    }

    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(job.difficulty)) {
      return false
    }

    // Price range filter
    const jobMinPrice = Number.parseInt(job.budget?.split("-")[0].replace(/\D/g, "") || "0")
    if (jobMinPrice < filters.priceRange[0] || jobMinPrice > filters.priceRange[1]) {
      return false
    }

    // Duration filter
    if (filters.duration.length > 0) {
      const durationMatch = filters.duration.some((duration) => {
        if (duration === "short" && job.duration?.includes("1")) return true
        if (duration === "medium" && job.duration?.includes("2")) return true
        if (
          duration === "long" &&
          (job.duration?.includes("3") || job.duration?.includes("4") || job.duration?.includes("5"))
        )
          return true
        return false
      })
      if (!durationMatch) return false
    }

    return true
  })

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return { ...prev, categories: newCategories }
    })
  }

  const handleDifficultyChange = (difficulty: string) => {
    setFilters((prev) => {
      const newDifficulty = prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter((d) => d !== difficulty)
        : [...prev.difficulty, difficulty]

      return { ...prev, difficulty: newDifficulty }
    })
  }

  const handleDurationChange = (duration: string) => {
    setFilters((prev) => {
      const newDuration = prev.duration.includes(duration)
        ? prev.duration.filter((d) => d !== duration)
        : [...prev.duration, duration]

      return { ...prev, duration: newDuration }
    })
  }

  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({ ...prev, priceRange: value }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      difficulty: [],
      priceRange: [0, 2000],
      duration: [],
    })
    setSearchTerm("")
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
        <p className="mt-2 text-muted-foreground">
          Browse through projects that match your skills and experience level
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-20 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "difficulty", "price", "duration"]}>
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="web-dev"
                        checked={filters.categories.includes("Web Development")}
                        onCheckedChange={() => handleCategoryChange("Web Development")}
                      />
                      <Label htmlFor="web-dev">Web Development</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-apps"
                        checked={filters.categories.includes("Mobile Apps")}
                        onCheckedChange={() => handleCategoryChange("Mobile Apps")}
                      />
                      <Label htmlFor="mobile-apps">Mobile Apps</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ui-ux"
                        checked={filters.categories.includes("UI/UX Design")}
                        onCheckedChange={() => handleCategoryChange("UI/UX Design")}
                      />
                      <Label htmlFor="ui-ux">UI/UX Design</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="database"
                        checked={filters.categories.includes("Database")}
                        onCheckedChange={() => handleCategoryChange("Database")}
                      />
                      <Label htmlFor="database">Database</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="difficulty">
                <AccordionTrigger>Experience Level</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="beginner"
                        checked={filters.difficulty.includes("Beginner")}
                        onCheckedChange={() => handleDifficultyChange("Beginner")}
                      />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="intermediate"
                        checked={filters.difficulty.includes("Intermediate")}
                        onCheckedChange={() => handleDifficultyChange("Intermediate")}
                      />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="advanced"
                        checked={filters.difficulty.includes("Advanced")}
                        onCheckedChange={() => handleDifficultyChange("Advanced")}
                      />
                      <Label htmlFor="advanced">Advanced</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Budget Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 2000]}
                      max={2000}
                      step={50}
                      value={filters.priceRange}
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="flex items-center justify-between">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="duration">
                <AccordionTrigger>Project Duration</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="short"
                        checked={filters.duration.includes("short")}
                        onCheckedChange={() => handleDurationChange("short")}
                      />
                      <Label htmlFor="short">Short (&lt; 1 week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medium"
                        checked={filters.duration.includes("medium")}
                        onCheckedChange={() => handleDurationChange("medium")}
                      />
                      <Label htmlFor="medium">Medium (1-2 weeks)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="long"
                        checked={filters.duration.includes("long")}
                        onCheckedChange={() => handleDurationChange("long")}
                      />
                      <Label htmlFor="long">Long (3+ weeks)</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs, skills, or keywords..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobsData.length} jobs
            </p>
          </div>

          {/* Job Listings */}
          <div className="grid gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                            {job.title}
                          </Link>
                        </CardTitle>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <span>{job.company}</span>
                          <span className="mx-2">•</span>
                          <span>{job.location}</span>
                          <span className="mx-2">•</span>
                          <span>{job.postedDate}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                        <span className="sr-only">Save job</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{job.category}</Badge>
                      <Badge variant="outline">{job.difficulty}</Badge>
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{job.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{job.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No jobs found</h3>
                <p className="mb-6 text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
