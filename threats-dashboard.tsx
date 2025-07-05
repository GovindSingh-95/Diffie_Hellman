"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Shield, AlertTriangle, Users, Key, RotateCcw, Zap } from "lucide-react"

interface Threat {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  icon: React.ReactNode
  mitigation: string
  details: string[]
}

const threats: Threat[] = [
  {
    id: "mitm",
    title: "Man-in-the-Middle",
    description: "Attacker intercepts and potentially modifies communication between parties",
    impact: "high",
    icon: <Users className="h-5 w-5" />,
    mitigation: "Use authenticated key exchange (e.g., certificates, digital signatures)",
    details: [
      "Attacker positions themselves between Alice and Bob",
      "Intercepts public key exchange",
      "Can establish separate shared secrets with each party",
      "Parties believe they're communicating securely",
    ],
  },
  {
    id: "weak-primes",
    title: "Weak Prime Numbers",
    description: "Using small or specially constructed primes that are vulnerable to attacks",
    impact: "high",
    icon: <Key className="h-5 w-5" />,
    mitigation: "Use large, cryptographically strong primes (2048+ bits) from trusted sources",
    details: [
      "Small primes allow brute force attacks",
      "Some primes have mathematical weaknesses",
      "Pohlig-Hellman attack on smooth order groups",
      "Use safe primes (p = 2q + 1 where q is also prime)",
    ],
  },
  {
    id: "no-auth",
    title: "No Authentication",
    description: "Basic DH provides no authentication of the communicating parties",
    impact: "medium",
    icon: <Shield className="h-5 w-5" />,
    mitigation: "Implement identity verification through certificates or pre-shared keys",
    details: [
      "Cannot verify identity of communication partner",
      "Vulnerable to impersonation attacks",
      "No protection against active attackers",
      "Need additional authentication layer",
    ],
  },
  {
    id: "replay",
    title: "Replay Attacks",
    description: "Attacker captures and replays previous key exchange messages",
    impact: "medium",
    icon: <RotateCcw className="h-5 w-5" />,
    mitigation: "Use timestamps, nonces, or sequence numbers to ensure message freshness",
    details: [
      "Old messages can be replayed by attackers",
      "May lead to using compromised keys",
      "Lack of message freshness verification",
      "Can be combined with other attacks",
    ],
  },
]

export function ThreatsDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Zap className="h-4 w-4" />
      case "low":
        return <Shield className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Diffie-Hellman Security Threats
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Understanding vulnerabilities and mitigation strategies
              </p>
            </div>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="outline"
              size="icon"
              className="dark:border-slate-700"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Threats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {threats.map((threat) => (
              <Card
                key={threat.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg dark:bg-slate-800 dark:border-slate-700 ${
                  selectedThreat === threat.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                }`}
                onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{threat.icon}</div>
                      <div>
                        <CardTitle className="text-lg dark:text-slate-100">{threat.title}</CardTitle>
                        <CardDescription className="dark:text-slate-400">{threat.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getImpactColor(threat.impact)} flex items-center gap-1`}>
                      {getImpactIcon(threat.impact)}
                      {threat.impact.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">
                        Mitigation Strategy:
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{threat.mitigation}</p>
                    </div>

                    {selectedThreat === threat.id && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                          Technical Details:
                        </h4>
                        <ul className="space-y-1">
                          {threat.details.map((detail, index) => (
                            <li
                              key={index}
                              className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                            >
                              <span className="text-blue-500 mt-1">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">Threat Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {threats.filter((t) => t.impact === "high").length}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">High Impact Threats</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {threats.filter((t) => t.impact === "medium").length}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">Medium Impact Threats</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {threats.filter((t) => t.impact === "low").length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Low Impact Threats</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
