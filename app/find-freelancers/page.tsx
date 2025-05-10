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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Zap,
  Award,
  ThumbsUp,
  Sparkles,
} from "lucide-react"

// Mock data for freelancers
const freelancersData = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Frontend Developer",
    avatar: "/placeholder.svg",
    location: "San Francisco, CA",
    hourlyRate: "$25-$40",
    rating: 4.8,
    reviews: 12,
    skills: ["React", "Next.js", "Tailwind CSS"],
    experience: "Beginner",
    bio: "Self-taught developer passionate about creating clean, user-friendly interfaces. Specializing in React and Next.js development.",
    completedProjects: 8,
    joinedDate: "3 months ago",
    availability: "Full-time",
    responseTime: "Under 2 hours",
    featured: true,
    verified: true,
    categories: ["Web Development", "Frontend"],
  },
  {
    id: 2,
    name: "Sarah Parker",
    title: "UI/UX Designer",
    avatar: "/placeholder.svg",
    location: "New York, NY",
    hourlyRate: "$30-$45",
    rating: 4.9,
    reviews: 15,
    skills: ["Figma", "UI Design", "User Research"],
    experience: "Intermediate",
    bio: "Creative designer with a focus on intuitive user experiences. I help startups and small businesses create beautiful, functional interfaces.",
    completedProjects: 15,
    joinedDate: "6 months ago",
    availability: "Part-time",
    responseTime: "Under 4 hours",
    featured: true,
    verified: true,
    categories: ["UI/UX Design", "Graphic Design"],
  },
  {
    id: 3,
    name: "Michael Brown",
    title: "WordPress Developer",
    avatar: "/placeholder.svg",
    location: "Chicago, IL",
    hourlyRate: "$20-$35",
    rating: 4.7,
    reviews: 9,
    skills: ["WordPress", "PHP", "CSS"],
    experience: "Beginner",
    bio: "WordPress specialist focused on creating custom themes and plugins. I help small businesses establish their online presence.",
    completedProjects: 6,
    joinedDate: "2 months ago",
    availability: "Full-time",
    responseTime: "Under 3 hours",
    featured: false,
    verified: true,
    categories: ["Web Development", "WordPress"],
  },
  {
    id: 4,
    name: "Emily Wilson",
    title: "Content Writer",
    avatar: "/placeholder.svg",
    location: "Austin, TX",
    hourlyRate: "$20-$30",
    rating: 4.6,
    reviews: 7,
    skills: ["Blog Writing", "SEO", "Copywriting"],
    experience: "Beginner",
    bio: "Creative writer with a knack for engaging content. I specialize in blog posts, articles, and SEO-optimized content for websites.",
    completedProjects: 5,
    joinedDate: "1 month ago",
    availability: "Part-time",
    responseTime: "Under 5 hours",
    featured: false,
    verified: true,
    categories: ["Content Creation", "Writing"],
  },
  {
    id: 5,
    name: "David Lee",
    title: "Mobile App Developer",
    avatar: "/placeholder.svg",
    location: "Seattle, WA",
    hourlyRate: "$35-$50",
    rating: 4.9,
    reviews: 18,
    skills: ["React Native", "Flutter", "Firebase"],
    experience: "Intermediate",
    bio: "Mobile app developer specializing in cross-platform solutions. I build beautiful, functional apps for iOS and Android.",
    completedProjects: 12,
    joinedDate: "5 months ago",
    availability: "Full-time",
    responseTime: "Under 2 hours",
    featured: true,
    verified: true,
    categories: ["Mobile Development", "App Development"],
  },
  {
    id: 6,
    name: "Jessica Martinez",
    title: "Graphic Designer",
    avatar: "/placeholder.svg",
    location: "Miami, FL",
    hourlyRate: "$25-$40",
    rating: 4.7,
    reviews: 11,
    skills: ["Illustrator", "Photoshop", "Brand Identity"],
    experience: "Beginner",
    bio: "Creative graphic designer with an eye for detail. I create logos, brand identities, and marketing materials that stand out.",
    completedProjects: 9,
    joinedDate: "4 months ago",
    availability: "Part-time",
    responseTime: "Under 4 hours",
    featured: false,
    verified: true,
    categories: ["Graphic Design", "Branding"],
  },
  {
    id: 7,
    name: "Ryan Thompson",
    title: "Backend Developer",
    avatar: "/placeholder.svg",
    location: "Denver, CO",
    hourlyRate: "$30-$45",
    rating: 4.8,
    reviews: 14,
    skills: ["Node.js", "Express", "MongoDB"],
    experience: "Intermediate",
    bio: "Backend developer focused on building robust APIs and server-side applications. I specialize in Node.js and database design.",
    completedProjects: 11,
    joinedDate: "5 months ago",
    availability: "Full-time",
    responseTime: "Under 3 hours",
    featured: false,
    verified: true,
    categories: ["Web Development", "Backend"],
  },
  {
    id: 8,
    name: "Olivia Garcia",
    title: "Digital Marketer",
    avatar: "/placeholder.svg",
    location: "Portland, OR",
    hourlyRate: "$25-$35",
    rating: 4.6,
    reviews: 8,
    skills: ["Social Media", "SEO", "Email Marketing"],
    experience: "Beginner",
    bio: "Digital marketing specialist with a focus on growth strategies. I help businesses increase their online presence and reach their target audience.",
    completedProjects: 7,
    joinedDate: "3 months ago",
    availability: "Part-time",
    responseTime: "Under 5 hours",
    featured: false,
    verified: true,
    categories: ["Digital Marketing", "Social Media"],
  },
]

