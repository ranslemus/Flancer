"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter, Star, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"

// Define types for our data and state
interface Freelancer {
  id: number
  name: string
  username: string
  title: string
  location: string
  skills: string[]
  bio: string
  rating: number
  reviews: number
  hourlyRate: string
  level: string
  category: string
  avatar: string
  memberSince: string
}

interface FilterState {
  categories: string[]
  level: string[]
  rateRange: number[]
}

// Mock data for freelancers
const freelancersData: Freelancer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    username: "alexj",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    skills: ["React", "Next.js", "Tailwind CSS"],
    bio: "Self-taught developer with a passion for creating clean, user-friendly interfaces. Specializing in React and Next.js development.",
    rating: 4.9,
    reviews: 24,
    hourlyRate: "$40-$60",
    level: "Intermediate",
    category: "Web Development",
    avatar: "/placeholder.svg",
    memberSince: "2022",
  },
  {
    id: 2,
    name: "Sarah Parker",
    username: "sarahp",
    title: "UI/UX Designer",
    location: "New York, NY",
    skills: ["Figma", "UI/UX", "Adobe XD"],
    bio: "Creative designer focused on creating intuitive and beautiful user experiences. I combine aesthetics with functionality.",
    rating: 4.8,
    reviews: 18,
    hourlyRate: "$45-$70",
    level: "Advanced",
    category: "UI/UX Design",
    avatar: "/placeholder.svg",
    memberSince: "2021",
  },
  {
    id: 3,
    name: "Michael Brown",
    username: "michaelb",
    title: "WordPress Developer",
    location: "Chicago, IL",
    skills: ["WordPress", "PHP", "CSS"],
    bio: "WordPress expert with 3 years of experience. I create custom themes and plugins to make your website stand out.",
    rating: 4.7,
    reviews: 12,
    hourlyRate: "$30-$50",
    level: "Beginner",
    category: "Web Development",
    avatar: "/placeholder.svg",
    memberSince: "2023",
  },
  {
    id: 4,
    name: "David Wilson",
    username: "davidw",
    title: "Mobile App Developer",
    location: "Austin, TX",
    skills: ["React Native", "Flutter", "Firebase"],
    bio: "Mobile app developer specializing in cross-platform solutions. I build apps that work seamlessly on both iOS and Android.",
    rating: 4.9,
    reviews: 31,
    hourlyRate: "$50-$80",
    level: "Advanced",
    category: "Mobile Apps",
    avatar: "/placeholder.svg",
    memberSince: "2020",
  },
  {
    id: 5,
    name: "Emma Roberts",
    username: "emmar",
    title: "Frontend Developer",
    location: "Seattle, WA",
    skills: ["HTML", "CSS", "JavaScript"],
    bio: "Frontend developer focused on creating responsive and accessible websites. I ensure your site looks great on all devices.",
    rating: 4.6,
    reviews: 9,
    hourlyRate: "$25-$45",
    level: "Beginner",
    category: "Web Development",
    avatar: "/placeholder.svg",
    memberSince: "2023",
  },
  {
    id: 6,
    name: "James Taylor",
    username: "jamest",
    title: "Database Developer",
    location: "Denver, CO",
    skills: ["SQL", "MongoDB", "PostgreSQL"],
    bio: "Database specialist with expertise in designing efficient database structures and optimizing queries for performance.",
    rating: 4.8,
    reviews: 15,
    hourlyRate: "$40-$65",
    level: "Intermediate",
    category: "Database",
    avatar: "/placeholder.svg",
    memberSince: "2021",
  },
]

export default function FreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    level: [],
    rateRange: [0, 100],
  })

  // Filter freelancers based on search term and filters
  const filteredFreelancers = freelancersData.filter((freelancer) => {
    // Search term filter
    if (
      searchTerm &&
      !(
        freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills?.some((skill) => skill?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) {
      return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(freelancer.category)) {
      return false
    }

    // Level filter
    if (filters.level.length > 0 && !filters.level.includes(freelancer.level)) {
      return false
    }

    // Rate range filter
    const freelancerMinRate = Number.parseInt(freelancer.hourlyRate?.split("-")[0].replace(/\D/g, "") || "0")
    if (freelancerMinRate < filters.rateRange[0] || freelancerMinRate > filters.rateRange[1]) {
      return false
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

  const handleLevelChange = (level: string) => {
    setFilters((prev) => {
      const newLevel = prev.level.includes(level) ? prev.level.filter((l) => l !== level) : [...prev.level, level]

      return { ...prev, level: newLevel }
    })
  }

  const handleRateRangeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, rateRange: value }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      level: [],
      rateRange: [0, 100],
    })
    setSearchTerm("")
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Freelancers</h1>
        <p className="mt-2 text-muted-foreground">Discover talented freelancers in various tech fields</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="md:sticky md:top-20 rounded-lg border bg-card p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "level", "rate"]}>
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

              <AccordionItem value="level">
                <AccordionTrigger>Experience Level</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="beginner"
                        checked={filters.level.includes("Beginner")}
                        onCheckedChange={() => handleLevelChange("Beginner")}
                      />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="intermediate"
                        checked={filters.level.includes("Intermediate")}
                        onCheckedChange={() => handleLevelChange("Intermediate")}
                      />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="advanced"
                        checked={filters.level.includes("Advanced")}
                        onCheckedChange={() => handleLevelChange("Advanced")}
                      />
                      <Label htmlFor="advanced">Advanced</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rate">
                <AccordionTrigger>Hourly Rate</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={5}
                      value={filters.rateRange}
                      onValueChange={handleRateRangeChange}
                    />
                    <div className="flex items-center justify-between">
                      <span>${filters.rateRange[0]}</span>
                      <span>${filters.rateRange[1]}</span>
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
                placeholder="Search freelancers, skills, or keywords..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="rating">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rate-high">Rate: High to Low</SelectItem>
                <SelectItem value="rate-low">Rate: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFreelancers.length} of {freelancersData.length} freelancers
            </p>
          </div>

          {/* Freelancer Listings */}
          <div className="grid gap-4">
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-shrink-0">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={freelancer.avatar || "/placeholder.svg"} alt={freelancer.name} />
                          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <Link href={`/freelancers/${freelancer.username}`} className="hover:underline">
                              <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                            </Link>
                            <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="ml-1 font-medium">{freelancer.rating}</span>
                              <span className="ml-1 text-muted-foreground">({freelancer.reviews})</span>
                            </div>
                            <Badge variant="outline">{freelancer.level}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          {freelancer.location}
                        </div>
                        <p className="text-sm line-clamp-2">{freelancer.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                          <div className="text-sm">
                            <span className="font-medium">{freelancer.hourlyRate}</span> / hour
                          </div>
                          <Button asChild>
                            <Link href={`/freelancers/${freelancer.username}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No freelancers found</h3>
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
