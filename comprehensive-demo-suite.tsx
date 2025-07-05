"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Users,
  Zap,
  Trophy,
  Play,
  Pause,
  ChevronRight,
  Star,
  Clock,
  Target,
  Brain,
  Shield,
  Code,
  BarChart3,
} from "lucide-react"

// Import all demo components
import DiffieHellmanDemo from "./diffie-hellman-demo"
import { HybridEncryptionDemo } from "./hybrid-encryption-demo"
import CollaborativeKeyExchange from "./collaborative-key-exchange"
import PerformanceBenchmark from "./performance-benchmark"
import ProgressTracker from "./progress-tracker"

interface DemoModule {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  category: "educational" | "practical" | "collaborative" | "analysis"
  component: React.ComponentType<any>
  completed?: boolean
  rating?: number
}

interface LearningSession {
  id: string
  title: string
  modules: string[]
  description: string
  totalTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function ComprehensiveDemoSuite() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [sessionProgress, setSessionProgress] = useState<Record<string, boolean>>({})
  const [currentSession, setCurrentSession] = useState<string | null>(null)

  const demoModules: DemoModule[] = [
    {
      id: "basic-dh",
      title: "Basic Diffie-Hellman",
      description: "Learn the fundamentals of key exchange with interactive educational and real crypto demos",
      icon: <BookOpen className="h-5 w-5" />,
      difficulty: "beginner",
      estimatedTime: 15,
      category: "educational",
      component: DiffieHellmanDemo,
      completed: true,
      rating: 4.8,
    },
    {
      id: "hybrid-encryption",
      title: "Hybrid Encryption",
      description: "Combine DH key exchange with symmetric encryption for secure messaging",
      icon: <Shield className="h-5 w-5" />,
      difficulty: "intermediate",
      estimatedTime: 20,
      category: "practical",
      component: HybridEncryptionDemo,
      completed: false,
      rating: 4.6,
    },
    {
      id: "collaborative",
      title: "Collaborative Exchange",
      description: "Practice key exchange with simulated partners in real-time scenarios",
      icon: <Users className="h-5 w-5" />,
      difficulty: "intermediate",
      estimatedTime: 25,
      category: "collaborative",
      component: CollaborativeKeyExchange,
      completed: false,
      rating: 4.7,
    },
    {
      id: "performance",
      title: "Performance Benchmark",
      description: "Compare educational simulations with real-world cryptographic performance",
      icon: <Zap className="h-5 w-5" />,
      difficulty: "advanced",
      estimatedTime: 30,
      category: "analysis",
      component: PerformanceBenchmark,
      completed: false,
      rating: 4.5,
    },
    {
      id: "progress",
      title: "Progress Tracker",
      description: "Track your learning journey with detailed analytics and achievements",
      icon: <Trophy className="h-5 w-5" />,
      difficulty: "beginner",
      estimatedTime: 10,
      category: "analysis",
      component: ProgressTracker,
      completed: false,
      rating: 4.9,
    },
  ]

