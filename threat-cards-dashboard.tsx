"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, Users, Key, RotateCcw, Zap, Moon, Sun, Eye, Clock, Database } from "lucide-react"

interface ThreatCard {
  id: string
  name: string
  description: string
  impact: "critical" | "high" | "medium" | "low"
  likelihood: "very-high" | "high" | "medium" | "low"
  icon: React.ReactNode
  mitigation: string
  technicalDetails: string[]
  realWorldExample: string
}

const threats: ThreatCard[] = [
  {
    id: "mitm",
    name: "Man-in-the-Middle Attack",
    description: "Attacker intercepts and manipulates key exchange between parties",
    impact: "critical",
    likelihood: "high",
    icon: <Users className="h-5 w-5" />,
    mitigation: "Use authenticated key exchange with digital certificates or pre-shared keys",
    technicalDetails: [
      "Attacker positions between Alice and Bob",
      "Intercepts and replaces public keys",
      "Establishes separate shared secrets with each party",
      "Can decrypt, modify, and re-encrypt all messages",
    ],
    realWorldExample: "WiFi hotspot attacks where router intercepts HTTPS connections",
  },
  {
    id: "replay",
    name: "Replay Attack",
    description: "Attacker captures and replays previous key exchange messages",
    impact: "medium",
    likelihood: "medium",
    icon: <RotateCcw className="h-5 w-5" />,
    mitigation: "Implement timestamps, nonces, or sequence numbers for message freshness",
    technicalDetails: [
      "Old key exchange messages are captured",
      "Messages replayed at later time",
      "May force use of compromised keys",
      "Exploits lack of temporal validation",
    ],
    realWorldExample: "Network protocol attacks where old authentication tokens are reused",
  },
  {
    id: "weak-primes",
    name: "Weak Prime Numbers",
    description: "Using small or mathematically weak primes vulnerable to attacks",
    impact: "critical",
    likelihood: "low",
    icon: <Key className="h-5 w-5" />,
    mitigation: "Use large, cryptographically strong primes (2048+ bits) from trusted sources",
    technicalDetails: [
      "Small primes enable brute force attacks",
      "Smooth-order groups vulnerable to Pohlig-Hellman",
      "Some primes have known mathematical weaknesses",
      "Insufficient entropy in prime generation",
    ],
    realWorldExample: "Debian OpenSSL vulnerability (2008) with predictable random number generation",
  },
  {
    id: "no-auth",
    name: "No Authentication",
    description: "Basic DH provides no verification of communicating parties' identities",
    impact: "high",
    likelihood: "very-high",
    icon: <Shield className="h-5 w-5" />,
    mitigation: "Implement identity verification through PKI certificates or pre-shared secrets",
    technicalDetails: [
      "Cannot verify identity of communication partner",
      "Vulnerable to impersonation attacks",
      "No protection against active attackers",
      "Requires additional authentication layer",
    ],
    realWorldExample: "SSH first-time connections where host key fingerprints must be manually verified",
  },
  {
    id: "side-channel",
    name: "Side-Channel Attacks",
    description: "Extracting private keys through timing, power, or electromagnetic analysis",
    impact: "high",
    likelihood: "low",
    icon: <Eye className="h-5 w-5" />,
    mitigation: "Use constant-time implementations and hardware security modules",
    technicalDetails: [
      "Timing analysis of modular exponentiation",
      "Power consumption patterns reveal key bits",
      "Electromagnetic emanations leak information",
      "Cache timing attacks on software implementations",
    ],
    realWorldExample: "Smart card attacks measuring power consumption during cryptographic operations",
  },
  {
    id: "quantum",
    name: "Quantum Computing Threat",
    description: "Shor's algorithm can efficiently solve discrete logarithm problem",
    impact: "critical",
    likelihood: "low",
    icon: <Zap className="h-5 w-5" />,
    mitigation: "Transition to post-quantum cryptography algorithms",
    technicalDetails: [
      "Shor's algorithm breaks DH in polynomial time",
      "Large-scale quantum computers pose existential threat",
      "Current implementations vulnerable to future attacks",
      "Need for quantum-resistant alternatives",
    ],
    realWorldExample: "NIST Post-Quantum Cryptography standardization process for future-proof algorithms",
  },
  {
    id: "implementation",
    name: "Implementation Flaws",
    description: "Bugs and vulnerabilities in cryptographic library implementations",
    impact: "high",
    likelihood: "medium",
    icon: <Database className="h-5 w-5" />,
    mitigation: "Use well-audited cryptographic libraries and regular security updates",
    technicalDetails: [
      "Buffer overflows in key generation",
      "Incorrect parameter validation",
      "Memory leaks exposing sensitive data",
      "Race conditions in multi-threaded code",
    ],
    realWorldExample: "Heartbleed vulnerability in OpenSSL affecting millions of servers worldwide",
  },
  {
    id: "downgrade",
    name: "Protocol Downgrade",
    description: "Forcing use of weaker cryptographic parameters or older protocol versions",
    impact: "medium",
    likelihood: "medium",
    icon: <Clock className="h-5 w-5" />,
    mitigation: "Enforce minimum security standards and disable legacy protocol support",
    technicalDetails: [
      "Attacker manipulates protocol negotiation",
      "Forces use of weak key sizes or algorithms",
      "Exploits backward compatibility features",
      "Client/server accept insecure parameters",
    ],
    realWorldExample: "FREAK attack forcing TLS connections to use weak 512-bit RSA keys",
  },
]

export function ThreatCardsDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [filterImpact, setFilterImpact] = useState<string>("all")

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "very-high":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-slate-400"
    }
  }

  const filteredThreats = filterImpact === "all" ? threats : threats.filter((threat) => threat.impact === filterImpact)

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Cryptographic Threat Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Common attacks against Diffie-Hellman key exchange and their mitigations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="dark-mode" className="text-sm dark:text-slate-300">
                  Dark Mode
                </Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
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
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium dark:text-slate-300">Filter by Impact:</Label>
              <div className="flex gap-2">
                {["all", "critical", "high", "medium", "low"].map((impact) => (
                  <Button
                    key={impact}
                    variant={filterImpact === impact ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterImpact(impact)}
                    className="capitalize"
                  >
                    {impact}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredThreats.map((threat) => (
              <Card
                key={threat.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg dark:bg-slate-800 dark:border-slate-700 ${
                  selectedThreat === threat.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                }`}
                onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{threat.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg dark:text-slate-100">{threat.name}</CardTitle>
                        <CardDescription className="dark:text-slate-400 text-sm">{threat.description}</CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge className={`${getImpactColor(threat.impact)} flex items-center gap-1`}>
                      <AlertTriangle className="h-3 w-3" />
                      {threat.impact.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Likelihood:</span>
                      <div className={`w-3 h-3 rounded-full ${getLikelihoodColor(threat.likelihood)}`}></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">Mitigation:</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{threat.mitigation}</p>
                    </div>

                    {selectedThreat === threat.id && (
                      <div className="space-y-3 mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                            Technical Details:
                          </h4>
                          <ul className="space-y-1">
                            {threat.technicalDetails.map((detail, index) => (
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

                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">
                            Real-World Example:
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic">{threat.realWorldExample}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Statistics */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">Threat Landscape Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["critical", "high", "medium", "low"].map((impact) => (
                  <div key={impact} className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div
                      className={`text-2xl font-bold ${
                        impact === "critical"
                          ? "text-red-600 dark:text-red-400"
                          : impact === "high"
                            ? "text-orange-600 dark:text-orange-400"
                            : impact === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {threats.filter((t) => t.impact === impact).length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">{impact} Impact</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
