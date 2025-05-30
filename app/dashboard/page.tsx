"use server"

import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserProfile, requireAuth } from "@/app/lib/auth"
import { ClientDashboard } from "./client-dashboard"
import { FreelancerDashboard } from "./freelancer-dashboard"

export default async function DashboardPage() {
  await requireAuth()
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    console.log('NO SESSION')
    redirect("/auth/login")
  }

  // Get user profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  const user = {
    id: session.user.id,
    email: session.user.email,
    name: profile?.name || session.user.email?.split("@")[0] || "User",
    userType: profile?.user_type || "freelancer",
  }

  // return <DashboardClient user={user} />
  const profile2 = await getUserProfile()

  if (!profile2) {
    console.log('NO PROFILE')
    redirect("/auth/login")
  }

  if (profile2.user_type === "client") {
    return <ClientDashboard profile={profile2} />
  } else if (profile2.user_type === "freelancer") {
    return <FreelancerDashboard profile={profile2} />
  }
}

// Mock data for the dashboard
const mockUser = {
  name: "Alex Johnson",
  avatar: "/placeholder.svg",
  title: "Frontend Developer",
  earnings: 1250,
  completedJobs: 8,
  activeJobs: 3,
  pendingApplications: 5,
  rating: 4.8,
}

const mockActiveJobs = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    client: "Global Retail Inc.",
    clientAvatar: "/placeholder.svg",
    deadline: "May 20, 2025",
    progress: 65,
    payment: "$800",
    status: "In Progress",
    messages: 3,
  },
  {
    id: 2,
    title: "React Dashboard Development",
    client: "Tech Solutions Ltd.",
    clientAvatar: "/placeholder.svg",
    deadline: "May 15, 2025",
    progress: 40,
    payment: "$1200",
    status: "In Progress",
    messages: 0,
  },
  {
    id: 3,
    title: "Landing Page Optimization",
    client: "Startup Ventures",
    clientAvatar: "/placeholder.svg",
    deadline: "May 25, 2025",
    progress: 20,
    payment: "$400",
    status: "In Progress",
    messages: 2,
  },
]

const mockDeadlines = [
  {
    id: 1,
    title: "Submit Homepage Wireframes",
    project: "E-commerce Website Redesign",
    dueDate: "May 12, 2025",
    daysLeft: 2,
    priority: "High",
  },
  {
    id: 2,
    title: "Complete User Authentication",
    project: "React Dashboard Development",
    dueDate: "May 14, 2025",
    daysLeft: 4,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Finalize Color Scheme",
    project: "Landing Page Optimization",
    dueDate: "May 13, 2025",
    daysLeft: 3,
    priority: "Low",
  },
]

const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer for SaaS Platform",
    company: "SaaS Innovations",
    appliedDate: "May 5, 2025",
    status: "Under Review",
    budget: "$30-40/hr",
    proposal: "I have extensive experience with React and Next.js...",
  },
  {
    id: 2,
    jobTitle: "UI Component Library Development",
    company: "Design Systems Co.",
    appliedDate: "May 3, 2025",
    status: "Shortlisted",
    budget: "$2000-3000",
    proposal: "I've built several component libraries using...",
  },
  {
    id: 3,
    jobTitle: "E-commerce Site Maintenance",
    company: "Fashion Outlet Online",
    appliedDate: "May 1, 2025",
    status: "Viewed",
    budget: "$25-35/hr",
    proposal: "I can help maintain and improve your e-commerce...",
  },
  {
    id: 4,
    jobTitle: "JavaScript Performance Optimization",
    company: "Web Performance Inc.",
    appliedDate: "April 28, 2025",
    status: "Under Review",
    budget: "$45-55/hr",
    proposal: "I specialize in optimizing JavaScript applications...",
  },
  {
    id: 5,
    jobTitle: "Responsive Email Template Design",
    company: "Marketing Solutions",
    appliedDate: "April 25, 2025",
    status: "Rejected",
    budget: "$500-800",
    proposal: "I can create responsive email templates that work...",
  },
]
