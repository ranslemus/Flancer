import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Flancer",
  description: "Manage your freelance work, track deadlines, and monitor applications.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}
