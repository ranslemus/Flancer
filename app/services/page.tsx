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
import { Search, Filter, Bookmark, Star, Clock, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for services
const servicesData = [
  {
    id: 1,
    title: "Responsive Website Development",
    freelancer: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 24,
    },
    location: "Remote",
    type: "Web Development",
    price: "$500-$1000",
    deliveryTime: "2-4 weeks",
    skills: ["React", "Next.js", "Tailwind CSS"],
    description: "I'll build a responsive, modern website for your business using the latest technologies.",
    postedDate: "2 days ago",
    level: "Intermediate",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Mobile App UI Design",
    freelancer: {
      name: "Sarah Parker",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviews: 18,
    },
    location: "Remote",
    type: "UI/UX Design",
    price: "$300-$600",
    deliveryTime: "1-2 weeks",
    skills: ["Figma", "UI/UX", "Mobile Design"],
    description: "I'll create a clean, modern UI design for your mobile application with user-friendly interfaces.",
    postedDate: "5 days ago",
    level: "Intermediate",
    category: "UI/UX Design",
  },
  {
    id: 3,
    title: "WordPress Website Setup",
    freelancer: {
      name: "Michael Brown",
      avatar: "/placeholder.svg",
      rating: 4.7,
      reviews: 12,
    },
    location: "Remote",
    type: "Web Development",
    price: "$200-$400",
    deliveryTime: "1 week",
    skills: ["WordPress", "PHP", "CSS"],
    description: "I'll set up and customize a WordPress website with all essential plugins and features you need.",
    postedDate: "1 week ago",
    level: "Beginner",
    category: "Web Development",
  },
  {
    id: 4,
    title: "Android App Development",
    freelancer: {
      name: "David Wilson",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 31,
    },
    location: "Remote",
    type: "Mobile Development",
    price: "$800-$1500",
    deliveryTime: "3-5 weeks",
    skills: ["Java", "Android Studio", "Firebase"],
    description: "I'll develop a custom Android app with user authentication, database integration, and more.",
    postedDate: "3 days ago",
    level: "Intermediate",
    category: "Mobile Apps",
  },
  {
    id: 5,
    title: "Landing Page Design & Development",
    freelancer: {
      name: "Emma Roberts",
      avatar: "/placeholder.svg",
      rating: 4.6,
      reviews: 9,
    },
    location: "Remote",
    type: "Web Development",
    price: "$300-$500",
    deliveryTime: "1-2 weeks",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "I'll create a high-converting landing page for your product or service with responsive design.",
    postedDate: "4 days ago",
    level: "Beginner",
    category: "Web Development",
  },
  {
    id: 6,
    title: "Database Design & Implementation",
    freelancer: {
      name: "James Taylor",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviews: 15,
    },
    location: "Remote",
    type: "Database",
    price: "$400-$700",
    deliveryTime: "2 weeks",
    skills: ["SQL", "Database Design", "ERD"],
    description: "I'll design and implement a database schema for your application with complete documentation.",
    postedDate: "1 week ago",
    level: "Intermediate",
    category: "Database",
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [],
    level: [],
    priceRange: [0, 2000],
    deliveryTime: [],
  })
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort services based on search term, filters, and sort option
  const filteredAndSortedServices = servicesData
    .filter((service) => {
      // Search term filter
      if (
        searchTerm &&
        !(
          service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.skills?.some((skill) => skill?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          service.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(service.category)) {
        return false
      }

      // Level filter
      if (filters.level.length > 0 && !filters.level.includes(service.level)) {
        return false
      }

      // Price range filter
      const serviceMinPrice = Number.parseInt(service.price?.split("-")[0].replace(/\D/g, "") || "0")
      if (serviceMinPrice < filters.priceRange[0] || serviceMinPrice > filters.priceRange[1]) {
        return false
      }

      // Delivery time filter
      if (filters.deliveryTime.length > 0) {
        const deliveryMatch = filters.deliveryTime.some((time) => {
          if (time === "short" && service.deliveryTime?.includes("1")) return true
          if (time === "medium" && service.deliveryTime?.includes("2")) return true
          if (
            time === "long" &&
            (service.deliveryTime?.includes("3") ||
              service.deliveryTime?.includes("4") ||
              service.deliveryTime?.includes("5"))
          )
            return true
          return false
        })
        if (!deliveryMatch) return false
      }

      return true
    })
    .sort((a, b) => {
      // Helper function to convert relative time to days for sorting
      const getRelativeDays = (timeString) => {
        const match = timeString.match(/(\d+)\s+(day|week|month)s?\s+ago/)
        if (!match) return 0

        const [, number, unit] = match
        const num = Number.parseInt(number)

        switch (unit) {
          case "day":
            return num
          case "week":
            return num * 7
          case "month":
            return num * 30
          default:
            return 0
        }
      }

      switch (sortBy) {
        case "newest":
          // Sort by posted date (newest first - smaller days ago = more recent)
          const daysAgoA = getRelativeDays(a.postedDate)
          const daysAgoB = getRelativeDays(b.postedDate)
          return daysAgoA - daysAgoB
        case "oldest":
          // Sort by posted date (oldest first - larger days ago = older)
          const daysAgoA2 = getRelativeDays(a.postedDate)
          const daysAgoB2 = getRelativeDays(b.postedDate)
          return daysAgoB2 - daysAgoA2
        case "price-high":
          // Sort by price (high to low)
          const priceA = Number.parseInt(a.price?.split("-")[1].replace(/\D/g, "") || "0")
          const priceB = Number.parseInt(b.price?.split("-")[1].replace(/\D/g, "") || "0")
          return priceB - priceA
        case "price-low":
          // Sort by price (low to high)
          const priceA2 = Number.parseInt(a.price?.split("-")[0].replace(/\D/g, "") || "0")
          const priceB2 = Number.parseInt(b.price?.split("-")[0].replace(/\D/g, "") || "0")
          return priceA2 - priceB2
        case "rating":
          // Sort by rating (highest first)
          return b.freelancer.rating - a.freelancer.rating
        default:
          return 0
      }
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
      const newLevel = prev.level.includes(level) ? prev.level.filter((d) => d !== level) : [...prev.level, level]

      return { ...prev, level: newLevel }
    })
  }

  const handleDeliveryTimeChange = (time: string) => {
    setFilters((prev) => {
      const newDeliveryTime = prev.deliveryTime.includes(time)
        ? prev.deliveryTime.filter((d) => d !== time)
        : [...prev.deliveryTime, time]

      return { ...prev, deliveryTime: newDeliveryTime }
    })
  }

  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({ ...prev, priceRange: value }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      level: [],
      priceRange: [0, 2000],
      deliveryTime: [],
    })
    setSearchTerm("")
    setSortBy("newest")
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
        <p className="mt-2 text-muted-foreground">
          Discover services offered by talented freelancers in various tech fields
        </p>
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

            <Accordion type="multiple" defaultValue={["category", "level", "price", "delivery"]}>
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

              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
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

              <AccordionItem value="delivery">
                <AccordionTrigger>Delivery Time</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="short"
                        checked={filters.deliveryTime.includes("short")}
                        onCheckedChange={() => handleDeliveryTimeChange("short")}
                      />
                      <Label htmlFor="short">Short (&lt; 1 week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medium"
                        checked={filters.deliveryTime.includes("medium")}
                        onCheckedChange={() => handleDeliveryTimeChange("medium")}
                      />
                      <Label htmlFor="medium">Medium (1-2 weeks)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="long"
                        checked={filters.deliveryTime.includes("long")}
                        onCheckedChange={() => handleDeliveryTimeChange("long")}
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
                placeholder="Search services, skills, or freelancers..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedServices.length} of {servicesData.length} services
            </p>
          </div>

          {/* Service Listings */}
          <div className="grid gap-4">
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          <Link href={`/services/${service.id}`} className="hover:text-primary">
                            {service.title}
                          </Link>
                        </CardTitle>
                        <div className="mt-1 flex items-center text-sm">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage
                                src={service.freelancer.avatar || "/placeholder.svg"}
                                alt={service.freelancer.name}
                              />
                              <AvatarFallback>{service.freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{service.freelancer.name}</span>
                          </div>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                            <span>{service.freelancer.rating}</span>
                            <span className="text-muted-foreground ml-1">({service.freelancer.reviews})</span>
                          </div>
                          <span className="mx-2">•</span>
                          <span className="text-muted-foreground">{service.postedDate}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                        <span className="sr-only">Save service</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{service.category}</Badge>
                      <Badge variant="outline">{service.level}</Badge>
                      {service.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{service.price}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{service.deliveryTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/services/${service.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No services found</h3>
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
