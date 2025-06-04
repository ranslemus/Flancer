"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Video,
  Music,
  Archive,
  Info,
  RefreshCw,
  Database,
  Cloud,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { storageManager } from "@/lib/supabase/storage-utils"

interface Job {
  job_id: string
  service_id: string
  client_id: string
  freelancer_id: string
  status: string
  payment: number
  deadline: string
  description: string
  service?: {
    service_name: string
  }
  client_profile?: {
    full_name: string
  }
}

interface FileUpload {
  id: string
  file: File
  description: string
  uploading: boolean
  uploaded: boolean
  error?: string
  url?: string
  debugInfo?: any
  uploadMethod?: string
}

export default function UploadWorkPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storageInfo, setStorageInfo] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Upload states
  const [files, setFiles] = useState<FileUpload[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        console.log("Fetching job data for ID:", jobId)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          console.error("User error:", userError)
          router.push("/auth/login")
          return
        }

        console.log("Current user:", user.id)
        setCurrentUser(user)

        // Test storage setup
        await testStorageSetup()

        // Fetch job data
        const { data: jobData, error: jobError } = await supabase
          .from("job")
          .select(`
            job_id,
            service_id,
            client_id,
            freelancer_id,
            status,
            payment,
            deadline,
            description
          `)
          .eq("job_id", jobId)
          .single()

        console.log("Job query result:", { jobData, jobError })

        if (jobError || !jobData) {
          console.error("Job fetch error:", jobError)
          setError("Job not found")
          return
        }

        // Check if user is the freelancer for this job
        if (jobData.freelancer_id !== user.id) {
          console.error("Permission denied. User is not freelancer for this job")
          setError("You don't have permission to upload work for this job")
          return
        }

        // Check if job is in correct status for uploads
        if (!["in_progress", "submitted"].includes(jobData.status)) {
          setError(`Cannot upload work. Job status is: ${jobData.status}`)
          return
        }

        // Fetch service information
        const { data: serviceData } = await supabase
          .from("serviceList")
          .select("service_name")
          .eq("service_id", jobData.service_id)
          .single()

        // Fetch client profile
        const { data: clientData } = await supabase
          .from("client")
          .select("full_name")
          .eq("user_id", jobData.client_id)
          .single()

        setJob({
          ...jobData,
          service: serviceData,
          client_profile: clientData,
        })
      } catch (error) {
        console.error("Error fetching job:", error)
        setError("Failed to load job data")
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJobData()
    }
  }, [jobId, router, supabase])

  const testStorageSetup = async () => {
    try {
      console.log("Testing storage setup...")
      setStorageInfo("🔄 Testing storage setup...")

      const result = await storageManager.testUpload()

      if (result.success) {
        setStorageInfo(`✅ ${result.message}`)
      } else {
        setStorageInfo(`⚠️ ${result.message}`)
        setDebugInfo(result.debugInfo)
      }
    } catch (error) {
      console.error("Storage test error:", error)
      setStorageInfo("❌ Storage test failed")
      setDebugInfo({ exception: error })
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5" />
    if (fileType.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (fileType.includes("zip") || fileType.includes("rar")) return <Archive className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    // Validate file size (max 50MB per file)
    const maxSize = 50 * 1024 * 1024 // 50MB
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        return false
      }
      return true
    })

    const newFiles: FileUpload[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      description: "",
      uploading: false,
      uploaded: false,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Reset input
    event.target.value = ""
  }

  const updateFileDescription = (fileId: string, description: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, description } : f)))
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const uploadFile = async (fileUpload: FileUpload): Promise<string | null> => {
    try {
      console.log(`Starting upload for file: ${fileUpload.file.name}`)

      // Try storage upload first
      let result = await storageManager.uploadFile(fileUpload.file, jobId)

      // If storage fails, try database storage
      if (!result.success) {
        console.log("Storage upload failed, trying database storage...")
        result = await storageManager.uploadFileToDatabase(fileUpload.file, jobId, fileUpload.description)
      }

      if (result.success && result.url) {
        console.log(`Upload successful: ${result.bucket}`)

        // Update file with upload method info
        setFiles((prev) => prev.map((f) => (f.id === fileUpload.id ? { ...f, uploadMethod: result.bucket } : f)))

        return result.url
      } else {
        console.error(`Upload failed: ${result.error}`)
        // Store debug info for this file
        setFiles((prev) => prev.map((f) => (f.id === fileUpload.id ? { ...f, debugInfo: result.debugInfo } : f)))
        return null
      }
    } catch (error) {
      console.error("Upload exception:", error)
      return null
    }
  }

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      alert("Please select at least one file to upload")
      return
    }

    console.log(`Starting upload process for ${files.length} files`)
    setUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = files.length
      let completedFiles = 0

      // Upload files one by one
      for (const fileUpload of files) {
        console.log(`Processing file ${completedFiles + 1}/${totalFiles}: ${fileUpload.file.name}`)

        setFiles((prev) => prev.map((f) => (f.id === fileUpload.id ? { ...f, uploading: true } : f)))

        const url = await uploadFile(fileUpload)

        if (url) {
          console.log(`Upload successful for ${fileUpload.file.name}`)

          // Database storage already saves the record, so we only need to update for storage uploads
          if (fileUpload.uploadMethod !== "database") {
            // Save metadata to database for storage uploads
            const { error: dbError } = await supabase.from("job_deliverables").insert({
              job_id: jobId,
              file_name: fileUpload.file.name,
              file_url: url,
              file_type: fileUpload.file.type.startsWith("image/") ? "image" : "file",
              file_size: fileUpload.file.size,
              description: fileUpload.description || null,
            })

            if (dbError) {
              console.error("Database error:", dbError)
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileUpload.id ? { ...f, uploading: false, error: "Failed to save file info" } : f,
                ),
              )
              completedFiles++
              setUploadProgress((completedFiles / totalFiles) * 100)
              continue
            }
          }

          console.log(`Database save successful for ${fileUpload.file.name}`)
          setFiles((prev) =>
            prev.map((f) => (f.id === fileUpload.id ? { ...f, uploading: false, uploaded: true, url } : f)),
          )
        } else {
          console.error(`Upload failed for ${fileUpload.file.name}`)
          setFiles((prev) =>
            prev.map((f) => (f.id === fileUpload.id ? { ...f, uploading: false, error: "Upload failed" } : f)),
          )
        }

        completedFiles++
        setUploadProgress((completedFiles / totalFiles) * 100)
      }

      // Check if all files uploaded successfully
      const uploadedFiles = files.filter((f) => f.uploaded)
      const failedFiles = files.filter((f) => f.error)

      console.log(`Upload complete. Success: ${uploadedFiles.length}, Failed: ${failedFiles.length}`)

      if (uploadedFiles.length > 0 && failedFiles.length === 0) {
        setSubmitDialogOpen(true)
      } else if (failedFiles.length > 0) {
        alert(`${failedFiles.length} files failed to upload. Please try again.`)
      }
    } catch (error) {
      console.error("Upload process error:", error)
      alert("An error occurred during upload. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitWork = async () => {
    if (!job) return

    setSubmitting(true)
    try {
      console.log("Submitting work for job:", jobId)

      // Update job status to submitted
      const { error: jobError } = await supabase.from("job").update({ status: "submitted" }).eq("job_id", jobId)

      if (jobError) {
        console.error("Error updating job status:", jobError)
        alert("Failed to submit work. Please try again.")
        return
      }

      // Send notification to client
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: job.client_id,
        type: "work_submitted",
        title: `Work submitted: "${job.service?.service_name || "Unknown Service"}"`,
        message: "The freelancer has submitted their work for review.",
        metadata: {
          job_id: jobId,
          service_name: job.service?.service_name,
          freelancer_id: job.freelancer_id,
          payment: job.payment,
        },
        is_read: false,
      })

      if (notificationError) {
        console.error("Notification error:", notificationError)
        // Don't fail the submission for notification errors
      }

      console.log("Work submitted successfully")
      setSubmitDialogOpen(false)
      router.push(`/jobs/${jobId}`)
    } catch (error) {
      console.error("Error submitting work:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getUploadMethodIcon = (method?: string) => {
    switch (method) {
      case "database":
        return <Database className="h-3 w-3 mr-1" />
      default:
        return <Cloud className="h-3 w-3 mr-1" />
    }
  }

  const isOverdue = job ? new Date(job.deadline) < new Date() : false
  const timeRemaining = job
    ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Upload Not Available</h1>
          <p className="text-muted-foreground mb-6">{error || "Unable to load job data."}</p>
          <Button asChild>
            <Link href="/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/jobs/${jobId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Upload Work</h1>
          <p className="text-muted-foreground">
            Submit your completed work for "{job.service?.service_name || "Unknown Service"}"
          </p>
        </div>
      </div>

      {/* Storage Info */}
      {storageInfo && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{storageInfo}</span>
            <Button variant="ghost" size="sm" onClick={testStorageSetup}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Debug Information (Click to expand)</summary>
              <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {/* Job Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{job.service?.service_name || "Unknown Service"}</CardTitle>
              <CardDescription>
                Client: {job.client_profile?.full_name || "Unknown"} • Payment: ${job.payment}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${isOverdue ? "text-red-600" : ""}`}>
                {isOverdue ? "Overdue" : `${timeRemaining} days remaining`}
              </div>
              <div className="text-sm text-muted-foreground">Due: {new Date(job.deadline).toLocaleDateString()}</div>
            </div>
          </div>
        </CardHeader>
        {job.description && (
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Job Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Deadline Warning */}
      {isOverdue && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            This job is overdue. Please submit your work as soon as possible.
          </AlertDescription>
        </Alert>
      )}

      {/* File Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload your completed work files. Supported formats: Images, Documents, Videos, Audio, Archives (Max 50MB
            per file)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Input */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Choose files to upload</p>
                <p className="text-xs text-muted-foreground">Drag and drop files here, or click to browse</p>
              </div>
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="mt-4 cursor-pointer"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Selected Files ({files.length})</h4>
              <div className="space-y-3">
                {files.map((fileUpload) => (
                  <div key={fileUpload.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0 p-2 bg-muted rounded">{getFileIcon(fileUpload.file.type)}</div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium truncate">{fileUpload.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(fileUpload.file.size)}
                            {fileUpload.uploadMethod && (
                              <span className="ml-2 inline-flex items-center">
                                {getUploadMethodIcon(fileUpload.uploadMethod)}
                                {fileUpload.uploadMethod}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {fileUpload.uploading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                          {fileUpload.uploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {fileUpload.error && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {!fileUpload.uploading && !fileUpload.uploaded && (
                            <Button variant="ghost" size="sm" onClick={() => removeFile(fileUpload.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`desc-${fileUpload.id}`} className="text-sm">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id={`desc-${fileUpload.id}`}
                          placeholder="Describe this file..."
                          value={fileUpload.description}
                          onChange={(e) => updateFileDescription(fileUpload.id, e.target.value)}
                          rows={2}
                          disabled={fileUpload.uploading || fileUpload.uploaded}
                        />
                      </div>
                      {fileUpload.error && (
                        <div className="space-y-1">
                          <p className="text-sm text-red-600">{fileUpload.error}</p>
                          {fileUpload.debugInfo && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground">Debug info</summary>
                              <pre className="mt-1 text-xs overflow-auto bg-muted p-2 rounded">
                                {JSON.stringify(fileUpload.debugInfo, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end space-x-3">
            <Button onClick={handleUploadFiles} disabled={files.length === 0 || uploading} className="min-w-[120px]">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Work Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Work for Review</DialogTitle>
            <DialogDescription>
              Are you ready to submit your work to the client? Once submitted, the client will review your work and
              either approve it or request changes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All files have been uploaded successfully. You can now submit your work for client review.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitWork} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Work"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
