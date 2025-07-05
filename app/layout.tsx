import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Diffie-Hellman Interactive Demo | Portfolio Project",
  description:
    "Interactive cryptography education platform showcasing React, TypeScript, and Web Crypto API implementation. Built as a portfolio demonstration of advanced web development skills.",
  keywords: ["React", "TypeScript", "Cryptography", "Web Crypto API", "Next.js", "Portfolio", "Diffie-Hellman"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    title: "Diffie-Hellman Interactive Demo",
    description: "Interactive cryptography education platform built with React and TypeScript",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
