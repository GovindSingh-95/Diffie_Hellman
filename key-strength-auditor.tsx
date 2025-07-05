"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, AlertTriangle, CheckCircle, Info, ExternalLink, Gauge } from "lucide-react"

interface SecurityAssessment {
  overallScore: number
  strength: "weak" | "medium" | "strong"
  bruteForceTime: string
  nistCompliant: boolean
  warnings: string[]
  recommendations: string[]
}

export function KeyStrengthAuditor() {
  const [p, setP] = useState("2357")
  const [g, setG] = useState("2")
  const [keyLength, setKeyLength] = useState("2048")
  const [assessment, setAssessment] = useState<SecurityAssessment | null>(null)

  const calculateBruteForceTime = (bits: number): string => {
    // Simplified calculation for demonstration
    const operations = Math.pow(2, bits - 1)
    const opsPerSecond = 1e12 // 1 trillion operations per second
    const seconds = operations / opsPerSecond

    if (seconds < 60) return `${seconds.toFixed(1)} seconds`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`
    if (seconds < 31536000000) return `${(seconds / 31536000).toFixed(1)} years`
    return `${(seconds / 31536000000).toFixed(1)} billion years`
  }

  const assessSecurity = () => {
    const primeP = Number.parseInt(p)
    const generator = Number.parseInt(g)
    const bits = Number.parseInt(keyLength)

    if (isNaN(primeP) || isNaN(generator) || isNaN(bits)) return

    let score = 0
    const warnings: string[] = []
    const recommendations: string[] = []

    // Assess prime size
    const primeBits = Math.floor(Math.log2(primeP)) + 1
    if (primeBits < 1024) {
      warnings.push("Prime is dangerously small - vulnerable to brute force")
      score += 10
    } else if (primeBits < 2048) {
      warnings.push("Prime size below current security standards")
      score += 30
    } else if (primeBits >= 2048 && primeBits < 3072) {
      score += 70
    } else {
      score += 90
    }

    // Assess key length
    if (bits < 1024) {
      warnings.push("Key length insufficient for any secure application")
      score = Math.min(score, 20)
    } else if (bits < 2048) {
      warnings.push("Key length below NIST recommendations")
      score = Math.min(score, 50)
    } else if (bits >= 3072) {
      score += 10
    }

    // Check generator
    if (generator < 2) {
      warnings.push("Generator must be at least 2")
      score = Math.min(score, 30)
    } else if (generator === 2 || generator === 5) {
      score += 5 // Common safe generators
    }

    // NIST compliance check
    const nistCompliant = primeBits >= 2048 && bits >= 2048 && generator >= 2

    // Generate recommendations
    if (primeBits < 2048) {
      recommendations.push("Use a prime of at least 2048 bits")
    }
    if (bits < 2048) {
      recommendations.push("Use key length of at least 2048 bits")
    }
    if (primeBits >= 2048 && bits >= 2048) {
      recommendations.push("Consider 3072-bit parameters for future-proofing")
    }
    if (!nistCompliant) {
      recommendations.push("Ensure compliance with NIST SP 800-57 guidelines")
    }

    // Determine strength level
    let strength: "weak" | "medium" | "strong"
    if (score >= 80) strength = "strong"
    else if (score >= 50) strength = "medium"
    else strength = "weak"

    const effectiveBits = Math.min(primeBits, bits)
    const bruteForceTime = calculateBruteForceTime(effectiveBits)

    setAssessment({
      overallScore: Math.min(100, score),
      strength,
      bruteForceTime,
      nistCompliant,
      warnings,
      recommendations,
    })
  }

  useEffect(() => {
    assessSecurity()
  }, [p, g, keyLength])

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-green-600 bg-green-100 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "weak":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-slate-600 bg-slate-100 border-slate-200"
    }
  }

  const getProgressColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-500"
      case "weak":
        return "bg-red-500"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gauge className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">Key Strength Auditor</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Analyze the security strength of your Diffie-Hellman parameters with real-time assessment and NIST
            compliance checking
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Parameters */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                DH Parameters
              </CardTitle>
              <CardDescription>Enter your Diffie-Hellman parameters for security analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prime-p" className="flex items-center gap-1">
                  Prime (p)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Large prime number used as the modulus. Should be at least 2048 bits for security.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="prime-p"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  placeholder="Enter prime number"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="generator-g" className="flex items-center gap-1">
                  Generator (g)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Primitive root modulo p. Common secure values are 2 and 5.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="generator-g"
                  value={g}
                  onChange={(e) => setG(e.target.value)}
                  placeholder="Enter generator"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-length" className="flex items-center gap-1">
                  Key Length (bits)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Length of private keys in bits. NIST recommends at least 2048 bits.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="key-length"
                  value={keyLength}
                  onChange={(e) => setKeyLength(e.target.value)}
                  placeholder="Enter key length"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Assessment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Security Assessment
              </CardTitle>
              <CardDescription>Real-time analysis of your parameter security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {assessment && (
                <>
                  {/* Overall Strength Meter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Security Strength</Label>
                      <Badge className={`${getStrengthColor(assessment.strength)} flex items-center gap-1`}>
                        {assessment.strength === "strong" && <CheckCircle className="h-3 w-3" />}
                        {assessment.strength === "medium" && <Shield className="h-3 w-3" />}
                        {assessment.strength === "weak" && <AlertTriangle className="h-3 w-3" />}
                        {assessment.strength.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={assessment.overallScore} className="h-4" />
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Weak</span>
                        <span>{assessment.overallScore}/100</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  </div>

                  {/* Brute Force Resistance */}
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-slate-600" />
                      <span className="font-medium text-slate-700">Estimated Brute Force Time</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{assessment.bruteForceTime}</div>
                    <div className="text-xs text-slate-600 mt-1">Time to break with current computing power</div>
                  </div>

                  {/* NIST Compliance */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <span className="font-medium text-slate-700">NIST SP 800-57 Compliant</span>
                    <Badge
                      className={
                        assessment.nistCompliant
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {assessment.nistCompliant ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {assessment.nistCompliant ? "YES" : "NO"}
                    </Badge>
                  </div>

                  {/* Warnings */}
                  {assessment.warnings.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Security Warnings
                      </Label>
                      <div className="space-y-1">
                        {assessment.warnings.map((warning, index) => (
                          <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {assessment.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Recommendations
                      </Label>
                      <div className="space-y-1">
                        {assessment.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700"
                          >
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* NIST Guidelines */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              NIST Security Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Current Standards (2024)</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Minimum 2048-bit prime modulus</li>
                  <li>• 2048-bit minimum key length</li>
                  <li>• Use verified safe primes</li>
                  <li>• Generator should be 2 or 5</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Recommended (Future-Proof)</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• 3072-bit prime for new systems</li>
                  <li>• 3072-bit key length</li>
                  <li>• Consider post-quantum alternatives</li>
                  <li>• Regular parameter updates</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Legacy Support</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• 1024-bit deprecated after 2013</li>
                  <li>• Phase out by 2030</li>
                  <li>• Upgrade existing systems</li>
                  <li>• Monitor security advisories</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
              <p className="text-sm text-slate-600">
                <strong>Note:</strong> These recommendations are based on NIST Special Publication 800-57 Part 1 Rev. 5.
                Security requirements may vary based on your specific use case and threat model. Always consult the
                latest NIST publications and your organization's security policies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
