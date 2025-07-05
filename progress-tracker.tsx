"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Trophy, Star, Clock, Target, TrendingUp, Award, BookOpen, Users, Zap, Download } from "lucide-react"

interface UserProgress {
  completedModules: string[]
  currentLevel: number
  totalScore: number
  achievements: string[]
  timeSpent: number
}

interface ProgressTrackerProps {
  userProgress: UserProgress
}

interface ActivityData {
  date: string
  score: number
  modules: number
  time: number
}

interface SkillData {
  skill: string
  level: number
  maxLevel: number
  color: string
}

export default function ProgressTracker({ userProgress }: ProgressTrackerProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "all">("week")

  // Generate mock activity data
  useEffect(() => {
    const generateActivityData = () => {
      const data: ActivityData[] = []
      const days = selectedTimeframe === "week" ? 7 : selectedTimeframe === "month" ? 30 : 90

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toISOString().split("T")[0],
          score: Math.floor(Math.random() * 100) + 50,
          modules: Math.floor(Math.random() * 3),
          time: Math.floor(Math.random() * 60) + 15,
        })
      }
      return data
    }

    setActivityData(generateActivityData())
  }, [selectedTimeframe])

  const skillsData: SkillData[] = [
    { skill: "Cryptographic Theory", level: 8, maxLevel: 10, color: "#3b82f6" },
    { skill: "Implementation", level: 6, maxLevel: 10, color: "#10b981" },
    { skill: "Security Analysis", level: 7, maxLevel: 10, color: "#f59e0b" },
    { skill: "Performance Optimization", level: 5, maxLevel: 10, color: "#ef4444" },
    { skill: "Collaboration", level: 9, maxLevel: 10, color: "#8b5cf6" },
  ]

  const achievements = [
    {
      id: "first-exchange",
      name: "First Key Exchange",
      description: "Complete your first DH key exchange",
      icon: <Star className="h-4 w-4" />,
      earned: true,
      date: "2024-01-15",
    },
    {
      id: "security-expert",
      name: "Security Expert",
      description: "Identify all major DH vulnerabilities",
      icon: <Trophy className="h-4 w-4" />,
      earned: true,
      date: "2024-01-20",
    },
    {
      id: "implementation-master",
      name: "Implementation Master",
      description: "Complete all coding challenges",
      icon: <BookOpen className="h-4 w-4" />,
      earned: false,
      date: null,
    },
    {
      id: "collaboration-champion",
      name: "Collaboration Champion",
      description: "Complete 5 collaborative exchanges",
      icon: <Users className="h-4 w-4" />,
      earned: true,
      date: "2024-01-25",
    },
    {
      id: "performance-guru",
      name: "Performance Guru",
      description: "Run comprehensive benchmarks",
      icon: <Zap className="h-4 w-4" />,
      earned: false,
      date: null,
    },
    {
      id: "crypto-master",
      name: "Crypto Master",
      description: "Complete all learning modules",
      icon: <Award className="h-4 w-4" />,
      earned: false,
      date: null,
    },
  ]

  const pieData = [
    { name: "Completed", value: userProgress.completedModules.length, color: "#10b981" },
    { name: "In Progress", value: 2, color: "#f59e0b" },
    { name: "Not Started", value: 3, color: "#e5e7eb" },
  ]

  const exportProgress = () => {
    const data = {
      timestamp: new Date().toISOString(),
      userProgress,
      activityData,
      skillsData,
      achievements: achievements.filter((a) => a.earned),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crypto-progress-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Learning Progress Tracker</CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive analytics of your cryptography mastery journey
                </CardDescription>
              </div>
            </div>
            <Button onClick={exportProgress} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Progress
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userProgress.currentLevel}</div>
              <div className="text-sm text-slate-600">Current Level</div>
              <Progress value={(userProgress.currentLevel / 10) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{userProgress.totalScore}</div>
              <div className="text-sm text-slate-600">Total Score</div>
              <div className="text-xs text-green-600 mt-1">+{Math.floor(Math.random() * 50) + 10} this week</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{userProgress.completedModules.length}</div>
              <div className="text-sm text-slate-600">Modules Completed</div>
              <div className="text-xs text-purple-600 mt-1">out of 8 total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{achievements.filter((a) => a.earned).length}</div>
              <div className="text-sm text-slate-600">Achievements</div>
              <div className="text-xs text-orange-600 mt-1">out of {achievements.length} total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Module Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Module Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Achievement Unlocked</div>
                      <div className="text-xs text-slate-600">Collaboration Champion - 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Module Completed</div>
                      <div className="text-xs text-slate-600">Hybrid Encryption - 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Benchmark Run</div>
                      <div className="text-xs text-slate-600">Performance Analysis - 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Collaboration Session</div>
                      <div className="text-xs text-slate-600">Key Exchange Practice - 3 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-slate-600">Current Streak</div>
                  <div className="text-xs text-orange-600">days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-slate-600">Longest Streak</div>
                  <div className="text-xs text-blue-600">days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-slate-600">Weekly Goal</div>
                  <div className="text-xs text-green-600">5/7 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedTimeframe === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={selectedTimeframe === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={selectedTimeframe === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe("all")}
                  >
                    All Time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score" />
                    <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} name="Time (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsData.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-sm text-slate-600">
                        {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${(skill.level / skill.maxLevel) * 100}%`,
                          backgroundColor: skill.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Focus Area: Performance Optimization</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Your performance optimization skills could use improvement. Try the benchmark modules to level up.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Benchmark Module
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Strength: Collaboration</h4>
                  <p className="text-sm text-green-700">
                    Excellent collaboration skills! Consider mentoring others or leading group sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${
                  achievement.earned
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-yellow-100" : "bg-slate-200"
                      }`}
                    >
                      <div className={achievement.earned ? "text-yellow-600" : "text-slate-400"}>
                        {achievement.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{achievement.name}</h3>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                    {achievement.earned ? (
                      <div className="space-y-1">
                        <Badge className="bg-yellow-100 text-yellow-800">✓ Earned</Badge>
                        {achievement.date && (
                          <div className="text-xs text-slate-500">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Not Earned</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
