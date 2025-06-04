"use client"

import { useState, useEffect } from "react"
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
import { Search, Filter, Bookmark, Star, Clock, DollarSign, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ServiceData {
  service_id: string
  freelancer_id: string
  service_name: string
  price_range: [number, number]
  service_description: string
  category: string[]
  service_pictures?: string
  created_at: string
}

interface FreelancerData {
  user_id: string
  earnings: number
  skills: string[]
  jobs_finished: number
  ongoing_jobs: number
  rating: number
  bio?: string
}

interface ClientData {
  user_id: string
  full_name: string
  email: string
  created_at: string
}

interface CombinedServiceData extends ServiceData {
  freelancer?: FreelancerData
  freelancer_profile?: ClientData
}

export default function ServicesPage() {
  const [services, setServices] = useState<CombinedServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [],
    level: [],
    priceRange: [0, 2000],
    deliveryTime: [],
  })
  const [sortBy, setSortBy] = useState("newest")

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("🔍 Fetching services from serviceList table...")

        // Fetch all services
        const { data: servicesData, error: servicesError } = await supabase
          .from("serviceList")
          .select("*")
          .order("created_at", { ascending: false })

        if (servicesError) {
          console.error("❌ Services error:", servicesError)
          setError(`Failed to fetch services: ${servicesError.message}`)
          return
        }

        console.log("✅ Services fetched:", servicesData?.length || 0)

        if (!servicesData || servicesData.length === 0) {
          setServices([])
          return
        }

        // Get unique freelancer IDs
        const freelancerIds = [...new Set(servicesData.map((service) => service.freelancer_id))]
        console.log("👥 Fetching data for freelancers:", freelancerIds.length)

        // Fetch freelancer data
        const { data: freelancersData, error: freelancersError } = await supabase
          .from("freelancer")
          .select("*")
          .in("user_id", freelancerIds)

        if (freelancersError) {
          console.warn("⚠️ Freelancers error:", freelancersError)
        }

        // Fetch client profiles
        const { data: clientsData, error: clientsError } = await supabase
          .from("client")
          .select("*")
          .in("user_id", freelancerIds)

        if (clientsError) {
          console.warn("⚠️ Clients error:", clientsError)
        }

        // Combine the data
        const combinedServices: CombinedServiceData[] = servicesData.map((service) => ({
          ...service,
          freelancer: freelancersData?.find((f) => f.user_id === service.freelancer_id),
          freelancer_profile: clientsData?.find((c) => c.user_id === service.freelancer_id),
        }))

        console.log("✅ Combined services data:", combinedServices.length)
        setServices(combinedServices)

        // Calculate max price from all services
        const maxPrice = Math.max(
          ...combinedServices
            .filter((service) => service.price_range && Array.isArray(service.price_range))
            .map((service) => service.price_range[1]),
        )

        const finalMaxPrice = maxPrice > 0 ? Math.ceil(maxPrice / 100) * 100 : 2000 // Round up to nearest 100

        // Update filters with dynamic max price
        setFilters((prev) => ({
          ...prev,
          priceRange: [0, finalMaxPrice],
        }))
      } catch (error) {
        console.error("💥 Unexpected error:", error)
        setError("An unexpected error occurred while fetching services")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Get top 10 most popular categories from services
  const availableCategories = (() => {
    const categoryCount = {}
    services.forEach((service) => {
      service.category?.forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1
      })
    })

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a) // Sort by count descending
      .slice(0, 10) // Take top 10
      .map(([category]) => category)
  })()

  // Filter and sort services based on search term, filters, and sort option
  const filteredAndSortedServices = services
    .filter((service) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          service.service_name?.toLowerCase().includes(searchLower) ||
          service.service_description?.toLowerCase().includes(searchLower) ||
          service.category?.some((cat) => cat?.toLowerCase().includes(searchLower)) ||
          service.freelancer?.skills?.some((skill) => skill?.toLowerCase().includes(searchLower)) ||
          service.freelancer_profile?.full_name?.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.categories.length > 0) {
        const hasMatchingCategory = service.category?.some((cat) => filters.categories.includes(cat))
        if (!hasMatchingCategory) return false
      }

      // Price range filter
      if (service.price_range && Array.isArray(service.price_range)) {
        const [minPrice, maxPrice] = service.price_range
        if (minPrice < filters.priceRange[0] || maxPrice > filters.priceRange[1]) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "price-high":
          const maxPriceA = a.price_range?.[1] || 0
          const maxPriceB = b.price_range?.[1] || 0
          return maxPriceB - maxPriceA
        case "price-low":
          const minPriceA = a.price_range?.[0] || 0
          const minPriceB = b.price_range?.[0] || 0
          return minPriceA - minPriceB
        case "rating":
          const ratingA = a.freelancer?.rating || 0
          const ratingB = b.freelancer?.rating || 0
          return ratingB - ratingA
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? "s" : ""} ago`
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Services</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
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

            <Accordion type="multiple" defaultValue={["category", "price"]}>
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {availableCategories.length > 0 ? (
                      availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories available</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, filters.priceRange[1]]}
                      max={filters.priceRange[1]}
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
              Showing {filteredAndSortedServices.length} of {services.length} services
            </p>
          </div>

          {/* Service Listings */}
          <div className="grid gap-4">
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map((service) => (
                <Card key={service.service_id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          <Link href={`/services/${service.service_id}`} className="hover:text-primary">
                            {service.service_name}
                          </Link>
                        </CardTitle>
                        <div className="mt-1 flex items-center text-sm">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{service.freelancer_profile?.full_name?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {service.freelancer_profile?.full_name || "Unknown Freelancer"}
                            </span>
                          </div>
                          {service.freelancer && (
                            <>
                              <span className="mx-2">•</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                                <span>{service.freelancer.rating || 0}</span>
                                <span className="text-muted-foreground ml-1">
                                  ({service.freelancer.jobs_finished || 0})
                                </span>
                              </div>
                            </>
                          )}
                          <span className="mx-2">•</span>
                          <span className="text-muted-foreground">{formatTimeAgo(service.created_at)}</span>
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
                      {service.category?.map((cat, index) => (
                        <Badge key={index} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                      {service.freelancer?.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {service.freelancer?.skills && service.freelancer.skills.length > 3 && (
                        <Badge variant="outline">+{service.freelancer.skills.length - 3} more</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.service_description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {service.price_range && Array.isArray(service.price_range)
                            ? `$${service.price_range[0]} - $${service.price_range[1]}`
                            : "Price not set"}
                        </span>
                      </div>
                      {service.freelancer && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{service.freelancer.jobs_finished || 0} jobs completed</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/services/${service.service_id}`}>View Details</Link>
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
                <p className="mb-6 text-muted-foreground">
                  {services.length === 0
                    ? "No services have been created yet. Be the first to add a service!"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {services.length === 0 ? (
                  <Button asChild>
                    <Link href="/add-service">Add Your First Service</Link>
                  </Button>
                ) : (
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