  const learningSessions: LearningSession[] = [
    {
      id: "fundamentals",
      title: "Cryptography Fundamentals",
      modules: ["basic-dh", "progress"],
      description: "Start your cryptography journey with basic concepts and progress tracking",
      totalTime: 25,
      difficulty: "beginner",
    },
    {
      id: "practical-crypto",
      title: "Practical Cryptography",
      modules: ["basic-dh", "hybrid-encryption", "collaborative"],
      description: "Learn practical applications of cryptographic protocols",
      totalTime: 60,
      difficulty: "intermediate",
    },
    {
      id: "advanced-analysis",
      title: "Advanced Analysis",
      modules: ["performance", "collaborative", "progress"],
      description: "Deep dive into performance analysis and collaborative scenarios",
      totalTime: 65,
      difficulty: "advanced",
    },
    {
      id: "complete-mastery",
      title: "Complete Mastery",
      modules: ["basic-dh", "hybrid-encryption", "collaborative", "performance", "progress"],
      description: "Master all aspects of cryptographic key exchange",
      totalTime: 100,
      difficulty: "advanced",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "educational":
        return "bg-blue-100 text-blue-800"
      case "practical":
        return "bg-purple-100 text-purple-800"
      case "collaborative":
        return "bg-orange-100 text-orange-800"
      case "analysis":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const startSession = (sessionId: string) => {
    setCurrentSession(sessionId)
    const session = learningSessions.find((s) => s.id === sessionId)
    if (session && session.modules.length > 0) {
      setActiveDemo(session.modules[0])
    }
  }

  const completeModule = (moduleId: string) => {
    setSessionProgress((prev) => ({ ...prev, [moduleId]: true }))

    if (currentSession) {
      const session = learningSessions.find((s) => s.id === currentSession)
      if (session) {
        const currentIndex = session.modules.indexOf(moduleId)
        if (currentIndex < session.modules.length - 1) {
          setActiveDemo(session.modules[currentIndex + 1])
        } else {
          // Session completed
          setCurrentSession(null)
          setActiveDemo(null)
        }
      }
    }
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "text-yellow-400 fill-current" : "text-slate-300"}`}
          />
        ))}
        <span className="text-xs text-slate-600 ml-1">{rating}</span>
      </div>
    )
  }

  if (activeDemo) {
    const module = demoModules.find((m) => m.id === activeDemo)
    if (module) {
      const Component = module.component
      return (
        <div className="min-h-screen bg-slate-50">
          {/* Demo Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveDemo(null)} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Suite
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
                  <p className="text-sm text-slate-600">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                {currentSession && (
                  <Button onClick={() => completeModule(activeDemo)} className="bg-green-600 hover:bg-green-700">
                    Complete Module
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Demo Content */}
          <div className="p-6">
            <Component onCollaboration={() => completeModule(activeDemo)} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Comprehensive Cryptography Demo Suite</CardTitle>
              <CardDescription className="text-lg">
                Interactive learning platform for Diffie-Hellman key exchange and modern cryptography
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Demo Modules</TabsTrigger>
          <TabsTrigger value="sessions">Learning Sessions</TabsTrigger>
          <TabsTrigger value="overview">Suite Overview</TabsTrigger>
        </TabsList>

        {/* Demo Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoModules.map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  module.completed ? "ring-2 ring-green-200 bg-green-50/30" : ""
                }`}
                onClick={() => setActiveDemo(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(module.category).replace("text-", "bg-").replace("800", "100")}`}
                      >
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        {module.completed && <Badge className="bg-green-100 text-green-800 mt-1">✓ Completed</Badge>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{module.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{module.estimatedTime} min</span>
                    </div>
                    {module.rating && renderStarRating(module.rating)}
                  </div>

                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                    <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                  </div>

                  <Button className="w-full" variant={module.completed ? "outline" : "default"}>
                    <Play className="h-4 w-4 mr-2" />
                    {module.completed ? "Review Module" : "Start Module"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {learningSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {session.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{session.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(session.difficulty)}>{session.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>{session.totalTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                      <span>{session.modules.length} modules</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Included Modules:</h4>
                    <div className="space-y-1">
                      {session.modules.map((moduleId, index) => {
                        const module = demoModules.find((m) => m.id === moduleId)
                        const isCompleted = sessionProgress[moduleId]
                        return (
                          <div
                            key={moduleId}
                            className={`flex items-center gap-2 p-2 rounded text-sm ${
                              isCompleted ? "bg-green-50 text-green-800" : "bg-slate-50"
                            }`}
                          >
                            <span className="text-xs font-mono w-6 text-center">{index + 1}</span>
                            {module?.icon}
                            <span className="flex-1">{module?.title}</span>
                            {isCompleted && <Badge className="bg-green-100 text-green-800">✓</Badge>}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => startSession(session.id)}
                    className="w-full"
                    disabled={currentSession === session.id}
                  >
                    {currentSession === session.id ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Session Active
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentSession && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Play className="h-5 w-5" />
                  Active Session: {learningSessions.find((s) => s.id === currentSession)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    Progress: {Object.values(sessionProgress).filter(Boolean).length} /{" "}
                    {learningSessions.find((s) => s.id === currentSession)?.modules.length || 0} modules
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentSession(null)
                      setActiveDemo(null)
                    }}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Suite Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{demoModules.length}</div>
                  <div className="text-sm text-slate-600">Demo Modules</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{learningSessions.length}</div>
                  <div className="text-sm text-slate-600">Learning Sessions</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {demoModules.reduce((sum, m) => sum + m.estimatedTime, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Minutes</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {demoModules.filter((m) => m.completed).length}
                  </div>
                  <div className="text-sm text-slate-600">Completed</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Suite Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Interactive Learning</h4>
                        <p className="text-sm text-slate-600">
                          Hands-on demos with both educational simulations and real cryptography
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-green-100 rounded">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Collaborative Learning</h4>
                        <p className="text-sm text-slate-600">
                          Practice with simulated partners in realistic scenarios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-purple-100 rounded">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Performance Analysis</h4>
                        <p className="text-sm text-slate-600">
                          Benchmark and compare different cryptographic implementations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-orange-100 rounded">
                        <Trophy className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Progress Tracking</h4>
                        <p className="text-sm text-slate-600">
                          Detailed analytics, achievements, and learning path guidance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-red-100 rounded">
                        <Shield className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Real Cryptography</h4>
                        <p className="text-sm text-slate-600">
                          Web Crypto API integration for production-grade implementations
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Learning Path Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommended Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: 1, title: "Start with Basics", module: "basic-dh", time: "15 min" },
                      { step: 2, title: "Track Progress", module: "progress", time: "10 min" },
                      { step: 3, title: "Apply Knowledge", module: "hybrid-encryption", time: "20 min" },
                      { step: 4, title: "Collaborate", module: "collaborative", time: "25 min" },
                      { step: 5, title: "Analyze Performance", module: "performance", time: "30 min" },
                    ].map((item) => {
                      const module = demoModules.find((m) => m.id === item.module)
                      return (
                        <div key={item.step} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-slate-600">
                              {module?.title} • {item.time}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setActiveDemo(item.module)}>
                            Start
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => startSession("complete-mastery")}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Start Complete Mastery Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
