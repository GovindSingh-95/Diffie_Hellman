"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, AlertTriangle, CheckCircle, Info, ExternalLink, Key, Hash, Zap } from "lucide-react"

interface KeyStrengthAnalysis {
  score: number
  level: "weak" | "medium" | "strong"
  entropy: number
  recommendations: string[]
  warnings: string[]
}

export function KeyStrengthAnalyzer() {
  const [p, setP] = useState("23")
  const [g, setG] = useState("5")
  const [keyLength, setKeyLength] = useState("2048")
  const [analysis, setAnalysis] = useState<KeyStrengthAnalysis | null>(null)

  const analyzeKeyStrength = () => {
    const primeP = Number.parseInt(p)
    const generator = Number.parseInt(g)
    const bitLength = Number.parseInt(keyLength)

    if (isNaN(primeP) || isNaN(generator) || isNaN(bitLength)) {
      return
    }

    let score = 0
    let level: "weak" | "medium" | "strong" = "weak"
    const recommendations: string[] = []
    const warnings: string[] = []

    // Analyze prime size
    const primeBitLength = Math.floor(Math.log2(primeP)) + 1
    if (primeBitLength < 1024) {
      warnings.push("Prime is too small for secure use")
      score += 10
    } else if (primeBitLength < 2048) {
      warnings.push("Prime size below current recommendations")
      score += 30
    } else if (primeBitLength >= 2048) {
      score += 60
    }

    // Analyze key length
    if (bitLength < 1024) {
      warnings.push("Key length is insufficient for modern security")
      score += 5
    } else if (bitLength < 2048) {
      warnings.push("Key length below NIST recommendations")
      score += 15
    } else if (bitLength >= 2048) {
      score += 25
    }

    // Check if prime is likely safe
    if (primeP > 1000 && (primeP - 1) % 2 === 0) {
      const q = (primeP - 1) / 2
      if (q > 2) {
        score += 15
        recommendations.push("Prime appears to be a safe prime (p = 2q + 1)")
      }
    }

    // Calculate entropy estimate
    const entropy = Math.min(primeBitLength, bitLength)

    // Determine overall level
    if (score >= 80) {
      level = "strong"
    } else if (score >= 50) {
      level = "medium"
    } else {
      level = "weak"
    }

    // Add recommendations
    if (primeBitLength < 2048) {
      recommendations.push("Use a prime of at least 2048 bits")
    }
    if (bitLength < 2048) {
      recommendations.push("Use key length of at least 2048 bits")
    }
    if (generator < 2) {
      recommendations.push("Generator should be at least 2")
      warnings.push("Generator value is too small")
    }

    setAnalysis({
      score,
      level,
      entropy,
      recommendations,
      warnings,
    })
  }

  useEffect(() => {
    analyzeKeyStrength()
  }, [p, g, keyLength])

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "strong":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <Shield className="h-4 w-4" />
      case "weak":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getProgressColor = (level: string) => {
    switch (level) {
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
            <Key className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-800">DH Key Strength Analyzer</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Analyze the security strength of your Diffie-Hellman parameters and get recommendations for improvement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
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
                      <p>Large prime number used as the modulus</p>
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
                      <p>Primitive root modulo p, typically 2 or 5</p>
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
                      <p>Length of private keys in bits</p>
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

              <Button onClick={analyzeKeyStrength} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Analyze Security
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Analysis
              </CardTitle>
              <CardDescription>Strength assessment and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis && (
                <>
                  {/* Overall Strength */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Overall Strength</Label>
                      <Badge className={`${getLevelColor(analysis.level)} flex items-center gap-1`}>
                        {getLevelIcon(analysis.level)}
                        {analysis.level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={analysis.score} className="h-3" />
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Weak</span>
                        <span>{analysis.score}/100</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  </div>

                  {/* Entropy Estimate */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Entropy Estimate
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated bits of security provided</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <div className="text-2xl font-bold text-slate-700">~{analysis.entropy} bits</div>
                      <div className="text-sm text-slate-600">Effective security level</div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {analysis.warnings.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Security Warnings
                      </Label>
                      <div className="space-y-1">
                        {analysis.warnings.map((warning, index) => (
                          <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Recommendations
                      </Label>
                      <div className="space-y-1">
                        {analysis.recommendations.map((rec, index) => (
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

        {/* NIST Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              NIST Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Current Standards (2024)</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Minimum 2048-bit prime modulus</li>
                  <li>• 3072-bit recommended for new systems</li>
                  <li>• Use safe primes when possible</li>
                  <li>• Verify generator is primitive root</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Future-Proof (Post-2030)</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Consider post-quantum alternatives</li>
                  <li>• 4096-bit for long-term security</li>
                  <li>• Hybrid classical/quantum-resistant schemes</li>
                  <li>• Regular parameter updates</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Note:</strong> These recommendations are based on NIST SP 800-57 and may change as cryptographic
                research advances. Always consult the latest NIST publications for current guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
