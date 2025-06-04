import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
    // Instead of querying auth.users directly, check if user exists in our client table
    // which should have all registered users
    const { data, error } = await supabase.from("client").select("user_id").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("User validation error:", error)
      return false
    }

    return !!data
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
    console.log("🚀 Starting job creation for negotiation:", negotiationId)

    // Get negotiation data with detailed logging
    const { data: negotiation, error: negotiationError } = await supabase
      .from("price_negotiations")
      .select("*")
      .eq("negotiation_id", negotiationId)
      .single()

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

    // Validate service exists
    console.log("🔍 Validating service...")
    const { data: serviceData, error: serviceError } = await supabase
      .from("serviceList")
      .select("service_id, service_name")
      .eq("service_id", negotiation.service_id)
      .single()

    if (serviceError) {
      console.error("❌ Service validation error:", serviceError)
      return { success: false, error: `Service validation failed: ${serviceError.message}` }
    }

    if (!serviceData) {
      console.error("❌ Service not found")
      return { success: false, error: "Service no longer exists" }
    }
    console.log("✅ Service validated:", serviceData.service_name)

    // Determine final price
    const finalPrice = negotiation.final_agreed_price || negotiation.current_price
    if (!finalPrice || finalPrice <= 0) {
      console.error("❌ Invalid price:", finalPrice)
      return { success: false, error: `Invalid agreed price: ${finalPrice}` }
    }
    console.log("💰 Final price:", finalPrice)

    // Validate deadline
    if (!negotiation.deadline) {
      console.error("❌ Missing deadline")
      return { success: false, error: "Missing deadline" }
    }

    // Ensure deadline is in the future
    const deadlineDate = new Date(negotiation.deadline)
    const now = new Date()
    if (deadlineDate <= now) {
      console.error("❌ Invalid deadline:", negotiation.deadline)
      return { success: false, error: "Deadline must be in the future" }
    }
    console.log("📅 Deadline validated:", negotiation.deadline)

    // Generate job ID
    const jobId = generateUUID()
    console.log("🆔 Generated job ID:", jobId)

    // Prepare job data
    const jobData = {
      job_id: jobId,
      service_id: negotiation.service_id,
      client_id: negotiation.client_id,
      freelancer_id: negotiation.freelancer_id,
      status: "in_progress" as const,
      payment: finalPrice,
      deadline: negotiation.deadline,
      description: negotiation.job_description || "Job created from price negotiation",
    }

    console.log("📝 Job data to insert:", jobData)

    // Create job
    const { data: createdJob, error: jobError } = await supabase.from("jobs").insert(jobData).select().single()

    if (jobError) {
      console.error("❌ Job creation error:", jobError)
      console.error("Error details:", {
        code: jobError.code,
        message: jobError.message,
        details: jobError.details,
        hint: jobError.hint,
      })
      return { success: false, error: `Failed to create job: ${jobError.message} (Code: ${jobError.code})` }
    }

    if (!createdJob) {
      console.error("❌ No job data returned after creation")
      return { success: false, error: "Job creation returned no data" }
    }

    console.log("✅ Job created successfully:", createdJob.job_id)

    // Update negotiation status to accepted
    const { error: updateError } = await supabase
      .from("price_negotiations")
      .update({ status: "accepted" })
      .eq("negotiation_id", negotiationId)

    if (updateError) {
      console.warn("⚠️ Failed to update negotiation status:", updateError)
      // Don't fail the whole process for this
    } else {
      console.log("✅ Negotiation status updated to accepted")
    }

    return { success: true, jobId: createdJob.job_id }
  } catch (error) {
    console.error("💥 Unexpected error in createJobFromNegotiation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: `Unexpected error: ${errorMessage}` }
  }
}
