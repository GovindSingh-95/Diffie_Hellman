"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, BookOpen, Users, Code, Shield, Zap, Star, Award, Target, TrendingUp } from "lucide-react"
import ComprehensiveDemoSuite from "../comprehensive-demo-suite"
import GuidedTutorial from "../guided-tutorial"
import CollaborativeKeyExchange from "../collaborative-key-exchange"
import PerformanceBenchmark from "../performance-benchmark"
import ProgressTracker from "../progress-tracker"
import { ProjectShowcase } from "@/components/project-showcase"
import { Footer } from "@/components/footer"

interface UserProgress {
  completedModules: string[]
  currentLevel: number
  totalScore: number
  achievements: string[]
  timeSpent: number
}

export default function Home() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    currentLevel: 1,
    totalScore: 0,
    achievements: [],
    timeSpent: 0,
  })
  const [activeTab, setActiveTab] = useState("showcase")
  const [showTutorial, setShowTutorial] = useState(false)

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("dh-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("dh-progress", JSON.stringify(userProgress))
  }, [userProgress])

  const modules = [
    { id: "basics", name: "DH Basics", icon: <BookOpen className="h-4 w-4" />, difficulty: 1 },
    { id: "security", name: "Security Analysis", icon: <Shield className="h-4 w-4" />, difficulty: 2 },
    { id: "implementation", name: "Implementation", icon: <Code className="h-4 w-4" />, difficulty: 3 },
    { id: "advanced", name: "Advanced Topics", icon: <Zap className="h-4 w-4" />, difficulty: 4 },
  ]

  const achievements = [
    {
      id: "first-exchange",
      name: "First Key Exchange",
      description: "Complete your first DH key exchange",
      icon: <Star className="h-4 w-4" />,
    },
    {
      id: "security-expert",
      name: "Security Expert",
      description: "Identify all major DH vulnerabilities",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "implementation-master",
      name: "Implementation Master",
      description: "Complete all coding challenges",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "collaboration-champion",
      name: "Collaboration Champion",
      description: "Complete 5 collaborative exchanges",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  const completionPercentage = (userProgress.completedModules.length / modules.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Diffie-Hellman Interactive Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            An interactive cryptography education platform showcasing advanced React development, real Web Crypto API
            integration, and modern TypeScript implementation.
          </p>
        </div>

        {/* Project Showcase */}
        <div className="mb-12">
          <ProjectShowcase />
        </div>

        {/* Main Demo Suite */}
        <ComprehensiveDemoSuite />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="showcase" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Showcase
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tutorial
            </TabsTrigger>
            <TabsTrigger value="collaborate" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Collaborate
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Benchmark
            </TabsTrigger>
            <TabsTrigger value="demos" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Demos
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-0">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Progress Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                  <CardDescription>Your journey through cryptography mastery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Completion</span>
                        <span>{Math.round(completionPercentage)}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{userProgress.currentLevel}</div>
                        <div className="text-sm text-blue-700">Current Level</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{userProgress.totalScore}</div>
                        <div className="text-sm text-green-700">Total Score</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {module.icon}
                            <span className="font-medium">{module.name}</span>
                            <Badge variant="outline">Level {module.difficulty}</Badge>
                          </div>
                          {userProgress.completedModules.includes(module.id) ? (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border ${
                          userProgress.achievements.includes(achievement.id)
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {achievement.icon}
                          <span className="font-medium text-sm">{achievement.name}</span>
                        </div>
                        <p className="text-xs text-slate-600">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => setShowTutorial(true)}
                className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
              >
                <BookOpen className="h-6 w-6" />
                Start Guided Tutorial
              </Button>
              <Button
                onClick={() => setActiveTab("collaborate")}
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                Join Collaboration
              </Button>
              <Button onClick={() => setActiveTab("benchmark")} variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                Run Benchmarks
              </Button>
            </div>
          </TabsContent>

          {/* Guided Tutorial */}
          <TabsContent value="tutorial" className="mt-0">
            <GuidedTutorial
              onComplete={(moduleId) => {
                setUserProgress((prev) => ({
                  ...prev,
                  completedModules: [...prev.completedModules, moduleId],
                  totalScore: prev.totalScore + 100,
                }))
              }}
            />
          </TabsContent>

          {/* Collaborative Key Exchange */}
          <TabsContent value="collaborate" className="mt-0">
            <CollaborativeKeyExchange
              onCollaboration={() => {
                setUserProgress((prev) => ({
                  ...prev,
                  totalScore: prev.totalScore + 50,
                }))
              }}
            />
          </TabsContent>

          {/* Performance Benchmark */}
          <TabsContent value="benchmark" className="mt-0">
            <PerformanceBenchmark />
          </TabsContent>

          {/* Demo Suite */}
          <TabsContent value="demos" className="mt-0">
            <ComprehensiveDemoSuite />
          </TabsContent>

          {/* Progress Tracker */}
          <TabsContent value="progress" className="mt-0">
            <ProgressTracker userProgress={userProgress} />
          </TabsContent>
        </Tabs>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
              <GuidedTutorial
                onComplete={(moduleId) => {
                  setUserProgress((prev) => ({
                    ...prev,
                    completedModules: [...prev.completedModules, moduleId],
                    totalScore: prev.totalScore + 100,
                  }))
                  setShowTutorial(false)
                }}
                onClose={() => setShowTutorial(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
