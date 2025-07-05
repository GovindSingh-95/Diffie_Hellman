"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Shield, Zap, Users, TrendingUp, BookOpen, CheckCircle, Star } from "lucide-react"

export function ProjectShowcase() {
  const technologies = [
    "React",
    "TypeScript",
    "Next.js",
    "Web Crypto API",
    "Tailwind CSS",
    "shadcn/ui",
    "Recharts",
    "Node.js",
  ]

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Real Cryptography",
      description: "Implements actual Web Crypto API with ECDH and AES-GCM encryption",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Performance Benchmarking",
      description: "Comprehensive testing suite comparing educational vs production implementations",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Real-time Collaboration",
      description: "Simulated multi-user key exchange with WebSocket-like interactions",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Interactive Learning",
      description: "Step-by-step tutorials with progress tracking and achievements",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Security Analysis",
      description: "MITM attack simulations and vulnerability demonstrations",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Advanced Visualizations",
      description: "Interactive charts and animations for complex cryptographic concepts",
    },
  ]

  const achievements = [
    "Real Web Crypto API integration",
    "TypeScript throughout entire codebase",
    "Responsive design with modern UI components",
    "Performance optimization and benchmarking",
    "Educational content with gamification",
    "Security vulnerability demonstrations",
  ]

  return (
    <div className="space-y-8">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Project Overview
          </CardTitle>
          <CardDescription>
            A comprehensive cryptography education platform showcasing advanced React development skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">{feature.icon}</div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Technical Achievements</h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Cryptography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>• Web Crypto API integration</li>
              <li>• ECDH key exchange</li>
              <li>• AES-GCM encryption</li>
              <li>• Security vulnerability analysis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5" />
              Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>• TypeScript & React hooks</li>
              <li>• Custom component library</li>
              <li>• Performance optimization</li>
              <li>• Responsive design</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>• Real-time collaboration</li>
              <li>• Progress tracking</li>
              <li>• Interactive tutorials</li>
              <li>• Data visualization</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
