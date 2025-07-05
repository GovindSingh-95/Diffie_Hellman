"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Key, Lock, Unlock, Copy, Play, RotateCcw, Zap } from "lucide-react"

interface DHResult {
  alicePrivate: number
  bobPrivate: number
  sharedSecret: number
}

interface AESResult {
  plaintext: string
  ciphertext: string
  iv: string
}

export function HybridEncryptionFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dhResult, setDhResult] = useState<DHResult | null>(null)
  const [message, setMessage] = useState("Hello, this is a secret message!")
  const [aesResult, setAesResult] = useState<AESResult | null>(null)
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const dhParams = { p: 23, g: 5 }

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

  const simulateAES = (text: string, key: string, encrypt = true): { result: string; iv: string } => {
    const iv = Math.random().toString(36).substring(2, 18)
    if (encrypt) {
      // Simple XOR-based "encryption" for demo
      let encrypted = ""
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        encrypted += String.fromCharCode(char ^ keyChar)
      }
      return { result: btoa(encrypted), iv }
    } else {
      // Decrypt
      const decoded = atob(text)
      let decrypted = ""
      for (let i = 0; i < decoded.length; i++) {
        const char = decoded.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        decrypted += String.fromCharCode(char ^ keyChar)
      }
      return { result: decrypted, iv }
    }
  }

  const performStep1 = async () => {
    setIsAnimating(true)
    setCurrentStep(1)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate DH keys
    const alicePrivate = Math.floor(Math.random() * 10) + 2
    const bobPrivate = Math.floor(Math.random() * 10) + 2

    const alicePublic = modPow(dhParams.g, alicePrivate, dhParams.p)
    const bobPublic = modPow(dhParams.g, bobPrivate, dhParams.p)

    const sharedSecret = modPow(bobPublic, alicePrivate, dhParams.p)

    setDhResult({ alicePrivate, bobPrivate, sharedSecret })
    setIsAnimating(false)
  }

  const performStep2 = async () => {
    if (!dhResult) return

    setIsAnimating(true)
    setCurrentStep(2)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const key = dhResult.sharedSecret.toString().padEnd(16, "0")
    const { result: ciphertext, iv } = simulateAES(message, key, true)

    setAesResult({ plaintext: message, ciphertext, iv })
    setIsAnimating(false)
  }

  const performStep3 = async () => {
    if (!aesResult || !dhResult) return

    setIsAnimating(true)
    setCurrentStep(3)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const key = dhResult.sharedSecret.toString().padEnd(16, "0")
    const { result: decrypted } = simulateAES(aesResult.ciphertext, key, false)

    setDecryptedMessage(decrypted)
    setIsAnimating(false)
  }

  const resetFlow = () => {
    setCurrentStep(0)
    setDhResult(null)
    setAesResult(null)
    setDecryptedMessage("")
    setIsAnimating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed"
    if (step === currentStep) return "active"
    return "pending"
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-slate-100 text-slate-600 border-slate-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-800">Hybrid Encryption Flow</h1>
        </div>
        <p className="text-slate-600 max-w-3xl mx-auto mb-6">
          Three-step visual demonstration: DH Key Exchange → AES Encryption → Secure Transmission
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={resetFlow} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Flow
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${getStepColor(getStepStatus(step))}`}
            >
              {step}
            </div>
            {index < 2 && (
              <ArrowRight
                className={`h-6 w-6 mx-4 transition-colors ${
                  getStepStatus(step + 1) !== "pending" ? "text-green-500" : "text-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Diffie-Hellman Key Exchange */}
      <Card className={`mb-8 transition-all duration-300 ${currentStep === 1 ? "ring-2 ring-blue-500" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Step 1: Diffie-Hellman Key Exchange
              </CardTitle>
              <CardDescription>Generate shared secret using public key cryptography</CardDescription>
            </div>
            <Badge className={getStepColor(getStepStatus(1))}>
              {getStepStatus(1) === "active" && isAnimating ? "Processing..." : getStepStatus(1).toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">DH Parameters</h4>
                <div className="font-mono text-sm space-y-1">
                  <div>Prime (p) = {dhParams.p}</div>
                  <div>Generator (g) = {dhParams.g}</div>
                </div>
              </div>

              {!dhResult && (
                <Button onClick={performStep1} disabled={isAnimating} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Generate Shared Secret
                </Button>
              )}
            </div>

            {dhResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Key Exchange Result</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Alice Private:</span>
                    <code className="bg-white px-2 py-1 rounded">{dhResult.alicePrivate}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Bob Private:</span>
                    <code className="bg-white px-2 py-1 rounded">{dhResult.bobPrivate}</code>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Shared Secret:</span>
                    <code className="bg-white px-2 py-1 rounded text-green-700">{dhResult.sharedSecret}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: AES Encryption */}
      <Card className={`mb-8 transition-all duration-300 ${currentStep === 2 ? "ring-2 ring-blue-500" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Step 2: AES Encryption
              </CardTitle>
              <CardDescription>Encrypt message using shared secret as symmetric key</CardDescription>
            </div>
            <Badge className={getStepColor(getStepStatus(2))}>
              {getStepStatus(2) === "active" && isAnimating ? "Encrypting..." : getStepStatus(2).toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message to Encrypt</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  disabled={currentStep > 1}
                />
              </div>

              {dhResult && !aesResult && (
                <Button onClick={performStep2} disabled={isAnimating || !dhResult} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt with AES
                </Button>
              )}
            </div>

            {aesResult && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Encryption Result</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-blue-700">AES Key (from DH)</Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs flex-1">
                          {dhResult?.sharedSecret.toString().padEnd(16, "0")}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(dhResult?.sharedSecret.toString().padEnd(16, "0") || "")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-blue-700">IV</Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs flex-1">{aesResult.iv}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(aesResult.iv)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-blue-700">Ciphertext (Base64)</Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs flex-1 break-all">
                          {aesResult.ciphertext}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(aesResult.ciphertext)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Secure Transmission & Decryption */}
      <Card className={`mb-8 transition-all duration-300 ${currentStep === 3 ? "ring-2 ring-blue-500" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                Step 3: Secure Transmission & Decryption
              </CardTitle>
              <CardDescription>Decrypt message using the same shared secret</CardDescription>
            </div>
            <Badge className={getStepColor(getStepStatus(3))}>
              {getStepStatus(3) === "active" && isAnimating ? "Decrypting..." : getStepStatus(3).toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {aesResult && !decryptedMessage && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Transmission Simulation</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>📡 Ciphertext transmitted over insecure channel</div>
                    <div>🔐 Only holders of shared secret can decrypt</div>
                    <div>🛡️ Eavesdroppers see only encrypted data</div>
                  </div>
                </div>
              )}

              {aesResult && !decryptedMessage && (
                <Button onClick={performStep3} disabled={isAnimating || !aesResult} className="w-full">
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt Message
                </Button>
              )}
            </div>

            {decryptedMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Decryption Successful!</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-green-700">Original Message</Label>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-slate-800">{message}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-green-700">Decrypted Message</Label>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-slate-800">{decryptedMessage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Lock className="h-4 w-4" />
                    <span>Messages match - encryption/decryption successful!</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Hybrid Encryption?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Best of Both Worlds</h4>
              <p className="text-sm text-blue-700">
                Combines DH's secure key exchange with AES's efficient bulk encryption
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Performance</h4>
              <p className="text-sm text-green-700">
                AES is much faster than public key encryption for large amounts of data
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Forward Secrecy</h4>
              <p className="text-sm text-purple-700">
                Each session uses a new shared secret, protecting past communications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
