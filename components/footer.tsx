"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Linkedin, Github, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Portfolio Project</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                This interactive cryptography demo showcases advanced React development, TypeScript implementation, and
                real Web Crypto API integration.
              </p>

              <Separator className="my-4" />

              <div className="flex justify-center items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>your.email@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span>linkedin.com/in/yourprofile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>github.com/yourusername</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>yourportfolio.com</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-4">
                Built with Next.js, TypeScript, and Web Crypto API • {new Date().getFullYear()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  )
}
