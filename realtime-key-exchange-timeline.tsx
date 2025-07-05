"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, ArrowLeftRight, Lock, CheckCircle, Clock, Play, Pause, RotateCcw, User } from "lucide-react"

interface TimelineStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "in-progress" | "completed"
  timestamp?: string
  duration: number
  details: string[]
}

const initialSteps: TimelineStep[] = [
  {
    id: "private-keys",
    title: "Private Key Selection",
    description: "Alice and Bob each choose secret private keys",
    icon: <Key className="h-5 w-5" />,
    status: "pending",
    duration: 2000,
    details: [
      "Alice selects private key 'a' (random, kept secret)",
      "Bob selects private key 'b' (random, kept secret)",
      "Keys must be in range [1, p-1]",
      "Randomness is crucial for security",
    ],
  },
  {
    id: "public-keys",
    title: "Public Key Generation",
    description: "Calculate public keys using modular exponentiation",
    icon: <Lock className="h-5 w-5" />,
    status: "pending",
    duration: 3000,
    details: [
      "Alice computes A = g^a mod p",
      "Bob computes B = g^b mod p",
      "Uses efficient binary exponentiation",
      "Public keys can be shared openly",
    ],
  },
  {
    id: "key-exchange",
    title: "Public Key Exchange",
    description: "Alice and Bob exchange their public keys",
    icon: <ArrowLeftRight className="h-5 w-5" />,
    status: "pending",
    duration: 1500,
    details: [
      "Alice sends A to Bob over network",
      "Bob sends B to Alice over network",
      "Exchange occurs over insecure channel",
      "Eavesdroppers can see public keys",
    ],
  },
  {
    id: "shared-secret",
    title: "Shared Secret Computation",
    description: "Both parties derive the same shared secret",
    icon: <CheckCircle className="h-5 w-5" />,
    status: "pending",
    duration: 2500,
    details: [
      "Alice computes S = B^a mod p",
      "Bob computes S = A^b mod p",
      "Both get same result: S = g^(ab) mod p",
      "Shared secret ready for encryption",
    ],
  },
]

