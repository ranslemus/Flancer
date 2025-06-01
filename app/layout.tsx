'use client'

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/auth/login", "/auth/register"];
  const hideFooter = hideFooterRoutes.includes(pathname ?? "");

  // Memoize supabase client once per app instance
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>());

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Provide Supabase client and session context to entire app */}
        <SessionContextProvider supabaseClient={supabaseClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              {!hideFooter && <Footer />}
            </div>
          </ThemeProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