export default function FindFreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<{
    categories: string[]
    experience: string[]
    rateRange: number[]
    availability: string[]
    featured: boolean
  }>({
    categories: [],
    experience: [],
    rateRange: [0, 100],
    availability: [],
    featured: false,
  })
  const [viewMode, setViewMode] = useState("grid")

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
    if (filters.categories.length > 0 && !filters.categories.some((cat) => freelancer.categories.includes(cat))) {
      return false
    }

    // Experience filter
    if (filters.experience.length > 0 && !filters.experience.includes(freelancer.experience)) {
      return false
    }

    // Rate range filter
    const freelancerMinRate = Number.parseInt(freelancer.hourlyRate?.split("-")[0].replace(/\D/g, "") || "0")
    if (freelancerMinRate < filters.rateRange[0] || freelancerMinRate > filters.rateRange[1]) {
      return false
    }

    // Availability filter
    if (filters.availability.length > 0 && !filters.availability.includes(freelancer.availability)) {
      return false
    }

    // Featured filter
    if (filters.featured && !freelancer.featured) {
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

  const handleExperienceChange = (experience: string) => {
    setFilters((prev) => {
      const newExperience = prev.experience.includes(experience)
        ? prev.experience.filter((e) => e !== experience)
        : [...prev.experience, experience]

      return { ...prev, experience: newExperience }
    })
  }

  const handleAvailabilityChange = (availability: string) => {
    setFilters((prev) => {
      const newAvailability = prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability]

      return { ...prev, availability: newAvailability }
    })
  }

  const handleRateRangeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, rateRange: value }))
  }

  const handleFeaturedChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, featured: checked }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      experience: [],
      rateRange: [0, 100],
      availability: [],
      featured: false,
    })
    setSearchTerm("")
  }

  // Function to render freelancer grid
  const renderFreelancerGrid = () => {
    if (filteredFreelancers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No freelancers found</h3>
          <p className="mb-6 text-muted-foreground">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFreelancers.map((freelancer) => (
          <Card
            key={freelancer.id}
            className={`overflow-hidden ${freelancer.featured && filters.featured ? "border-2 border-primary/20" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={freelancer.avatar || "/placeholder.svg"} alt={freelancer.name} />
                  <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    <Link href={`/freelancers/${freelancer.id}`} className="hover:text-primary">
                      {freelancer.name}
                    </Link>
                    {freelancer.verified && (
                      <Badge variant="secondary" className="ml-2">
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm font-medium">{freelancer.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {freelancer.location}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{freelancer.bio}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>
                    {freelancer.rating} ({freelancer.reviews})
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{freelancer.hourlyRate}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{freelancer.completedProjects} projects</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{freelancer.availability}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Function to render freelancer list
  const renderFreelancerList = () => {
    if (filteredFreelancers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No freelancers found</h3>
          <p className="mb-6 text-muted-foreground">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredFreelancers.map((freelancer) => (
          <Card
            key={freelancer.id}
            className={`overflow-hidden ${freelancer.featured && filters.featured ? "border-2 border-primary/20" : ""}`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="p-4 md:w-3/4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={freelancer.avatar || "/placeholder.svg"} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Link href={`/freelancers/${freelancer.id}`} className="text-lg font-semibold hover:text-primary">
                        {freelancer.name}
                      </Link>
                      {freelancer.verified && (
                        <Badge variant="secondary" className="ml-2">
                          Verified
                        </Badge>
                      )}
                      {freelancer.featured && (
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                          <Sparkles className="mr-1 h-3 w-3" /> Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{freelancer.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {freelancer.location}
                      <span className="mx-2">•</span>
                      <Star className="mr-1 h-3 w-3 text-yellow-500" />
                      {freelancer.rating} ({freelancer.reviews} reviews)
                      <span className="mx-2">•</span>
                      <span>Joined {freelancer.joinedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{freelancer.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{freelancer.completedProjects} projects</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{freelancer.availability}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{freelancer.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{freelancer.experience}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l md:w-1/4">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold">{freelancer.hourlyRate}</div>
                  <div className="text-sm text-muted-foreground">per hour</div>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Freelancers</h1>
        <p className="mt-2 text-muted-foreground">
          Discover emerging tech talent ready to bring fresh perspectives to your projects
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-20 rounded-lg border bg-card p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "experience", "rate", "availability", "other"]}>
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
                        id="mobile-dev"
                        checked={filters.categories.includes("Mobile Development")}
                        onCheckedChange={() => handleCategoryChange("Mobile Development")}
                      />
                      <Label htmlFor="mobile-dev">Mobile Development</Label>
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
                        id="graphic-design"
                        checked={filters.categories.includes("Graphic Design")}
                        onCheckedChange={() => handleCategoryChange("Graphic Design")}
                      />
                      <Label htmlFor="graphic-design">Graphic Design</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="content"
                        checked={filters.categories.includes("Content Creation")}
                        onCheckedChange={() => handleCategoryChange("Content Creation")}
                      />
                      <Label htmlFor="content">Content Creation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={filters.categories.includes("Digital Marketing")}
                        onCheckedChange={() => handleCategoryChange("Digital Marketing")}
                      />
                      <Label htmlFor="marketing">Digital Marketing</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="experience">
                <AccordionTrigger>Experience Level</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="beginner"
                        checked={filters.experience.includes("Beginner")}
                        onCheckedChange={() => handleExperienceChange("Beginner")}
                      />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="intermediate"
                        checked={filters.experience.includes("Intermediate")}
                        onCheckedChange={() => handleExperienceChange("Intermediate")}
                      />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="advanced"
                        checked={filters.experience.includes("Advanced")}
                        onCheckedChange={() => handleExperienceChange("Advanced")}
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

              <AccordionItem value="availability">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="full-time"
                        checked={filters.availability.includes("Full-time")}
                        onCheckedChange={() => handleAvailabilityChange("Full-time")}
                      />
                      <Label htmlFor="full-time">Full-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="part-time"
                        checked={filters.availability.includes("Part-time")}
                        onCheckedChange={() => handleAvailabilityChange("Part-time")}
                      />
                      <Label htmlFor="part-time">Part-time</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger>Other</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={filters.featured}
                        onCheckedChange={(checked) => handleFeaturedChange(checked as boolean)}
                      />
                      <Label htmlFor="featured">Featured Freelancers</Label>
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
                placeholder="Search by name, skills, or keywords..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                  <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                  <SelectItem value="rate-high">Rate: High to Low</SelectItem>
                  <SelectItem value="newest">Newest Members</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={viewMode} onValueChange={setViewMode} className="hidden sm:block">
                <TabsList className="grid w-[100px] grid-cols-2">
                  <TabsTrigger value="grid" className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" />
                      <line x1="3" x2="3.01" y1="12" y2="12" />
                      <line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFreelancers.length} of {freelancersData.length} freelancers
            </p>
          </div>

          {/* Featured Freelancers */}
          {!filters.featured && filteredFreelancers.some((f) => f.featured) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-500" /> Featured Talent
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFreelancers
                  .filter((f) => f.featured)
                  .slice(0, 3)
                  .map((freelancer) => (
                    <Card key={freelancer.id} className="overflow-hidden border-2 border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={freelancer.avatar || "/placeholder.svg"} alt={freelancer.name} />
                            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <CardTitle className="text-base">
                              <Link href={`/freelancers/${freelancer.id}`} className="hover:text-primary">
                                {freelancer.name}
                              </Link>
                              {freelancer.verified && (
                                <Badge variant="secondary" className="ml-2">
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm font-medium">{freelancer.title}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {freelancer.location}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{freelancer.bio}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                            <span>
                              {freelancer.rating} ({freelancer.reviews})
                            </span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{freelancer.hourlyRate}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{freelancer.completedProjects} projects</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{freelancer.availability}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Freelancer Listings with Tabs */}
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsContent value="grid">{renderFreelancerGrid()}</TabsContent>
            <TabsContent value="list">{renderFreelancerList()}</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Why Hire Emerging Talent Section */}
      <section className="mt-16 bg-muted rounded-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Why Hire Emerging Talent?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the benefits of working with motivated newcomers who bring fresh perspectives to your projects
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-background rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fresh Perspectives</h3>
            <p className="text-sm text-muted-foreground">
              New freelancers bring innovative ideas and approaches that can revitalize your projects with creativity
            </p>
          </div>

          <div className="bg-background rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Competitive Rates</h3>
            <p className="text-sm text-muted-foreground">
              Get quality work at more affordable rates as emerging freelancers build their reputation and portfolio
            </p>
          </div>

          <div className="bg-background rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">High Motivation</h3>
            <p className="text-sm text-muted-foreground">
              New freelancers are eager to prove themselves, often going above and beyond to ensure client satisfaction
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/auth/register?type=client">Post a Project</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
