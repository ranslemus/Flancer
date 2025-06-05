"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, X, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditProfileProps {
  userId: string
}

export function EditProfile({ userId }: EditProfileProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [storageWorking, setStorageWorking] = useState<boolean | null>(null)

  // Fetch user session and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch client data
        const { data: clientData, error: clientError } = await supabase
          .from("client")
          .select("*")
          .eq("user_id", userId)
          .single()

        if (clientError) {
          console.error("Error fetching client data:", clientError)
          return
        }

        setFullName(clientData.full_name || "")
        setEmail(clientData.email || "")
        setProfilePictureUrl(clientData.profile_picture_url || null)

        // Fetch freelancer data if the user is a freelancer
        if (clientData.role === "freelancer") {
          const { data: freelancerData, error: freelancerError } = await supabase
            .from("freelancer")
            .select("*")
            .eq("user_id", userId)
            .single()

          if (!freelancerError && freelancerData) {
            setBio(freelancerData.bio || "")
            setSkills(freelancerData.skills || [])
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId, supabase])

  // Simplified storage check - just test if we can upload
  const checkStorageWorking = async () => {
    try {
      // Check authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return {
          success: false,
          error: "Authentication failed",
          message: "User is not authenticated",
        }
      }

      // Try to create a tiny test file to verify upload permissions
      const testFile = new File(["test"], "test.txt", { type: "text/plain" })
      const testPath = `test-${Date.now()}.txt`

      const { data, error } = await supabase.storage.from("profilepictures").upload(testPath, testFile)

      if (error) {
        return {
          success: false,
          error: error,
          message: `Cannot upload to profilepictures bucket: ${error.message}`,
        }
      }

      // Clean up the test file
      await supabase.storage.from("profilepictures").remove([testPath])

      return {
        success: true,
        message: "ProfilePictures storage is working correctly",
        user: user.id,
      }
    } catch (error) {
      return { success: false, error, message: "Error testing storage functionality" }
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setProfilePictureFile(file)
      setStorageError(null)

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file)
      setProfilePictureUrl(objectUrl)
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfilePictureFile(null)
    setProfilePictureUrl(null)
    setStorageError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePictureFile) {
      return profilePictureUrl // Return existing URL if no new file
    }

    setIsUploading(true)
    setUploadProgress(0)
    setDebugInfo(null)
    setStorageError(null)

    try {
      // Generate a unique file name
      const fileExt = profilePictureFile.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      console.log("Attempting to upload file:", {
        bucket: "profilepictures",
        fileName: fileName,
        fileSize: profilePictureFile.size,
        fileType: profilePictureFile.type,
        userId: userId,
      })

      setUploadProgress(25)

      // Upload the file to the profilepictures bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profilepictures")
        .upload(fileName, profilePictureFile, {
          cacheControl: "3600",
          upsert: true,
        })

      setUploadProgress(75)

      // Store detailed error information for debugging
      setDebugInfo((prev) => ({
        ...prev,
        uploadAttempt: {
          fileName,
          fileSize: profilePictureFile.size,
          fileType: profilePictureFile.type,
          error: uploadError,
          data: uploadData,
        },
      }))

      if (uploadError) {
        console.error("Upload error details:", uploadError)

        let errorMessage = "Unknown upload error"
        if (uploadError.message) {
          errorMessage = uploadError.message
        } else if (uploadError.error) {
          errorMessage = uploadError.error
        }

        // Handle specific RLS errors
        if (errorMessage.includes("row-level security") || errorMessage.includes("policy")) {
          setStorageError(
            "Storage permissions not configured correctly. Please run the SQL script to fix RLS policies for the profilepictures bucket.",
          )
          errorMessage = "Storage permissions error. Please contact support or run the database setup script."
        }

        throw new Error(errorMessage)
      }

      setUploadProgress(90)

      // Get the public URL
      const { data: urlData } = supabase.storage.from("profilepictures").getPublicUrl(fileName)

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to get public URL after upload")
      }

      console.log("Upload successful. Public URL:", urlData.publicUrl)
      setUploadProgress(100)
      setStorageWorking(true)
      return urlData.publicUrl
    } catch (error) {
      console.error("Error uploading profile picture:", error)

      let errorMessage = "There was an error uploading your profile picture"
      if (error instanceof Error) {
        errorMessage = error.message
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }

      setStorageError(errorMessage)
      setStorageWorking(false)
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Test storage functionality
  const testStorageSetup = async () => {
    setIsUploading(true)
    setDebugInfo(null)
    setStorageError(null)

    try {
      const setupCheck = await checkStorageWorking()
      setDebugInfo({ storageTest: setupCheck })

      if (setupCheck.success) {
        setStorageWorking(true)
        toast({
          title: "Storage test successful",
          description: "ProfilePictures storage is working correctly",
        })
      } else {
        setStorageWorking(false)
        setStorageError(setupCheck.message)
        toast({
          title: "Storage test failed",
          description: setupCheck.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Storage test error:", error)
      setDebugInfo((prev) => ({ ...prev, storageTestError: error }))
      setStorageError("Failed to test storage setup")
      setStorageWorking(false)
    } finally {
      setIsUploading(false)
    }
  }

  // Test direct upload to profilepictures bucket
  const testDirectUpload = async () => {
    if (!profilePictureFile) return

    setIsUploading(true)
    setDebugInfo(null)

    try {
      // Simple test upload with minimal options
      const testPath = `test-upload-${Date.now()}.jpg`

      const { data, error } = await supabase.storage.from("profilepictures").upload(testPath, profilePictureFile)

      setDebugInfo({ testUpload: { path: testPath, result: data, error } })

      if (error) {
        setStorageWorking(false)
        toast({
          title: "Test upload failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setStorageWorking(true)
        toast({
          title: "Test upload successful",
          description: "The file was uploaded successfully to profilepictures bucket",
        })
      }
    } catch (error) {
      console.error("Test upload error:", error)
      setDebugInfo((prev) => ({ ...prev, testUploadError: error }))
      setStorageWorking(false)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Upload profile picture if there's a new one
      let pictureUrl = profilePictureUrl
      if (profilePictureFile) {
        pictureUrl = await uploadProfilePicture()
        if (!pictureUrl) {
          // Upload failed, don't continue with form submission
          return
        }
      }

      // Update client data
      const { error: clientError } = await supabase
        .from("client")
        .update({
          full_name: fullName,
          profile_picture_url: pictureUrl,
        })
        .eq("user_id", userId)

      if (clientError) {
        throw clientError
      }

      // Check if user is a freelancer and update freelancer data
      const { data: clientData } = await supabase.from("client").select("role").eq("user_id", userId).single()

      if (clientData?.role === "freelancer") {
        const { error: freelancerError } = await supabase
          .from("freelancer")
          .update({
            bio,
            skills,
          })
          .eq("user_id", userId)

        if (freelancerError) {
          throw freelancerError
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      router.push("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
      
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a profile picture to personalize your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePictureUrl || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback>
                    {fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {profilePictureUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveProfilePicture}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture" className="text-center">
                  {profilePictureUrl ? "Change picture" : "Upload picture"}
                </Label>
                <Input
                  id="picture"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Freelancer Profile</CardTitle>
            <CardDescription>Update your freelancer profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients about yourself, your experience, and your expertise"
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
