"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  RotateCcw,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Key,
  Timer,
  TrendingUp,
  Lock,
  Unlock,
  History,
  Play,
  Pause,
} from "lucide-react"

interface KeyLifecycle {
  id: string
  generation: number
  createdAt: Date
  expiresAt: Date
  status: "active" | "rotating" | "expired" | "compromised"
  messagesEncrypted: number
  securityScore: number
}

interface RotationStrategy {
  name: string
  description: string
  trigger: "time" | "usage" | "threat" | "manual"
  interval: number
  enabled: boolean
}

export function KeyRotationDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [keyLifecycles, setKeyLifecycles] = useState<KeyLifecycle[]>([
    {
      id: "key-1",
      generation: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30000), // 30 seconds
      status: "active",
      messagesEncrypted: 0,
      securityScore: 100,
    },
  ])

  const [strategies, setStrategies] = useState<RotationStrategy[]>([
    {
      name: "Time-based Rotation",
      description: "Rotate keys at regular intervals",
      trigger: "time",
      interval: 30,
      enabled: true,
    },
    {
      name: "Usage-based Rotation",
      description: "Rotate after a certain number of operations",
      trigger: "usage",
      interval: 10,
      enabled: false,
    },
    {
      name: "Threat-based Rotation",
      description: "Rotate when security threats are detected",
      trigger: "threat",
      interval: 0,
      enabled: false,
    },
  ])

  const [simulatedMessages, setSimulatedMessages] = useState(0)
  const [threatLevel, setThreatLevel] = useState(0)
  const [forwardSecrecyDemo, setForwardSecrecyDemo] = useState(false)

  // Main simulation timer
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1)

      // Simulate message encryption
      if (Math.random() < 0.3) {
        setSimulatedMessages((prev) => prev + 1)
        updateActiveKeyUsage()
      }

      // Check rotation conditions
      checkRotationConditions()

      // Degrade security score over time
      degradeSecurityScore()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, strategies])

  const updateActiveKeyUsage = () => {
    setKeyLifecycles((prev) =>
      prev.map((key) => (key.status === "active" ? { ...key, messagesEncrypted: key.messagesEncrypted + 1 } : key)),
    )
  }

  const degradeSecurityScore = () => {
    setKeyLifecycles((prev) =>
      prev.map((key) =>
        key.status === "active" ? { ...key, securityScore: Math.max(0, key.securityScore - 0.5) } : key,
      ),
    )
  }

  const checkRotationConditions = () => {
    const activeKey = keyLifecycles.find((k) => k.status === "active")
    if (!activeKey) return

    const timeStrategy = strategies.find((s) => s.trigger === "time" && s.enabled)
    const usageStrategy = strategies.find((s) => s.trigger === "usage" && s.enabled)
    const threatStrategy = strategies.find((s) => s.trigger === "threat" && s.enabled)

    let shouldRotate = false

    // Time-based rotation
    if (timeStrategy && currentTime > 0 && currentTime % timeStrategy.interval === 0) {
      shouldRotate = true
    }

    // Usage-based rotation
    if (usageStrategy && activeKey.messagesEncrypted >= usageStrategy.interval) {
      shouldRotate = true
    }

    // Threat-based rotation
    if (threatStrategy && threatLevel > 70) {
      shouldRotate = true
    }

    // Security score threshold
    if (activeKey.securityScore < 20) {
      shouldRotate = true
    }

    if (shouldRotate && activeKey.status !== "rotating") {
      performKeyRotation()
    }
  }

  const performKeyRotation = async () => {
    // Mark current key as rotating
    setKeyLifecycles((prev) => prev.map((key) => (key.status === "active" ? { ...key, status: "rotating" } : key)))

    // Simulate rotation delay
    setTimeout(() => {
      setKeyLifecycles((prev) => {
        const updated = prev.map((key) => (key.status === "rotating" ? { ...key, status: "expired" } : key))

        // Add new active key
        const newGeneration = Math.max(...prev.map((k) => k.generation)) + 1
        updated.push({
          id: `key-${newGeneration}`,
          generation: newGeneration,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + (strategies.find((s) => s.trigger === "time")?.interval || 30) * 1000),
          status: "active",
          messagesEncrypted: 0,
          securityScore: 100,
        })

        return updated
      })
    }, 2000)
  }

  const manualRotation = () => {
    performKeyRotation()
  }

  const simulateThreat = () => {
    setThreatLevel(Math.min(100, threatLevel + 30))
    setTimeout(() => setThreatLevel((prev) => Math.max(0, prev - 10)), 5000)
  }

  const toggleStrategy = (index: number) => {
    setStrategies((prev) =>
      prev.map((strategy, i) => (i === index ? { ...strategy, enabled: !strategy.enabled } : strategy)),
    )
  }

  const updateStrategyInterval = (index: number, value: number[]) => {
    setStrategies((prev) => prev.map((strategy, i) => (i === index ? { ...strategy, interval: value[0] } : strategy)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "rotating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-slate-100 text-slate-600 border-slate-200"
      case "compromised":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "rotating":
        return <RotateCcw className="h-4 w-4 animate-spin" />
      case "expired":
        return <Clock className="h-4 w-4" />
      case "compromised":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Key className="h-4 w-4" />
    }
  }

  const activeKey = keyLifecycles.find((k) => k.status === "active")
  const totalRotations = keyLifecycles.length - 1

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Key Rotation & Lifecycle Management</h1>
        <p className="text-slate-600 max-w-3xl mx-auto mb-6">
          Demonstrate automatic key rotation strategies, forward secrecy, and security lifecycle management
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setIsRunning(!isRunning)} size="lg">
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Pause" : "Start"} Simulation
          </Button>
          <Button onClick={manualRotation} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Manual Rotation
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Runtime</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Rotations</span>
            </div>
            <div className="text-2xl font-bold">{totalRotations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Messages</span>
            </div>
            <div className="text-2xl font-bold">{simulatedMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Threat Level</span>
            </div>
            <div className="text-2xl font-bold">{threatLevel}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Rotation Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rotation Strategies
            </CardTitle>
            <CardDescription>Configure automatic key rotation triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategies.map((strategy, index) => (
              <div key={strategy.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={strategy.enabled} onCheckedChange={() => toggleStrategy(index)} />
                    <span className="font-medium">{strategy.name}</span>
                  </div>
                  <Badge variant={strategy.enabled ? "default" : "secondary"}>
                    {strategy.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">{strategy.description}</p>

                {strategy.enabled && strategy.trigger !== "threat" && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      {strategy.trigger === "time" ? "Interval (seconds)" : "Max operations"}
                    </Label>
                    <Slider
                      value={[strategy.interval]}
                      onValueChange={(value) => updateStrategyInterval(index, value)}
                      max={strategy.trigger === "time" ? 120 : 50}
                      min={strategy.trigger === "time" ? 10 : 5}
                      step={strategy.trigger === "time" ? 5 : 1}
                      className="w-full"
                    />
                    <div className="text-xs text-slate-500">Current: {strategy.interval}</div>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button onClick={simulateThreat} variant="outline" className="w-full bg-transparent">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Simulate Security Threat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Key Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Current Key Status
            </CardTitle>
            <CardDescription>Real-time key health and lifecycle information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeKey && (
              <>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">Generation {activeKey.generation}</div>
                    <div className="text-sm text-slate-600">Created: {activeKey.createdAt.toLocaleTimeString()}</div>
                  </div>
                  <Badge className={getStatusColor(activeKey.status)}>
                    {getStatusIcon(activeKey.status)}
                    {activeKey.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Security Score</span>
                      <span>{Math.round(activeKey.securityScore)}%</span>
                    </div>
                    <Progress
                      value={activeKey.securityScore}
                      className={`h-2 ${activeKey.securityScore < 30 ? "bg-red-100" : "bg-green-100"}`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Messages Encrypted</span>
                      <span>{activeKey.messagesEncrypted}</span>
                    </div>
                    <Progress
                      value={
                        (activeKey.messagesEncrypted /
                          (strategies.find((s) => s.trigger === "usage")?.interval || 10)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Until Rotation</span>
                      <span>{Math.max(0, Math.ceil((activeKey.expiresAt.getTime() - Date.now()) / 1000))}s</span>
                    </div>
                    <Progress
                      value={Math.max(
                        0,
                        ((activeKey.expiresAt.getTime() - Date.now()) /
                          (strategies.find((s) => s.trigger === "time")?.interval || 30) /
                          1000) *
                          100,
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key History Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Key Lifecycle Timeline
              </CardTitle>
              <CardDescription>Historical view of key rotations and security events</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="forward-secrecy">Forward Secrecy Demo</Label>
              <Switch id="forward-secrecy" checked={forwardSecrecyDemo} onCheckedChange={setForwardSecrecyDemo} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyLifecycles
              .slice()
              .reverse()
              .map((key, index) => (
                <div key={key.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(key.status)}`}
                  >
                    {getStatusIcon(key.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Generation {key.generation}</span>
                      <Badge variant="outline" className="text-xs">
                        {key.messagesEncrypted} messages
                      </Badge>
                      {forwardSecrecyDemo && key.status === "expired" && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <Unlock className="h-3 w-3 mr-1" />
                          Forward Secure
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      Created: {key.createdAt.toLocaleTimeString()}
                      {key.status === "expired" && " • Rotated successfully"}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Security Score: {Math.round(key.securityScore)}%</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {key.status === "active" ? "Active" : key.status === "rotating" ? "Rotating..." : "Expired"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {key.status === "active"
                        ? "Current key"
                        : `Lifetime: ${Math.round((Date.now() - key.createdAt.getTime()) / 1000)}s`}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {forwardSecrecyDemo && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Forward Secrecy Explanation</span>
              </div>
              <p className="text-sm text-green-700">
                Even if an attacker compromises the current key, they cannot decrypt messages that were encrypted with
                previous keys. Each key rotation creates a new cryptographic boundary, ensuring that past communications
                remain secure.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Security Benefits of Key Rotation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Forward Secrecy</span>
              </div>
              <p className="text-sm text-blue-700">
                Past communications remain secure even if current keys are compromised
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Limited Exposure</span>
              </div>
              <p className="text-sm text-green-700">
                Reduces the window of vulnerability by regularly refreshing cryptographic material
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Threat Mitigation</span>
              </div>
              <p className="text-sm text-purple-700">
                Automatically responds to security threats and key degradation over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
