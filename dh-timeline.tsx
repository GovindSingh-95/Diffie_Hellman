"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, ArrowLeftRight, Lock, CheckCircle, Clock, Play, RotateCcw } from "lucide-react"

interface TimelineStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "in-progress" | "completed"
  timestamp?: string
  details: string[]
}

const initialSteps: TimelineStep[] = [
  {
    id: "private-keys",
    title: "Private Key Selection",
    description: "Alice and Bob each choose a secret private key",
    icon: <Key className="h-5 w-5" />,
    status: "pending",
    details: [
      "Alice selects private key 'a' (kept secret)",
      "Bob selects private key 'b' (kept secret)",
      "Keys should be random and within valid range",
      "Private keys are never shared",
    ],
  },
  {
    id: "public-keys",
    title: "Public Key Generation",
    description: "Generate public keys using g^private mod p",
    icon: <Lock className="h-5 w-5" />,
    status: "pending",
    details: [
      "Alice calculates A = g^a mod p",
      "Bob calculates B = g^b mod p",
      "Public keys can be shared openly",
      "Based on discrete logarithm problem",
    ],
  },
  {
    id: "key-exchange",
    title: "Public Key Exchange",
    description: "Alice and Bob exchange their public keys",
    icon: <ArrowLeftRight className="h-5 w-5" />,
    status: "pending",
    details: [
      "Alice sends A to Bob",
      "Bob sends B to Alice",
      "Exchange happens over insecure channel",
      "Public keys are not secret",
    ],
  },
  {
    id: "shared-secret",
    title: "Shared Secret Derivation",
    description: "Both parties compute the same shared secret",
    icon: <CheckCircle className="h-5 w-5" />,
    status: "pending",
    details: [
      "Alice computes S = B^a mod p",
      "Bob computes S = A^b mod p",
      "Both get the same result: S = g^(ab) mod p",
      "Shared secret can be used for encryption",
    ],
  },
]

export function DHTimeline() {
  const [steps, setSteps] = useState<TimelineStep[]>(initialSteps)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)

  const startDemo = async () => {
    setIsRunning(true)
    setCurrentStepIndex(0)

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

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark as completed
      newSteps[i] = {
        ...newSteps[i],
        status: "completed",
      }
      setSteps([...newSteps])

      // Wait before next step
      if (i < newSteps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setIsRunning(false)
    setCurrentStepIndex(-1)
  }

  const resetDemo = () => {
    setSteps(initialSteps.map((step) => ({ ...step, status: "pending", timestamp: undefined })))
    setIsRunning(false)
    setCurrentStepIndex(-1)
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Diffie-Hellman Key Exchange Timeline</h1>
        <p className="text-slate-600 mb-6">Step-by-step visualization of the key exchange process</p>
        <div className="flex justify-center gap-4">
          <Button onClick={startDemo} disabled={isRunning} size="lg">
            <Play className="h-4 w-4 mr-2" />
            Start Demo
          </Button>
          <Button onClick={resetDemo} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-6">
              {/* Timeline dot */}
              <div
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300 ${
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

              {/* Content card */}
              <Card
                className={`flex-1 transition-all duration-300 ${
                  step.status === "in-progress" ? "shadow-lg scale-105" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
                      {step.timestamp && (
                        <Badge variant="outline" className="text-xs">
                          {step.timestamp}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      <Badge className={getStatusColor(step.status)}>
                        {step.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4">{step.description}</p>

                  {/* Details */}
                  <div
                    className={`transition-all duration-300 ${
                      step.status !== "pending" ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <h4 className="font-medium text-slate-700 mb-2">Technical Details:</h4>
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 text-xs">▸</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-600">
            {steps.filter((s) => s.status === "completed").length} / {steps.length} completed
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
      </div>
    </div>
  )
}
