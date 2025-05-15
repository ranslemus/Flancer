'use client'

import React from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Panggil usePathname DI DALAM komponen (RootLayout)
  const pathname = usePathname()
  const hideFooter = pathname === "/auth/login" || pathname === "/auth/register"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {!hideFooter && <Footer />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
