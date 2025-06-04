import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { logDatabaseOperation, validateRequiredFields } from "./debug-utils"

// Type definitions
export interface NotificationMetadata {
  [key: string]: any
  service_id?: string
  service_name?: string
  service_price_range?: [number, number]
  negotiation_id?: string
  job_id?: string
  client_id?: string
  freelancer_id?: string
  proposed_price?: number
  final_price?: number
  deadline?: string
  job_description?: string
  offer_count?: number
  last_offer_by?: "client" | "freelancer"
  agreed_by?: "client" | "freelancer"
  waiting_for?: "client" | "freelancer"
}

export interface NotificationData {
  user_id: string
  type: string
  title: string
  message: string
  metadata: NotificationMetadata
  is_read?: boolean
  status?: string
}

/**
 * Generate a UUID using the built-in crypto API
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Safely send a notification with validation
 */
export async function sendNotification(data: NotificationData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientComponentClient()

  try {
    // Validate user exists by checking our client table instead of auth.users
    const userExists = await validateUser(data.user_id)
    if (!userExists) {
      console.error("User validation failed for:", data.user_id)
      return { success: false, error: `User with ID ${data.user_id} does not exist` }
    }

    // Validate required metadata fields
    if (data.type === "price_proposal" || data.type === "counter_offer") {
      if (!data.metadata.service_id || !data.metadata.service_name) {
        return { success: false, error: "Missing required metadata: service_id or service_name" }
      }
    }

    // Send notification
    const { data: notificationData, error } = await supabase.from("notifications").insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata || {},
      is_read: data.is_read || false,
      status: data.status,
    })

    if (error) {
      console.error("Notification error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending notification:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Validate that a user exists in the database using Supabase Auth
 */
export async function validateUser(userId: string): Promise<boolean> {
  if (!userId) return false

  const supabase = createClientComponentClient()

  try {
    // First try to find in client table
    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .select("user_id")
      .eq("user_id", userId)
      .single()

    if (clientData) {
      return true
    }

    // If not found in client, try freelancer table
    const { data: freelancerData, error: freelancerError } = await supabase
      .from("freelancer")
      .select("user_id")
      .eq("user_id", userId)
      .single()

    return !!freelancerData
  } catch (error) {
    console.error("Error validating user:", error)
    return false
  }
}

/**
 * Validate that both users in a negotiation exist
 */
export async function validateNegotiationUsers(
  clientId: string,
  freelancerId: string,
): Promise<{ valid: boolean; error?: string }> {
  if (!clientId || !freelancerId) {
    return { valid: false, error: "Missing client or freelancer ID" }
  }

  const clientValid = await validateUser(clientId)
  if (!clientValid) {
    return { valid: false, error: `Client with ID ${clientId} does not exist` }
  }

  const freelancerValid = await validateUser(freelancerId)
  if (!freelancerValid) {
    return { valid: false, error: `Freelancer with ID ${freelancerId} does not exist` }
  }

  return { valid: true }
}

/**
 * Debug function to log detailed information about job creation
 */
async function debugJobCreation(negotiation: any): Promise<void> {
  console.log("🔍 Debug: Job creation data:")
  console.log("- Negotiation ID:", negotiation.negotiation_id)
  console.log("- Service ID:", negotiation.service_id)
  console.log("- Client ID:", negotiation.client_id)
  console.log("- Freelancer ID:", negotiation.freelancer_id)
  console.log("- Final Price:", negotiation.final_agreed_price)
  console.log("- Current Price:", negotiation.current_price)
  console.log("- Deadline:", negotiation.deadline)
  console.log("- Job Description:", negotiation.job_description)
  console.log("- Status:", negotiation.status)
}

/**
 * Create a job from a negotiation with enhanced validation and error handling
 */
export async function createJobFromNegotiation(
  negotiationId: string,
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  const supabase = createClientComponentClient()

  try {
    console.log("Starting job creation from negotiation:", negotiationId)

    // Get negotiation data
    const { data: negotiation, error: negotiationError } = await supabase
      .from("price_negotiations")
      .select("*")
      .eq("negotiation_id", negotiationId)
      .single()

    logDatabaseOperation("Fetch negotiation", negotiation, negotiationError)

    if (negotiationError || !negotiation) {
      return { success: false, error: `Negotiation not found: ${negotiationError?.message || "Unknown error"}` }
    }
    if (negotiationError) {
      console.error("❌ Negotiation fetch error:", negotiationError)
      return { success: false, error: `Negotiation fetch failed: ${negotiationError.message}` }
    }

    if (!negotiation) {
      console.error("❌ No negotiation data found")
      return { success: false, error: "Negotiation not found" }
    }

    // Debug log the negotiation data
    await debugJobCreation(negotiation)

    // Validate required fields
    if (!negotiation.service_id) {
      return { success: false, error: "Missing service_id in negotiation" }
    }

    if (!negotiation.client_id) {
      return { success: false, error: "Missing client_id in negotiation" }
    }

    if (!negotiation.freelancer_id) {
      return { success: false, error: "Missing freelancer_id in negotiation" }
    }

    // Validate users exist
    console.log("👥 Validating users...")
    const validation = await validateNegotiationUsers(negotiation.client_id, negotiation.freelancer_id)
    if (!validation.valid) {
      console.error("❌ User validation failed:", validation.error)
      return { success: false, error: validation.error }
    }
    console.log("✅ Users validated successfully")

    // Validate required fields
    const requiredFields = ["service_id", "client_id", "freelancer_id"]
    const missingFields = validateRequiredFields(negotiation, requiredFields)

    if (missingFields.length > 0) {
      return { success: false, error: `Missing required fields in negotiation: ${missingFields.join(", ")}` }
    }

    const finalPrice = negotiation.final_agreed_price || negotiation.current_price
    if (!finalPrice || finalPrice <= 0) {
      return { success: false, error: "Invalid or missing price in negotiation" }
    }

    // Create job with proper column mapping
    const jobData = {
      service_id: negotiation.service_id,
      client_id: negotiation.client_id,
      freelancer_id: negotiation.freelancer_id,
      status: "in_progress",
      payment: finalPrice,
      deadline: negotiation.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
      description: negotiation.job_description || "Job created from negotiation",
    }

    console.log("Creating job with data:", jobData)

    // Insert job record
    const { data: createdJob, error: jobError } = await supabase.from("job").insert(jobData).select("job_id").single()

    logDatabaseOperation("Create job", createdJob, jobError)

    if (jobError) {
      // Try to get more detailed error information
      console.error("Job creation failed with error:", jobError)

      // Check if it's a foreign key constraint issue
      if (jobError.message?.includes("foreign key constraint")) {
        // Try to identify which foreign key is failing
        if (jobError.message.includes("service_id")) {
          return { success: false, error: `Invalid service_id: ${negotiation.service_id}` }
        }
        if (jobError.message.includes("client_id")) {
          return { success: false, error: `Invalid client_id: ${negotiation.client_id}` }
        }
        if (jobError.message.includes("freelancer_id")) {
          return { success: false, error: `Invalid freelancer_id: ${negotiation.freelancer_id}` }
        }
      }

      return { success: false, error: `Failed to create job: ${jobError.message}` }
    }

    if (!createdJob?.job_id) {
      return { success: false, error: "Job created but no job_id returned" }
    }

    // Update negotiation with job_id
    const { error: updateError } = await supabase
      .from("price_negotiations")
      .update({
        status: "completed",
        job_id: createdJob.job_id,
      })
      .eq("negotiation_id", negotiationId)

    logDatabaseOperation(
      "Update negotiation with job_id",
      { negotiation_id: negotiationId, job_id: createdJob.job_id },
      updateError,
    )

    console.log("Job created successfully with ID:", createdJob.job_id)
    return { success: true, jobId: createdJob.job_id }
  } catch (error) {
    console.error("💥 Unexpected error in createJobFromNegotiation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: `Unexpected error: ${errorMessage}` }
  }
}
