"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Upload, ImageIcon } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

interface ServiceFormData {
  service_name: string
  price_range: [number, number] // [min, max]
  service_description: string
  category: string[]
  service_pictures?: string
}

const predefinedCategories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "SEO",
  "Data Analysis",
  "Photography",
  "Video Editing",
  "Translation",
  "Virtual Assistant",
  "Consulting",
  "Programming",
  "WordPress",
]

export default function AddServicePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>({
    service_name: "",
    price_range: [0, 0],
    service_description: "",
    category: [],
    service_pictures: "",
  })

  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        // Verify user is a freelancer
        const { data: clientData } = await supabase.from("client").select("role").eq("user_id", user.id).single()

        if (clientData?.role !== "freelancer") {
          router.push("/dashboard")
          return
        }
      } else {
        router.push("/auth/login")
        return
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addCategory = (category: string) => {
    if (category && !formData.category.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, category],
      }))
    }
    setNewCategory("")
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat !== categoryToRemove),
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          service_pictures: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validation
    if (!formData.service_name.trim()) {
      alert("Please enter a service name")
      return
    }

    if (
      !formData.price_range[0] ||
      !formData.price_range[1] ||
      formData.price_range[0] <= 0 ||
      formData.price_range[1] <= 0
    ) {
      alert("Please enter valid minimum and maximum prices")
      return
    }

    if (formData.price_range[0] > formData.price_range[1]) {
      alert("Minimum price cannot be greater than maximum price")
      return
    }

    if (!formData.service_description.trim()) {
      alert("Please enter a service description")
      return
    }

    if (formData.category.length === 0) {
      alert("Please add at least one category")
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("serviceList")
        .insert({
          freelancer_id: user.id,
          service_name: formData.service_name.trim(),
          price_range: formData.price_range,
          service_description: formData.service_description.trim(),
          category: formData.category,
          service_pictures: formData.service_pictures || null,
        })
        .select()

      if (error) {
        console.error("Error creating service:", error)
        alert("Error creating service. Please try again.")
        return
      }

      router.push("/profile")
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading add service...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
        <p className="text-muted-foreground mt-2">
          Create a new service offering to showcase your skills and attract clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Fill in the information about your service. Be detailed and specific to attract the right clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="service_name">Service Name *</Label>
              <Input
                id="service_name"
                placeholder="e.g., Custom Website Development"
                value={formData.service_name}
                onChange={(e) => handleInputChange("service_name", e.target.value)}
                required
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range (USD) *</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="min_price" className="text-sm text-muted-foreground">
                    Minimum Price
                  </Label>
                  <Input
                    id="min_price"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.price_range[0] || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0
                      setFormData((prev) => ({
                        ...prev,
                        price_range: [value, prev.price_range[1]],
                      }))
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max_price" className="text-sm text-muted-foreground">
                    Maximum Price
                  </Label>
                  <Input
                    id="max_price"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.price_range[1] || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0
                      setFormData((prev) => ({
                        ...prev,
                        price_range: [prev.price_range[0], value],
                      }))
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Set your price range from minimum to maximum for this service
              </p>
            </div>

            {/* Service Description */}
            <div className="space-y-2">
              <Label htmlFor="service_description">Service Description *</Label>
              <Textarea
                id="service_description"
                placeholder="Describe your service in detail. What do you offer? What makes you unique? What can clients expect?"
                value={formData.service_description}
                onChange={(e) => handleInputChange("service_description", e.target.value)}
                rows={5}
                required
              />
              <p className="text-sm text-muted-foreground">{formData.service_description.length}/500 characters</p>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <Label>Categories/Tags *</Label>

              {/* Selected Categories */}
              {formData.category.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.category.map((cat, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Predefined Categories */}
              <div className="space-y-2">
                <Label className="text-sm">Quick Add Categories:</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedCategories
                    .filter((cat) => !formData.category.includes(cat))
                    .map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCategory(cat)}
                        className="h-8"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {cat}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Custom Category Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCategory(newCategory)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCategory(newCategory)}
                  disabled={!newCategory.trim()}
                >
                  Add
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">Add relevant categories to help clients find your service</p>
            </div>

            {/* Service Image */}
            <div className="space-y-4">
              <Label>Service Image (Optional)</Label>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Service preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData((prev) => ({ ...prev, service_pictures: "" }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload an image to showcase your service (JPG, PNG, GIF)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Creating Service..." : "Create Service"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
