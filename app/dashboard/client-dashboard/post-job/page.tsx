"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, DollarSign, Tag, FileText, ImageIcon, Briefcase } from "lucide-react"

export default function FreelancerServiceListing() {
  const [formData, setFormData] = useState({
    service_name: "",
    price_range: { min: "", max: "" },
    service_description: "",
    category: "",
    service_pictures: [] as File[],
  })

  const [previewImages, setPreviewImages] = useState<string[]>([])

  const categories = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "SEO Services",
    "Video Editing",
    "Photography",
    "Translation",
    "Data Entry",
    "Virtual Assistant",
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.service_pictures.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    const newImages = [...formData.service_pictures, ...files]
    setFormData((prev) => ({ ...prev, service_pictures: newImages }))

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = formData.service_pictures.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index])

    setFormData((prev) => ({ ...prev, service_pictures: newImages }))
    setPreviewImages(newPreviews)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const serviceData = {
      ...formData,
      price_range: `$${formData.price_range.min} - $${formData.price_range.max}`,
    }

    console.log("Service listing created:", serviceData)
    alert("Service listing created successfully!")
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Service Listing</h1>
          <p className="text-lg text-muted-foreground">Showcase your skills and attract potential clients</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-primary rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2 text-primary-foreground">
              <Briefcase className="h-6 w-6" />
              Service Details
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Fill in the details about your service to create an attractive listing
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="service_name" className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Service Name
                </Label>
                <Input
                  id="service_name"
                  placeholder="e.g., Professional Website Development"
                  value={formData.service_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, service_name: e.target.value }))}
                  className="text-lg p-3"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Category
                </Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger className="text-lg p-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Price Range
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_price" className="text-sm text-muted-foreground">
                      Minimum Price
                    </Label>
                    <Input
                      id="min_price"
                      type="number"
                      placeholder="50"
                      value={formData.price_range.min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_range: { ...prev.price_range, min: e.target.value },
                        }))
                      }
                      className="p-3"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_price" className="text-sm text-muted-foreground">
                      Maximum Price
                    </Label>
                    <Input
                      id="max_price"
                      type="number"
                      placeholder="500"
                      value={formData.price_range.max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_range: { ...prev.price_range, max: e.target.value },
                        }))
                      }
                      className="p-3"
                      required
                    />
                  </div>
                </div>
                {formData.price_range.min && formData.price_range.max && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    ${formData.price_range.min} - ${formData.price_range.max}
                  </Badge>
                )}
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <Label htmlFor="service_description" className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Service Description
                </Label>
                <Textarea
                  id="service_description"
                  placeholder="Describe your service in detail. What do you offer? What makes you unique? What can clients expect?"
                  value={formData.service_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, service_description: e.target.value }))}
                  className="min-h-32 text-base p-3"
                  required
                />
                <p className="text-sm text-muted-foreground">{formData.service_description.length}/1000 characters</p>
              </div>

              {/* Service Pictures */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Service Pictures
                </Label>
                <p className="text-sm text-muted-foreground">
                  Upload up to 5 images showcasing your work (JPG, PNG, WebP)
                </p>

                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Click to upload images</p>
                    <p className="text-sm text-muted-foreground">or drag and drop</p>
                  </label>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 h-auto"
                >
                  Create Service Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {formData.service_name && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Preview</CardTitle>
              <CardDescription>This is how your listing will appear to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold">{formData.service_name}</h3>
                  {formData.category && <Badge variant="outline">{formData.category}</Badge>}
                </div>

                {formData.price_range.min && formData.price_range.max && (
                  <div className="text-xl font-semibold text-primary">
                    ${formData.price_range.min} - ${formData.price_range.max}
                  </div>
                )}

                {formData.service_description && (
                  <p className="text-foreground leading-relaxed">{formData.service_description}</p>
                )}

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {previewImages.slice(0, 4).map((preview, index) => (
                      <img
                        key={index}
                        src={preview || "/placeholder.svg"}
                        alt={`Service ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
