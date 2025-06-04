import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// This script tests direct job creation to isolate any issues
async function testJobCreation() {
  const supabase = createClientComponentClient()

  try {
    // 1. First, get a valid service_id
    const { data: services, error: serviceError } = await supabase.from("serviceList").select("service_id").limit(1)

    if (serviceError || !services || services.length === 0) {
      console.error("Failed to get a valid service_id:", serviceError)
      return
    }

    const serviceId = services[0].service_id

    // 2. Get a valid client_id
    const { data: clients, error: clientError } = await supabase.from("client").select("user_id").limit(1)

    if (clientError || !clients || clients.length === 0) {
      console.error("Failed to get a valid client_id:", clientError)
      return
    }

    const clientId = clients[0].user_id

    // 3. Get a valid freelancer_id
    const { data: freelancers, error: freelancerError } = await supabase.from("freelancer").select("user_id").limit(1)

    if (freelancerError || !freelancers || freelancers.length === 0) {
      console.error("Failed to get a valid freelancer_id:", freelancerError)
      return
    }

    const freelancerId = freelancers[0].user_id

    // 4. Create a test job
    const jobData = {
      service_id: serviceId,
      client_id: clientId,
      freelancer_id: freelancerId,
      status: "test",
      payment: 100,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Test job created via script",
    }

    console.log("Attempting to create job with data:", jobData)

    const { data: job, error: jobError } = await supabase.from("job").insert(jobData).select()

    if (jobError) {
      console.error("Failed to create test job:", jobError)
      return
    }

    console.log("Test job created successfully:", job)

    // 5. Clean up - delete the test job
    if (job && job[0] && job[0].job_id) {
      const { error: deleteError } = await supabase.from("job").delete().eq("job_id", job[0].job_id)

      if (deleteError) {
        console.error("Failed to delete test job:", deleteError)
      } else {
        console.log("Test job deleted successfully")
      }
    }
  } catch (error) {
    console.error("Error in test job creation:", error)
  }
}

// Run the test
testJobCreation()