export function RealtimeKeyExchangeTimeline() {
  const [steps, setSteps] = useState<TimelineStep[]>(initialSteps)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [dhParams] = useState({ p: 23, g: 5 })
  const [keyData, setKeyData] = useState<{
    alicePrivate: number
    bobPrivate: number
    alicePublic: number
    bobPublic: number
    sharedSecret: number
  } | null>(null)

  const modPow = (base: number, exp: number, mod: number): number => {
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }

  const startTimeline = async () => {
    setIsRunning(true)
    setCurrentStepIndex(0)

    // Generate keys for demonstration
    const alicePrivate = Math.floor(Math.random() * (dhParams.p - 2)) + 1
    const bobPrivate = Math.floor(Math.random() * (dhParams.p - 2)) + 1

    const newSteps = [...initialSteps]

    for (let i = 0; i < newSteps.length; i++) {
      // Set current step to in-progress
      newSteps[i] = {
        ...newSteps[i],
        status: "in-progress",
        timestamp: new Date().toLocaleTimeString(),
      }
      setSteps([...newSteps])
      setCurrentStepIndex(i)

      // Simulate step processing
      await new Promise((resolve) => setTimeout(resolve, newSteps[i].duration))

      // Generate actual key data based on step
      if (i === 0) {
        // Private key selection
        setKeyData((prev) => ({ ...prev, alicePrivate, bobPrivate }) as any)
      } else if (i === 1) {
        // Public key generation
        const alicePublic = modPow(dhParams.g, alicePrivate, dhParams.p)
        const bobPublic = modPow(dhParams.g, bobPrivate, dhParams.p)
        setKeyData((prev) => ({ ...prev, alicePublic, bobPublic }) as any)
      } else if (i === 3) {
        // Shared secret computation
        const alicePublic = modPow(dhParams.g, alicePrivate, dhParams.p)
        const sharedSecret = modPow(alicePublic, bobPrivate, dhParams.p)
        setKeyData((prev) => ({ ...prev, sharedSecret }) as any)
      }

      // Mark as completed
      newSteps[i] = {
        ...newSteps[i],
        status: "completed",
      }
      setSteps([...newSteps])

      // Brief pause before next step
      if (i < newSteps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setIsRunning(false)
    setCurrentStepIndex(-1)
  }

  const pauseTimeline = () => {
    setIsRunning(false)
  }

  const resetTimeline = () => {
    setSteps(initialSteps.map((step) => ({ ...step, status: "pending", timestamp: undefined })))
    setIsRunning(false)
    setCurrentStepIndex(-1)
    setKeyData(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-slate-100 text-slate-600 border-slate-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case "pending":
        return <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Real-Time Key Exchange Timeline</h1>
        <p className="text-slate-600 max-w-3xl mx-auto mb-6">
          Watch the Diffie-Hellman key exchange process unfold step-by-step with real-time status updates and detailed
          explanations
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={startTimeline} disabled={isRunning} size="lg">
            <Play className="h-4 w-4 mr-2" />
            Start Exchange
          </Button>
          <Button onClick={pauseTimeline} disabled={!isRunning} variant="outline" size="lg">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button onClick={resetTimeline} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* DH Parameters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Diffie-Hellman Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Prime (p)</div>
              <div className="text-2xl font-bold font-mono">{dhParams.p}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Generator (g)</div>
              <div className="text-2xl font-bold font-mono">{dhParams.g}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Timeline</CardTitle>
              <CardDescription>Step-by-step process with real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start gap-6">
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500 ${
                          step.status === "completed"
                            ? "bg-green-100 border-green-500"
                            : step.status === "in-progress"
                              ? "bg-blue-100 border-blue-500 animate-pulse"
                              : "bg-slate-100 border-slate-300"
                        }`}
                      >
                        <div
                          className={`transition-colors duration-300 ${
                            step.status === "completed"
                              ? "text-green-600"
                              : step.status === "in-progress"
                                ? "text-blue-600"
                                : "text-slate-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 transition-all duration-300 ${
                          step.status === "in-progress" ? "scale-105" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-800">{step.title}</h3>
                          <div className="flex items-center gap-2">
                            {step.timestamp && (
                              <Badge variant="outline" className="text-xs">
                                {step.timestamp}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              {getStatusIcon(step.status)}
                              <Badge className={getStatusColor(step.status)}>
                                {step.status.replace("-", " ").toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-3">{step.description}</p>

                        {/* Details */}
                        <div
                          className={`transition-all duration-300 ${
                            step.status !== "pending" ? "opacity-100" : "opacity-60"
                          }`}
                        >
                          <div className="bg-slate-50 rounded-lg p-3">
                            <h4 className="font-medium text-slate-700 mb-2 text-sm">Technical Details:</h4>
                            <ul className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="text-sm text-slate-600 flex items-start gap-2">
                                  <span className="text-blue-500 mt-1 text-xs">▸</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Data Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Key Exchange Data
              </CardTitle>
              <CardDescription>Live cryptographic values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyData ? (
                <>
                  {/* Alice's Data */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Alice</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Private Key (a):</span>
                        <code className="bg-white px-1 rounded">{keyData.alicePrivate}</code>
                      </div>
                      {keyData.alicePublic && (
                        <div className="flex justify-between">
                          <span>Public Key (A):</span>
                          <code className="bg-white px-1 rounded">{keyData.alicePublic}</code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bob's Data */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Bob</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Private Key (b):</span>
                        <code className="bg-white px-1 rounded">{keyData.bobPrivate}</code>
                      </div>
                      {keyData.bobPublic && (
                        <div className="flex justify-between">
                          <span>Public Key (B):</span>
                          <code className="bg-white px-1 rounded">{keyData.bobPublic}</code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shared Secret */}
                  {keyData.sharedSecret && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Shared Secret</h4>
                      <div className="text-center">
                        <code className="bg-white px-2 py-1 rounded font-mono text-lg">{keyData.sharedSecret}</code>
                      </div>
                      <div className="text-xs text-purple-600 mt-1 text-center">
                        Both parties computed the same value!
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <Key className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Start the exchange to see live key data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Steps</span>
                  <span>
                    {steps.filter((s) => s.status === "completed").length} / {steps.length}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(steps.filter((s) => s.status === "completed").length / steps.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">{isRunning ? "Exchange in progress..." : "Ready to start"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
