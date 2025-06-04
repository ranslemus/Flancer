import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  bucket?: string
  path?: string
  debugInfo?: any
}

export class StorageManager {
  private supabase = createClientComponentClient()

  async checkAvailableBuckets(): Promise<string[]> {
    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets()

      if (error) {
        console.error("Error listing buckets:", error)
        return []
      }

      const bucketNames = buckets?.map((bucket) => bucket.name) || []
      console.log("Available buckets:", bucketNames)
      return bucketNames
    } catch (error) {
      console.error("Exception checking buckets:", error)
      return []
    }
  }

  async findBestBucket(): Promise<string | null> {
    const availableBuckets = await this.checkAvailableBuckets()

    if (availableBuckets.length === 0) {
      console.error("No storage buckets available")
      return null
    }

    // Prefer job-deliverables if it exists
    if (availableBuckets.includes("job-deliverables")) {
      console.log("Using bucket: job-deliverables")
      return "job-deliverables"
    }

    // Use the first available bucket
    const bucket = availableBuckets[0]
    console.log(`Using fallback bucket: ${bucket}`)
    return bucket
  }

  sanitizeFileName(fileName: string): string {
    // Remove special characters and spaces, keep only alphanumeric, dots, and hyphens
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
  }

  generateFilePath(jobId: string, fileName: string): string {
    const timestamp = Date.now()
    const sanitizedName = this.sanitizeFileName(fileName)
    return `job-deliverables/${jobId}/${timestamp}-${sanitizedName}`
  }

  async uploadFile(file: File, jobId: string): Promise<UploadResult> {
    try {
      console.log(`Starting upload for: ${file.name} (${file.size} bytes)`)

      const bucket = await this.findBestBucket()

      if (!bucket) {
        return {
          success: false,
          error: "No storage buckets available. Will try database storage.",
          debugInfo: { availableBuckets: await this.checkAvailableBuckets() },
        }
      }

      const filePath = this.generateFilePath(jobId, file.name)

      console.log(`Upload details:`, { bucket, filePath, fileType: file.type })

      // Attempt upload
      const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error details:", {
          error: error,
          errorType: typeof error,
          errorKeys: Object.keys(error),
          message: error.message || "No message",
          statusCode: error.statusCode || "No status code",
          errorString: JSON.stringify(error),
        })

        // Check for specific error types
        if (error.message?.includes("Bucket not found")) {
          return {
            success: false,
            error: `Storage bucket "${bucket}" not found. Will try database storage.`,
            debugInfo: { bucket, filePath, error, availableBuckets: await this.checkAvailableBuckets() },
          }
        }

        if (error.message?.includes("row-level security") || error.message?.includes("RLS")) {
          return {
            success: false,
            error: "Storage permissions denied. Will try database storage.",
            debugInfo: { bucket, filePath, error },
          }
        }

        if (Object.keys(error).length === 0) {
          return {
            success: false,
            error: "Upload failed with empty error - will try database storage",
            debugInfo: { bucket, filePath, errorObject: error },
          }
        }

        return {
          success: false,
          error: `Upload failed: ${error.message || "Unknown error"}. Will try database storage.`,
          debugInfo: { bucket, filePath, error },
        }
      }

      if (!data) {
        return {
          success: false,
          error: "Upload succeeded but no data returned",
          debugInfo: { bucket, filePath },
        }
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(filePath)

      console.log(`Upload successful:`, { url: urlData.publicUrl })

      return {
        success: true,
        url: urlData.publicUrl,
        bucket,
        path: filePath,
      }
    } catch (error) {
      console.error("Upload exception:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
        debugInfo: { exception: error },
      }
    }
  }

  // Database storage method
  async uploadFileToDatabase(file: File, jobId: string, description?: string): Promise<UploadResult> {
    try {
      console.log(`Attempting database upload for: ${file.name}`)

      // Validate jobId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(jobId)) {
        return {
          success: false,
          error: `Invalid job ID format: ${jobId}`,
          debugInfo: { jobId, isValidUuid: false },
        }
      }

      // Convert file to base64
      const base64 = await this.fileToBase64(file)

      // Store in database
      const { data, error } = await this.supabase
        .from("job_deliverables")
        .insert({
          job_id: jobId,
          file_name: file.name,
          file_type: file.type.startsWith("image/") ? "image" : "file",
          file_size: file.size,
          description: description || null,
          // Store as data URL for easy retrieval
          file_url: `data:${file.type};base64,${base64}`,
        })
        .select()
        .single()

      if (error) {
        console.error("Database upload error:", error)
        return {
          success: false,
          error: `Database upload failed: ${error.message}`,
          debugInfo: { error, jobId, fileName: file.name },
        }
      }

      console.log("Database upload successful:", data)

      return {
        success: true,
        url: `data:${file.type};base64,${base64}`,
        bucket: "database",
        path: data?.id,
      }
    } catch (error) {
      console.error("Database upload exception:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Database upload failed",
        debugInfo: { exception: error },
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async testUpload(): Promise<{ success: boolean; message: string; debugInfo?: any }> {
    try {
      console.log("Starting upload test...")

      const availableBuckets = await this.checkAvailableBuckets()

      // Create a small test file
      const testContent = "Test file for upload verification"
      const testFile = new Blob([testContent], { type: "text/plain" })
      const file = new File([testFile], "test-upload.txt", { type: "text/plain" })

      // Generate a valid test UUID
      const testJobId = "00000000-0000-4000-8000-000000000000"

      // Try storage first
      const storageResult = await this.uploadFile(file, testJobId)

      if (storageResult.success) {
        // Clean up test file if it was uploaded to storage
        if (storageResult.bucket && storageResult.bucket !== "database" && storageResult.path) {
          const { error: deleteError } = await this.supabase.storage
            .from(storageResult.bucket)
            .remove([storageResult.path])
          if (deleteError) {
            console.warn("Failed to clean up test file:", deleteError)
          }
        }
        return {
          success: true,
          message: `Storage upload test successful using: ${storageResult.bucket}`,
        }
      }

      // If storage fails, try database
      console.log("Storage failed, testing database upload...")
      const dbResult = await this.uploadFileToDatabase(file, testJobId, "Test upload")

      if (dbResult.success) {
        // Clean up test database entry
        if (dbResult.path) {
          await this.supabase.from("job_deliverables").delete().eq("id", dbResult.path)
        }
        return {
          success: true,
          message: "Storage failed but database upload works",
        }
      }

      return {
        success: false,
        message: `Both storage and database uploads failed. Storage: ${storageResult.error}, Database: ${dbResult.error}`,
        debugInfo: { storageResult: storageResult.debugInfo, dbResult: dbResult.debugInfo },
      }
    } catch (error) {
      return {
        success: false,
        message: `Upload test exception: ${error instanceof Error ? error.message : "Unknown error"}`,
        debugInfo: { exception: error },
      }
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager()
