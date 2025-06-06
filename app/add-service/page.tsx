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
import { ArrowLeft, Plus, X, Upload, ImageIcon, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

interface ServiceFormData {
  service_name: string
  price_range: [number, number] // [min, max]
  service_description: string
  category: string[]
  image_url?: string
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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>({
    service_name: "",
    price_range: [0, 0],
    service_description: "",
    category: [],
    image_url: "",
  })
  const [enhancing, setEnhancing] = useState(false)
  const [categorizingAI, setCategorizingAI] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          console.log("Current user:", user.id)

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
      } catch (error) {
        console.error("Error in getUser:", error)
        setLoading(false)
        router.push("/auth/login")
      }
    }
    getUser()
  }, [])

  // Test storage access on component mount
  useEffect(() => {
    const testStorageAccess = async () => {
      if (!user) return

      try {
        console.log("Testing storage access...")

        // Test if we can list files in the bucket
        const { data: files, error: listError } = await supabase.storage.from("serviceimages").list("", { limit: 1 })

        if (listError) {
          console.error("Storage list error:", listError)
        } else {
          console.log("Storage access test successful:", files)
        }

        // Test bucket info
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        if (bucketError) {
          console.error("Bucket list error:", bucketError)
        } else {
          console.log("Available buckets:", buckets)
          const serviceImagesBucket = buckets.find((b) => b.name === "serviceimages")
          console.log("serviceimages bucket config:", serviceImagesBucket)
        }
      } catch (error) {
        console.error("Storage test error:", error)
      }
    }

    testStorageAccess()
  }, [user])

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI("AIzaSyDGrepRgEhtOlRfEXcaWNCiqKOO6T1x-fg")

  const enhanceWithAI = async () => {
    if (!formData.service_name.trim() && !formData.service_description.trim()) {
      alert("Please enter at least a service name or description to enhance")
      return
    }

    setEnhancing(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
  You are a professional copywriter helping freelancers improve their service listings. Based on the following service information, enhance and improve the content to be more professional, compelling, and attractive to potential clients.

  Current Service Name: "${formData.service_name}"
  Current Description: "${formData.service_description}"

  Please provide:
  1. An improved, professional service name (keep it concise but compelling)
  2. An enhanced service description (150-300 words, professional tone, highlighting benefits and unique value)

  Format your response as JSON:
  {
    "enhanced_name": "improved service name here",
    "enhanced_description": "improved description here"
  }

  Make sure the enhanced content is professional, specific, and focuses on client benefits. Keep the core service concept but make it more marketable.
  `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const rawText = response.text()

      // Remove markdown formatting if present
      const cleanedText = rawText.replace(/```(?:json)?\n?([\s\S]*?)```/, "$1").trim()

      try {
        const enhancedData = JSON.parse(cleanedText)

        if (enhancedData.enhanced_name) {
          setFormData((prev) => ({
            ...prev,
            service_name: enhancedData.enhanced_name,
          }))
        }

        if (enhancedData.enhanced_description) {
          setFormData((prev) => ({
            ...prev,
            service_description: enhancedData.enhanced_description,
          }))
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
      }
    } catch (error) {
      console.error("Error enhancing with AI:", error)
      alert("Error enhancing content with AI. Please try again.")
    } finally {
      setEnhancing(false)
    }
  }

  const suggestCategoriesWithAI = async () => {
    if (!formData.service_name.trim() && !formData.service_description.trim()) {
      alert("Please enter a service name or description first")
      return
    }

    setCategorizingAI(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const availableCategories = predefinedCategories.join(", ")

      const prompt = `
      Analyze the following service information and suggest the most appropriate categories from the available list.

      Service Name: "${formData.service_name}"
      Service Description: "${formData.service_description}"

      Available Categories: ${availableCategories}

      Based on the service information, select 2-4 most relevant categories from the available list. Only suggest categories that exist in the available list.

      Format your response as a JSON array of category names:
      ["Category 1", "Category 2", "Category 3"]

      Be selective and only choose the most relevant categories.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const rawText = response.text()
      const cleanedText = rawText.replace(/```(?:json)?\n?([\s\S]*?)```/, "$1").trim()
      try {
        const suggestedCategories = JSON.parse(cleanedText)

        if (Array.isArray(suggestedCategories)) {
          // Add suggested categories that aren't already selected
          const newCategories = suggestedCategories.filter(
            (cat) => predefinedCategories.includes(cat) && !formData.category.includes(cat),
          )

          if (newCategories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: [...prev.category, ...newCategories],
            }))
          }
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        alert("AI categorization completed but response format was unexpected. Please try again.")
      }
    } catch (error) {
      console.error("Error suggesting categories with AI:", error)
      alert("Error getting AI category suggestions. Please try again.")
    } finally {
      setCategorizingAI(false)
    }
  }

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, GIF, WebP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setUploadingImage(true)

    try {
      // Create unique filename with timestamp and user ID
      const fileExt = file.name.split(".").pop()?.toLowerCase()
      const fileName = `service-${user.id}-${Date.now()}.${fileExt}`

      console.log("=== UPLOAD DEBUG INFO ===")
      console.log("Uploading image:", fileName)
      console.log("User ID:", user.id)
      console.log("File size:", file.size)
      console.log("File type:", file.type)
      console.log("Bucket: serviceimages")

      // First, let's test if we can access the bucket
      const { data: bucketTest, error: bucketTestError } = await supabase.storage
        .from("serviceimages")
        .list("", { limit: 1 })

      if (bucketTestError) {
        console.error("Bucket access test failed:", bucketTestError)
        alert(`Cannot access storage bucket: ${bucketTestError.message}`)
        return
      }

      console.log("Bucket access test passed:", bucketTest)

      // Upload to Supabase Storage with minimal options first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("serviceimages")
        .upload(fileName, file)

      if (uploadError) {
        console.error("=== UPLOAD ERROR DETAILS ===")
        console.error("Error message:", uploadError.message)
        console.error("Error details:", uploadError)
        console.error("Error stack:", uploadError.stack)

        // Try to provide more specific error information
        if (uploadError.message.includes("row-level security")) {
          alert(
            `Storage permission error: ${uploadError.message}\n\nThis suggests RLS is still enabled on storage tables. Please check your Supabase dashboard settings.`,
          )
        } else {
          alert(`Error uploading image: ${uploadError.message}`)
        }
        return
      }

      console.log("=== UPLOAD SUCCESS ===")
      console.log("Upload successful:", uploadData)

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("serviceimages").getPublicUrl(fileName)

      console.log("Public URL:", publicUrl)

      // Set preview and form data
      setImagePreview(publicUrl)
      setUploadedImagePath(fileName)
      setFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }))

      console.log("Image upload completed successfully")
    } catch (error) {
      console.error("=== UNEXPECTED ERROR ===")
      console.error("Error uploading image:", error)
      alert("Unexpected error uploading image. Check console for details.")
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = async () => {
    if (uploadedImagePath) {
      try {
        console.log("Removing image:", uploadedImagePath)
        const { error } = await supabase.storage.from("serviceimages").remove([uploadedImagePath])

        if (error) {
          console.error("Error removing image from storage:", error)
        } else {
          console.log("Image removed from storage successfully")
        }
      } catch (error) {
        console.error("Error removing image from storage:", error)
      }
    }

    setImagePreview(null)
    setUploadedImagePath(null)
    setFormData((prev) => ({ ...prev, image_url: "" }))

    // Reset file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
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
      // Prepare data for insertion
      const serviceData = {
        freelancer_id: user.id,
        service_name: formData.service_name.trim(),
        price_range: formData.price_range,
        service_description: formData.service_description.trim(),
        category: formData.category,
        image_url: formData.image_url || null,
      }

      console.log("Submitting service data:", serviceData)

      const { data, error } = await supabase.from("serviceList").insert(serviceData).select()

      if (error) {
        console.error("Error creating service:", error.message, error.details, error.hint)
        alert(`Error creating service: ${error.message}. Please try again.`)
        return
      }

      console.log("Service created successfully:", data)
      router.push("/profile")
    } catch (error: any) {
      console.error("Unexpected error:", error)
      console.error("Error details:", error?.message, error?.details)
      alert(`An unexpected error occurred: ${error?.message || "Unknown error"}. Please try again.`)
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
              <div className="flex justify-between items-center">
                <Label htmlFor="service_name">Service Name *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhanceWithAI}
                  disabled={enhancing}
                  className="text-xs"
                >
                  {enhancing ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                      Enhancing...
                    </>
                  ) : (
                    <>✨ Enhance with AI</>
                  )}
                </Button>
              </div>
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
              <div className="flex justify-between items-center">
                <Label>Categories/Tags *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={suggestCategoriesWithAI}
                  disabled={categorizingAI}
                  className="text-xs"
                >
                  {categorizingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>🤖 AI Suggest Categories</>
                  )}
                </Button>
              </div>

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
                    onClick={removeImage}
                    disabled={uploadingImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                        <span>
                          {uploadingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </>
                          )}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload an image to showcase your service (JPG, PNG, GIF, WebP - Max 5MB)
                    </p>
                    <p className="text-xs text-muted-foreground">Images will be stored securely in the cloud</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={submitting || uploadingImage} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Service...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                disabled={submitting || uploadingImage}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}