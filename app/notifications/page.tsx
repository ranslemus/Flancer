"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Bell,
  BellOff,
  MessageCircle,
  Briefcase,
  Star,
  Trash2,
  Check,
  CheckCheck,
  Loader2,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

// Import the notification utilities at the top of the file
import { sendNotification, validateUser, createJobFromNegotiation } from "@/lib/notification-utils"
import { ErrorAlert } from "@/components/error-alert"

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  metadata?: any
  is_read: boolean
  status?: string
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Negotiation states
  const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [proposedPrice, setProposedPrice] = useState<number[]>([0])
  const [jobDescription, setJobDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Counter offer states
  const [counterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false)
  const [counterPrice, setCounterPrice] = useState<number[]>([0])
  const [counterMessage, setCounterMessage] = useState("")

  const supabase = createClientComponentClient()

  // Add error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Add debug function to check database state
  const debugJobCreation = async (negotiationId: string) => {
    console.log("🔍 Debugging job creation for negotiation:", negotiationId)

    try {
      // Check negotiation data
      const { data: negotiation, error: negError } = await supabase
        .from("price_negotiations")
        .select("*")
        .eq("negotiation_id", negotiationId)
        .single()

      console.log("Negotiation data:", negotiation)
      if (negError) console.error("Negotiation error:", negError)

      // Check if service exists
      if (negotiation?.service_id) {
        const { data: service, error: serviceError } = await supabase
          .from("serviceList")
          .select("*")
          .eq("service_id", negotiation.service_id)
          .single()

        console.log("Service data:", service)
        if (serviceError) console.error("Service error:", serviceError)
      }

      // Check if users exist
      if (negotiation?.client_id) {
        const { data: client, error: clientError } = await supabase
          .from("client")
          .select("user_id, full_name")
          .eq("user_id", negotiation.client_id)
          .single()

        console.log("Client data:", client)
        if (clientError) console.error("Client error:", clientError)
      }

      if (negotiation?.freelancer_id) {
        const { data: freelancer, error: freelancerError } = await supabase
          .from("client")
          .select("user_id, full_name")
          .eq("user_id", negotiation.freelancer_id)
          .single()

        console.log("Freelancer data:", freelancer)
        if (freelancerError) console.error("Freelancer error:", freelancerError)
      }
    } catch (error) {
      console.error("Debug error:", error)
    }
  }

  // Add this helper function after the state declarations
  const getUserRoleInNotification = (notification: Notification) => {
    if (!user?.id || !notification.metadata) return null

    if (user.id === notification.metadata.client_id) return "client"
    if (user.id === notification.metadata.freelancer_id) return "freelancer"
    return null
  }

  // Add this function to get the other party's information
  const getOtherPartyInfo = (notification: Notification) => {
    const userRole = getUserRoleInNotification(notification)
    if (!userRole) return null

    if (userRole === "client") {
      return {
        id: notification.metadata.freelancer_id,
        type: "freelancer",
      }
    } else {
      return {
        id: notification.metadata.client_id,
        type: "client",
      }
    }
  }

  // Add this function near the top of the file, after the supabase client is defined
  const validateUserExists = async (userId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      // Check if user exists in our client table instead of auth.users
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

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchNotifications(user.id)
      } else {
        window.location.href = "/auth/login"
      }
    }
    getUser()
  }, [])

  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) {
        console.error("Error marking as read:", error)
        return
      }

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) {
        console.error("Error marking all as read:", error)
        return
      }

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) {
        console.error("Error deleting notification:", error)
        return
      }

      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleStartNegotiation = (notification: Notification) => {
    setSelectedNotification(notification)

    // Get price range from service metadata
    const minPrice = notification.metadata?.service_price_range?.[0] || 0
    const maxPrice = notification.metadata?.service_price_range?.[1] || 1000

    setProposedPrice([maxPrice]) // Start with max price
    setNegotiationDialogOpen(true)
  }

  // Update the handleAcceptInquiry function to include validation
  const handleAcceptInquiry = async () => {
    if (!selectedNotification || !jobDescription.trim() || !deadline) {
      alert("Please fill in all required fields")
      return
    }

    // Validate client exists
    const clientId = selectedNotification.metadata.client_id
    if (!clientId) {
      alert("Client ID is missing from the notification")
      return
    }

    const clientExists = await validateUserExists(clientId)
    if (!clientExists) {
      alert("The client no longer exists in the system")
      return
    }

    setSubmitting(true)
    try {
      // Create price negotiation
      const { data: negotiationData, error: negotiationError } = await supabase
        .from("price_negotiations")
        .insert({
          service_id: selectedNotification.metadata.service_id,
          client_id: selectedNotification.metadata.client_id,
          freelancer_id: user.id,
          initial_message: selectedNotification.message,
          current_price: proposedPrice[0],
          min_price: selectedNotification.metadata.service_price_range?.[0] || 0,
          max_price: selectedNotification.metadata.service_price_range?.[1] || 1000,
          status: "pending",
          last_offer_by: "freelancer",
          offer_count: 1,
          deadline: deadline,
          job_description: jobDescription.trim(),
        })
        .select()
        .single()

      if (negotiationError) {
        throw new Error(`Failed to create negotiation: ${negotiationError.message}`)
      }

      // Create initial offer
      await supabase.from("negotiation_offers").insert({
        negotiation_id: negotiationData.negotiation_id,
        offered_by: "freelancer",
        offered_price: proposedPrice[0],
        message: jobDescription.trim(),
      })

      // Send notification to client
      await supabase.from("notifications").insert({
        user_id: selectedNotification.metadata.client_id,
        type: "price_proposal",
        title: `Price proposal for "${selectedNotification.metadata.service_name}"`,
        message: `The freelancer has proposed $${proposedPrice[0]} for your project.`,
        metadata: {
          negotiation_id: negotiationData.negotiation_id,
          service_id: selectedNotification.metadata.service_id,
          service_name: selectedNotification.metadata.service_name,
          service_price_range: selectedNotification.metadata.service_price_range,
          proposed_price: proposedPrice[0],
          deadline: deadline,
          job_description: jobDescription.trim(),
          freelancer_name: user.user_metadata?.full_name || "Freelancer",
          freelancer_id: user.id,
          client_id: selectedNotification.metadata.client_id,
          offer_count: 1,
          last_offer_by: "freelancer",
        },
        is_read: false,
      })

      // Update original notification status
      await supabase.from("notifications").update({ status: "responded" }).eq("id", selectedNotification.id)

      setNegotiationDialogOpen(false)
      setJobDescription("")
      setDeadline("")
      alert("Price proposal sent successfully!")

      // Refresh notifications
      await fetchNotifications(user.id)
    } catch (error) {
      console.error("Error accepting inquiry:", error)
      alert("Failed to send proposal. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCounterOffer = async () => {
    if (!selectedNotification || counterPrice[0] <= 0) {
      alert("Please enter a valid price")
      return
    }

    if (!selectedNotification.metadata?.negotiation_id) {
      alert("Negotiation ID is missing. Please try refreshing the page.")
      return
    }

    // Determine current user's role in this negotiation
    const isClient = user.id === selectedNotification.metadata.client_id
    const isFreelancer = user.id === selectedNotification.metadata.freelancer_id

    if (!isClient && !isFreelancer) {
      alert("You are not part of this negotiation")
      return
    }

    const currentUserType = isClient ? "client" : "freelancer"
    const otherUserId = isClient ? selectedNotification.metadata.freelancer_id : selectedNotification.metadata.client_id

    // Validate other user exists
    if (!otherUserId) {
      alert(`${isClient ? "Freelancer" : "Client"} ID is missing from the notification`)
      return
    }

    const otherUserExists = await validateUserExists(otherUserId)
    if (!otherUserExists) {
      alert(`The ${isClient ? "freelancer" : "client"} no longer exists in the system`)
      return
    }

    const minPrice = selectedNotification.metadata.service_price_range?.[0] || 0
    const maxPrice = selectedNotification.metadata.service_price_range?.[1] || 1000

    if (counterPrice[0] < minPrice || counterPrice[0] > maxPrice) {
      alert(`Price must be between $${minPrice} and $${maxPrice}`)
      return
    }

    setSubmitting(true)
    try {
      const negotiationId = selectedNotification.metadata.negotiation_id

      // Reset any previous agreements since there's a new offer
      await supabase
        .from("price_negotiations")
        .update({
          current_price: counterPrice[0],
          last_offer_by: currentUserType,
          offer_count: (selectedNotification.metadata.offer_count || 0) + 1,
          status: "pending", // Reset to pending
          client_agreed: false, // Reset agreements
          freelancer_agreed: false,
        })
        .eq("negotiation_id", negotiationId)

      // Deactivate previous agreements
      await supabase.from("agreement_confirmations").update({ is_active: false }).eq("negotiation_id", negotiationId)

      // Create counter offer
      await supabase.from("negotiation_offers").insert({
        negotiation_id: negotiationId,
        offered_by: currentUserType,
        offered_price: counterPrice[0],
        message: counterMessage.trim() || null,
      })

      // Send notification to other party
      await supabase.from("notifications").insert({
        user_id: otherUserId,
        type: "counter_offer",
        title: `Counter offer for "${selectedNotification.metadata.service_name}"`,
        message: `The ${currentUserType} has counter-offered $${counterPrice[0]} for the project.`,
        metadata: {
          negotiation_id: negotiationId,
          service_id: selectedNotification.metadata.service_id,
          service_name: selectedNotification.metadata.service_name,
          service_price_range: selectedNotification.metadata.service_price_range,
          proposed_price: counterPrice[0],
          offer_count: (selectedNotification.metadata.offer_count || 0) + 1,
          client_message: currentUserType === "client" ? counterMessage.trim() : null,
          freelancer_message: currentUserType === "freelancer" ? counterMessage.trim() : null,
          freelancer_id: selectedNotification.metadata.freelancer_id,
          client_id: selectedNotification.metadata.client_id,
          last_offer_by: currentUserType,
        },
        is_read: false,
      })

      setCounterOfferDialogOpen(false)
      setCounterMessage("")
      setCounterPrice([0]) // Reset counter price
      alert("Counter offer sent successfully!")

      // Refresh notifications
      await fetchNotifications(user.id)
    } catch (error) {
      console.error("Error sending counter offer:", error)
      alert(`Failed to send counter offer: ${error}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Update the handleAgreeToPrice function to include validation
  const handleAgreeToPrice = async (notification: Notification) => {
    setErrorMessage(null)
    setSubmitting(true)

    try {
      const negotiationId = notification.metadata.negotiation_id
      const proposedPrice = notification.metadata.proposed_price
      const userType = user.id === notification.metadata.client_id ? "client" : "freelancer"
      const otherUserId = userType === "client" ? notification.metadata.freelancer_id : notification.metadata.client_id

      console.log("Agreement process started:", {
        negotiationId,
        proposedPrice,
        userType,
        otherUserId,
      })

      // Validate the other user exists
      if (!otherUserId) {
        throw new Error("Missing other party's ID in notification metadata")
      }

      const otherUserExists = await validateUser(otherUserId)
      if (!otherUserExists) {
        throw new Error("The other party no longer exists in the system")
      }

      // Create agreement confirmation
      const { error: agreementError } = await supabase.from("agreement_confirmations").insert({
        negotiation_id: negotiationId,
        user_id: user.id,
        user_type: userType,
        agreed_price: proposedPrice,
      })

      if (agreementError) {
        console.error("Agreement confirmation error:", agreementError)
        throw new Error(`Failed to record agreement: ${agreementError.message}`)
      }

      // Update negotiation status
      const updateData = userType === "client" ? { client_agreed: true } : { freelancer_agreed: true }
      const { error: updateError } = await supabase
        .from("price_negotiations")
        .update(updateData)
        .eq("negotiation_id", negotiationId)

      if (updateError) {
        console.error("Negotiation update error:", updateError)
        throw new Error(`Failed to update negotiation: ${updateError.message}`)
      }

      // Check if both parties have agreed
      const { data: negotiationData, error: fetchError } = await supabase
        .from("price_negotiations")
        .select("*")
        .eq("negotiation_id", negotiationId)
        .single()

      if (fetchError) {
        console.error("Error fetching negotiation data:", fetchError)
        throw new Error(`Failed to fetch negotiation: ${fetchError.message}`)
      }

      if (negotiationData) {
        const bothAgreed =
          (userType === "client" ? true : negotiationData.client_agreed) &&
          (userType === "freelancer" ? true : negotiationData.freelancer_agreed)

        console.log("Agreement status:", {
          bothAgreed,
          clientAgreed: userType === "client" ? true : negotiationData.client_agreed,
          freelancerAgreed: userType === "freelancer" ? true : negotiationData.freelancer_agreed,
        })

        if (bothAgreed) {
          // Both parties agreed - update negotiation
          await supabase
            .from("price_negotiations")
            .update({
              status: "both_agreed",
              final_agreed_price: proposedPrice,
              agreement_timestamp: new Date().toISOString(),
            })
            .eq("negotiation_id", negotiationId)

        if (updateError) {
          console.warn("Failed to update final negotiation status:", updateError)
          // Don't fail the whole process for this
        }

        // Create the job using the utility function
        console.log("Creating job from negotiation:", negotiationId)

        // Add debug info before job creation
        await debugJobCreation(negotiationId)

        const jobResult = await createJobFromNegotiation(negotiationId)

        if (!jobResult.success) {
          console.error("Job creation failed:", jobResult.error)
          // Show more detailed error to user
          alert(
            `Failed to create job: ${jobResult.error}\n\nPlease check the browser console for more details and contact support if the issue persists.`,
          )
          throw new Error(jobResult.error || "Failed to create job")
        }

        console.log("Job created successfully:", jobResult.jobId)

        // Send notification to both parties about job creation
        const notificationPromises = [
          // Notification to other party
          sendNotification({
            user_id: otherUserId,
            type: "job_created",
            title: `Job created for "${notification.metadata.service_name}"`,
            message: `Both parties have agreed to $${proposedPrice}. The job has been created and work can begin!`,
            metadata: {
              job_id: jobResult.jobId,
              service_name: notification.metadata.service_name,
              final_price: proposedPrice,
              negotiation_id: negotiationId,
            },
          }),
          // Notification to current user
          sendNotification({
            user_id: user.id,
            type: "job_created",
            title: `Job created for "${notification.metadata.service_name}"`,
            message: `The job has been created successfully! You can now view it in your jobs dashboard.`,
            metadata: {
              job_id: jobResult.jobId,
              service_name: notification.metadata.service_name,
              final_price: proposedPrice,
              negotiation_id: negotiationId,
            },
          }),
        ]

        // Send notifications but don't fail if they don't work
        try {
          await Promise.all(notificationPromises)
        } catch (notificationError) {
          console.warn("Failed to send job creation notifications:", notificationError)
        }

        alert(`Both parties agreed! Job has been created successfully. Job ID: ${jobResult.jobId}`)

        // Redirect to the job page
        window.location.href = `/jobs/${jobResult.jobId}`
      } else {
        // Only one party agreed - send notification to other party
        const otherUserType = userType === "client" ? "freelancer" : "client"

        await sendNotification({
            user_id: otherUserId,
            type: "agreement_pending",
            title: `Agreement pending for "${notification.metadata.service_name}"`,
            message: `The ${userType} has agreed to $${proposedPrice}. Waiting for your agreement to create the job.`,
            metadata: {
              negotiation_id: negotiationId,
              service_id: notification.metadata.service_id,
              service_name: notification.metadata.service_name,
              service_price_range: negotiationData.service_price_range || notification.metadata.service_price_range,
              proposed_price: proposedPrice,
              agreed_by: userType,
              waiting_for: otherUserType,
              freelancer_id: negotiationData.freelancer_id,
              client_id: negotiationData.client_id,
            },
          })

          alert(`You agreed to $${proposedPrice}. Waiting for the other party to agree.`)
        }

        // Refresh notifications
      await fetchNotifications(user.id);
      } 

    }catch (error) {
    console.error("Error agreeing to price:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to agree to price"
    setErrorMessage(errorMessage)
    alert(`Error: ${errorMessage}`)
  } finally {
    setSubmitting(false)
  };

  const handleDeclineOffer = async (notification: Notification) => {
    try {
      const negotiationId = notification.metadata.negotiation_id

      // Update negotiation status
      await supabase.from("price_negotiations").update({ status: "declined" }).eq("negotiation_id", negotiationId)

      // Send notification to other party
      const otherUserId =
        notification.metadata.last_offer_by === "client"
          ? notification.metadata.freelancer_id
          : notification.metadata.client_id

      await supabase.from("notifications").insert({
        user_id: otherUserId,
        type: "offer_declined",
        title: `Offer declined for "${notification.metadata.service_name}"`,
        message: "The price offer has been declined. The negotiation has ended.",
        metadata: {
          service_name: notification.metadata.service_name,
        },
        is_read: false,
      })

      alert("Offer declined.")

      // Refresh notifications
      await fetchNotifications(user.id)
    } catch (error) {
      console.error("Error declining offer:", error)
      alert("Failed to decline offer. Please try again.")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job_inquiry":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "price_proposal":
      case "counter_offer":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "agreement_pending":
        return <Users className="h-5 w-5 text-orange-500" />
      case "job_created":
        return <Briefcase className="h-5 w-5 text-green-500" />
      case "job_update":
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.is_read
    if (activeTab === "read") return notif.is_read
    return true
  })

  const unreadCount = notifications.filter((notif) => !notif.is_read).length

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="mt-2 text-muted-foreground">Stay updated with messages, job updates, and important alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${!notification.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.is_read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                        </div>
                        <CardDescription className="mt-1">{formatTimeAgo(notification.created_at)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>

                  {/* Job Inquiry Actions */}
                  {notification.type === "job_inquiry" && notification.status !== "responded" && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Service: {notification.metadata.service_name}</p>
                          <p className="text-xs text-muted-foreground">From: {notification.metadata.client_name}</p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" onClick={() => handleStartNegotiation(notification)}>
                            Accept & Set Price
                          </Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Proposal/Counter Offer Actions */}
                  {(notification.type === "price_proposal" || notification.type === "counter_offer") && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Proposed Price: ${notification.metadata.proposed_price}</p>
                          <p className="text-xs text-muted-foreground">Service: {notification.metadata.service_name}</p>
                          {notification.metadata.last_offer_by && (
                            <p className="text-xs text-muted-foreground">
                              Last offer by: {notification.metadata.last_offer_by}
                              {notification.metadata.offer_count && ` (Round ${notification.metadata.offer_count})`}
                            </p>
                          )}
                          {notification.metadata.deadline && (
                            <p className="text-xs text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              Deadline: {new Date(notification.metadata.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" disabled={submitting}>
                                Agree to Price
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Agree to Price?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  You're agreeing to ${notification.metadata.proposed_price} for "
                                  {notification.metadata.service_name}". The other party must also agree before the job
                                  is created.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleAgreeToPrice(notification)}>
                                  Yes, I Agree
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedNotification(notification)
                              // Initialize with current proposed price, ensuring it's within bounds
                              const currentPrice = notification.metadata.proposed_price || 0
                              const minPrice = notification.metadata.service_price_range?.[0] || 0
                              const maxPrice = notification.metadata.service_price_range?.[1] || 1000
                              const validPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice))
                              setCounterPrice([validPrice])
                              setCounterOfferDialogOpen(true)
                            }}
                          >
                            Counter Offer
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeclineOffer(notification)}>
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agreement Pending Actions */}
                  {notification.type === "agreement_pending" && (
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            <Users className="inline h-4 w-4 mr-1" />
                            Waiting for your agreement: ${notification.metadata.proposed_price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            The {notification.metadata.agreed_by} has already agreed to this price
                          </p>
                        </div>
                        <div className="space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" disabled={submitting}>
                                <Check className="h-4 w-4 mr-1" />
                                Agree & Create Job
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Create Job?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  By agreeing, you'll create a job for ${notification.metadata.proposed_price}. Work can
                                  begin immediately after creation.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleAgreeToPrice(notification)}>
                                  Agree & Create Job
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button size="sm" variant="destructive" onClick={() => handleDeclineOffer(notification)}>
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other notification types */}
                  {(notification.type === "job_created" || notification.type === "job_update") &&
                    notification.metadata && (
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Service: {notification.metadata.service_name}</p>
                            {notification.metadata.job_id && (
                              <p className="text-xs text-muted-foreground">Job ID: {notification.metadata.job_id}</p>
                            )}
                          </div>
                          {notification.metadata.job_id && (
                            <Button size="sm" asChild>
                              <Link href={`/jobs/${notification.metadata.job_id}`}>View Job</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 rounded-full bg-muted p-3 w-16 h-16 mx-auto flex items-center justify-center">
                {activeTab === "unread" ? (
                  <BellOff className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <Bell className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                {activeTab === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === "unread"
                  ? "You're all caught up! Check back later for new updates."
                  : "You'll see notifications here when you receive messages, job updates, and other important alerts."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {errorMessage && <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />}

      {/* Price Negotiation Dialog */}
      <Dialog open={negotiationDialogOpen} onOpenChange={setNegotiationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Accept Job Inquiry & Set Price</DialogTitle>
            <DialogDescription>
              Set your price and job details for "{selectedNotification?.metadata?.service_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Proposed Price: ${proposedPrice[0]}</Label>
              <Slider
                value={proposedPrice}
                onValueChange={setProposedPrice}
                max={selectedNotification?.metadata?.service_price_range?.[1] || 1000}
                min={selectedNotification?.metadata?.service_price_range?.[0] || 0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Min: ${selectedNotification?.metadata?.service_price_range?.[0] || 0}</span>
                <span>Max: ${selectedNotification?.metadata?.service_price_range?.[1] || 1000}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description *</Label>
              <Textarea
                id="job-description"
                placeholder="Describe what you'll deliver, timeline, and any specific requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNegotiationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcceptInquiry} disabled={submitting}>
              {submitting ? "Sending..." : "Send Proposal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Counter Offer Dialog */}
      <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Make Counter Offer</DialogTitle>
            <DialogDescription>
              Current offer: ${selectedNotification?.metadata?.proposed_price}
              {selectedNotification?.metadata?.last_offer_by && (
                <span className="block text-xs mt-1">Last offer by: {selectedNotification.metadata.last_offer_by}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Your Counter Offer: ${counterPrice[0]}</Label>
              <Slider
                value={counterPrice}
                onValueChange={setCounterPrice}
                max={selectedNotification?.metadata?.service_price_range?.[1] || 1000}
                min={selectedNotification?.metadata?.service_price_range?.[0] || 0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Min: ${selectedNotification?.metadata?.service_price_range?.[0] || 0}</span>
                <span>Max: ${selectedNotification?.metadata?.service_price_range?.[1] || 1000}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counter-message">Message (Optional)</Label>
              <Textarea
                id="counter-message"
                placeholder="Add a message with your counter offer..."
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCounterOfferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCounterOffer} disabled={submitting}>
              {submitting ? "Sending..." : "Send Counter Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
  }
}
