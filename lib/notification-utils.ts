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
 * Create a job from a negotiation with validation
 */
export async function createJobFromNegotiation(
  negotiationId: string,
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  const supabase = createClientComponentClient()

  try {
    // Get negotiation data
    const { data: negotiation, error: negotiationError } = await supabase
      .from("price_negotiations")
      .select("*")
      .eq("negotiation_id", negotiationId)
      .single()

    if (negotiationError || !negotiation) {
      return { success: false, error: `Negotiation not found: ${negotiationError?.message}` }
    }

    // Validate users
    const validation = await validateNegotiationUsers(negotiation.client_id, negotiation.freelancer_id)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Create job
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .insert({
        service_id: negotiation.service_id,
        client_id: negotiation.client_id,
        freelancer_id: negotiation.freelancer_id,
        status: "in_progress",
        payment: negotiation.final_agreed_price || negotiation.current_price,
        deadline: negotiation.deadline,
        description: negotiation.job_description,
      })
      .select()
      .single()

    if (jobError) {
      return { success: false, error: `Failed to create job: ${jobError.message}` }
    }

    return { success: true, jobId: jobData.job_id }
  } catch (error) {
    console.error("Error creating job:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
