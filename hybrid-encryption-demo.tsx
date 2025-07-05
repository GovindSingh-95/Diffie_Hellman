"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Copy, Key, Lock, Unlock, RefreshCw, CheckCircle, Play, Shield, AlertTriangle } from "lucide-react"

interface DHKeyExchange {
  alicePrivate: number
  bobPrivate: number
  alicePublic: number
  bobPublic: number
  sharedSecret: number
}

interface AESEncryption {
  plaintext: string
  key: string
  iv: string
  ciphertext: string
}

interface RealCryptoState {
  keyPair: CryptoKeyPair | null
  partnerPublicKey: CryptoKey | null
  sharedSecret: ArrayBuffer | null
  aesKey: CryptoKey | null
  encryptedData: { ciphertext: ArrayBuffer; iv: ArrayBuffer } | null
  decryptedText: string | null
}

// Modular exponentiation for educational demo
function modPow(base: number, exponent: number, modulus: number): number {
  let result = 1
  base = base % modulus
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus
    }
    exponent = Math.floor(exponent / 2)
    base = (base * base) % modulus
  }
  return result
}

// Simulated AES encryption for educational demo
function simulateAESEncrypt(plaintext: string, key: string): { ciphertext: string; iv: string } {
  const iv = Math.random().toString(36).substring(2, 18)
  let ciphertext = ""

  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext.charCodeAt(i)
    const keyChar = key.charCodeAt(i % key.length)
    const encrypted = (char + keyChar) % 256
    ciphertext += encrypted.toString(16).padStart(2, "0")
  }

  return { ciphertext, iv }
}

function simulateAESDecrypt(ciphertext: string, key: string): string {
  let plaintext = ""

  for (let i = 0; i < ciphertext.length; i += 2) {
    const hexByte = ciphertext.substring(i, i + 2)
    const encrypted = Number.parseInt(hexByte, 16)
    const keyChar = key.charCodeAt((i / 2) % key.length)
    const decrypted = (encrypted - keyChar + 256) % 256
    plaintext += String.fromCharCode(decrypted)
  }

  return plaintext
}

// Utility functions for real crypto
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function stringToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str)
}

function arrayBufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer)
}

export function HybridEncryptionDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [dhParams, setDhParams] = useState({ p: 23, g: 5 })
  const [dhKeys, setDhKeys] = useState<DHKeyExchange | null>(null)
  const [message, setMessage] = useState("Hello, this is a secret message!")
  const [encryption, setEncryption] = useState<AESEncryption | null>(null)
  const [decryptedMessage, setDecryptedMessage] = useState("")

  // Real crypto state
  const [realCrypto, setRealCrypto] = useState<RealCryptoState>({
    keyPair: null,
    partnerPublicKey: null,
    sharedSecret: null,
    aesKey: null,
    encryptedData: null,
    decryptedText: null,
  })
  const [cryptoSupported, setCryptoSupported] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check Web Crypto API support
  useState(() => {
    setCryptoSupported(typeof window !== "undefined" && "crypto" in window && "subtle" in window.crypto)
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Educational Demo Functions
  const generateDHKeys = () => {
    const alicePrivate = Math.floor(Math.random() * (dhParams.p - 2)) + 1
    const bobPrivate = Math.floor(Math.random() * (dhParams.p - 2)) + 1

    const alicePublic = modPow(dhParams.g, alicePrivate, dhParams.p)
    const bobPublic = modPow(dhParams.g, bobPrivate, dhParams.p)

    const sharedSecret = modPow(bobPublic, alicePrivate, dhParams.p)

    setDhKeys({
      alicePrivate,
      bobPrivate,
      alicePublic,
      bobPublic,
      sharedSecret,
    })

    setCurrentStep(2)
  }

  const encryptMessage = () => {
    if (!dhKeys) return

    const key = dhKeys.sharedSecret.toString().padEnd(16, "0")
    const { ciphertext, iv } = simulateAESEncrypt(message, key)

    setEncryption({
      plaintext: message,
      key,
      iv,
      ciphertext,
    })

    setCurrentStep(3)
  }

  const decryptMessage = () => {
    if (!encryption || !dhKeys) return

    const key = dhKeys.sharedSecret.toString().padEnd(16, "0")
    const decrypted = simulateAESDecrypt(encryption.ciphertext, key)

    setDecryptedMessage(decrypted)
  }

  // Real Crypto Functions
  const generateRealKeys = async () => {
    if (!cryptoSupported) return

    setIsProcessing(true)
    try {
      // Generate ECDH key pair
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      )

      // Simulate partner's key pair (in real scenario, this would come from the other party)
      const partnerKeyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      )

      setRealCrypto((prev) => ({
        ...prev,
        keyPair,
        partnerPublicKey: partnerKeyPair.publicKey,
      }))
    } catch (error) {
      console.error("Error generating keys:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const performRealKeyExchange = async () => {
    if (!realCrypto.keyPair || !realCrypto.partnerPublicKey) return

    setIsProcessing(true)
    try {
      // Derive AES key from ECDH shared secret
      const aesKey = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: realCrypto.partnerPublicKey,
        },
        realCrypto.keyPair.privateKey,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"],
      )

      // Also derive bits for display
      const sharedBits = await window.crypto.subtle.deriveBits(
        {
          name: "ECDH",
          public: realCrypto.partnerPublicKey,
        },
        realCrypto.keyPair.privateKey,
        256,
      )

      setRealCrypto((prev) => ({
        ...prev,
        aesKey,
        sharedSecret: sharedBits,
      }))
    } catch (error) {
      console.error("Error performing key exchange:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const encryptRealMessage = async () => {
    if (!realCrypto.aesKey) return

    setIsProcessing(true)
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
      const encodedMessage = stringToArrayBuffer(message)

      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        realCrypto.aesKey,
        encodedMessage,
      )

      setRealCrypto((prev) => ({
        ...prev,
        encryptedData: { ciphertext, iv: iv.buffer },
      }))
    } catch (error) {
      console.error("Error encrypting message:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const decryptRealMessage = async () => {
    if (!realCrypto.aesKey || !realCrypto.encryptedData) return

    setIsProcessing(true)
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: realCrypto.encryptedData.iv,
        },
        realCrypto.aesKey,
        realCrypto.encryptedData.ciphertext,
      )

      const decryptedText = arrayBufferToString(decryptedBuffer)
      setRealCrypto((prev) => ({
        ...prev,
        decryptedText,
      }))
    } catch (error) {
      console.error("Error decrypting message:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetDemo = () => {
    setCurrentStep(1)
    setDhKeys(null)
    setEncryption(null)
    setDecryptedMessage("")
    setRealCrypto({
      keyPair: null,
      partnerPublicKey: null,
      sharedSecret: null,
      aesKey: null,
      encryptedData: null,
      decryptedText: null,
    })
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed"
    if (step === currentStep) return "current"
    return "pending"
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-slate-100 text-slate-600 border-slate-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Hybrid Encryption Demo</h1>
        <p className="text-slate-600 max-w-3xl mx-auto mb-6">
          Compare educational simulation with real-world hybrid encryption using ECDH + AES-GCM
        </p>
        <Button onClick={resetDemo} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Demo
        </Button>
      </div>

      <Tabs defaultValue="educational" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="educational">Educational Demo</TabsTrigger>
          <TabsTrigger value="real">Real Cryptography</TabsTrigger>
        </TabsList>

        {/* Educational Demo */}
        <TabsContent value="educational" className="space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${getStepColor(getStepStatus(step))}`}
                >
                  {getStepStatus(step) === "completed" ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {index < 2 && <ArrowRight className="h-4 w-4 mx-4 text-slate-400" />}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {/* Step 1: Diffie-Hellman Key Exchange */}
            <Card className={currentStep === 1 ? "ring-2 ring-blue-500" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Step 1: Diffie-Hellman Key Exchange
                    </CardTitle>
                    <CardDescription>Generate a shared secret using public key cryptography</CardDescription>
                  </div>
                  <Badge className={getStepColor(getStepStatus(1))}>{getStepStatus(1).toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prime-p">Prime (p)</Label>
                    <Input
                      id="prime-p"
                      value={dhParams.p}
                      onChange={(e) => setDhParams((prev) => ({ ...prev, p: Number(e.target.value) }))}
                      className="font-mono"
                      disabled={currentStep > 1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="generator-g">Generator (g)</Label>
                    <Input
                      id="generator-g"
                      value={dhParams.g}
                      onChange={(e) => setDhParams((prev) => ({ ...prev, g: Number(e.target.value) }))}
                      className="font-mono"
                      disabled={currentStep > 1}
                    />
                  </div>
                </div>

                {dhKeys ? (
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Alice's Keys</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Private:</span>
                          <code className="bg-white px-1 rounded">{dhKeys.alicePrivate}</code>
                        </div>
                        <div className="flex justify-between">
                          <span>Public:</span>
                          <code className="bg-white px-1 rounded">{dhKeys.alicePublic}</code>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Bob's Keys</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Private:</span>
                          <code className="bg-white px-1 rounded">{dhKeys.bobPrivate}</code>
                        </div>
                        <div className="flex justify-between">
                          <span>Public:</span>
                          <code className="bg-white px-1 rounded">{dhKeys.bobPublic}</code>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 pt-2 border-t border-green-300">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-800">Shared Secret:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-2 py-1 rounded font-mono">{dhKeys.sharedSecret}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(dhKeys.sharedSecret.toString())}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button onClick={generateDHKeys} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Generate Keys & Shared Secret
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 2: AES Encryption */}
            <Card className={currentStep === 2 ? "ring-2 ring-blue-500" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Step 2: AES Encryption
                    </CardTitle>
                    <CardDescription>Encrypt the message using the shared secret as AES key</CardDescription>
                  </div>
                  <Badge className={getStepColor(getStepStatus(2))}>{getStepStatus(2).toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message to Encrypt</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your secret message..."
                    className="min-h-[80px]"
                    disabled={currentStep > 2}
                  />
                </div>

                {encryption ? (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-blue-800">AES Key (from DH)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-white px-2 py-1 rounded font-mono text-sm flex-1">{encryption.key}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(encryption.key)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-blue-800">Initialization Vector</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-white px-2 py-1 rounded font-mono text-sm flex-1">{encryption.iv}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(encryption.iv)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-blue-800">Ciphertext</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-white px-2 py-1 rounded font-mono text-sm flex-1 break-all">
                          {encryption.ciphertext}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(encryption.ciphertext)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button onClick={encryptMessage} disabled={!dhKeys || currentStep < 2} className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Encrypt Message with AES
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Decryption */}
            <Card className={currentStep === 3 ? "ring-2 ring-blue-500" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Unlock className="h-5 w-5" />
                      Step 3: Message Decryption
                    </CardTitle>
                    <CardDescription>Decrypt the message using the same shared secret</CardDescription>
                  </div>
                  <Badge className={getStepColor(getStepStatus(3))}>{getStepStatus(3).toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {decryptedMessage ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <Label className="text-green-800 font-semibold">Decrypted Message</Label>
                    <div className="mt-2 p-3 bg-white rounded border">
                      <p className="text-slate-800">{decryptedMessage}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Message successfully decrypted using shared secret!</span>
                    </div>
                  </div>
                ) : (
                  <Button onClick={decryptMessage} disabled={!encryption || currentStep < 3} className="w-full">
                    <Unlock className="h-4 w-4 mr-2" />
                    Decrypt Message
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real Cryptography Tab */}
        <TabsContent value="real" className="space-y-8">
          {!cryptoSupported && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Web Crypto API not supported</span>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  Real cryptography features require a modern browser with Web Crypto API support.
                </p>
              </CardContent>
            </Card>
          )}

          {cryptoSupported && (
            <div className="space-y-6">
              {/* Real Crypto Steps */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className={realCrypto.keyPair ? "ring-2 ring-green-500" : ""}>
                  <CardHeader>
                    <CardTitle className="text-sm">1. Generate ECDH Keys</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {realCrypto.keyPair ? (
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700">P-256 key pair generated</p>
                      </div>
                    ) : (
                      <Button onClick={generateRealKeys} disabled={isProcessing} className="w-full">
                        {isProcessing ? "Generating..." : "Generate Keys"}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className={realCrypto.aesKey ? "ring-2 ring-green-500" : ""}>
                  <CardHeader>
                    <CardTitle className="text-sm">2. Derive AES Key</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {realCrypto.aesKey ? (
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700">AES-256-GCM key derived</p>
                      </div>
                    ) : (
                      <Button
                        onClick={performRealKeyExchange}
                        disabled={!realCrypto.keyPair || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? "Deriving..." : "Derive Key"}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className={realCrypto.encryptedData ? "ring-2 ring-green-500" : ""}>
                  <CardHeader>
                    <CardTitle className="text-sm">3. Encrypt Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {realCrypto.encryptedData ? (
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700">Message encrypted</p>
                      </div>
                    ) : (
                      <Button
                        onClick={encryptRealMessage}
                        disabled={!realCrypto.aesKey || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? "Encrypting..." : "Encrypt"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Real Crypto Details */}
              {realCrypto.sharedSecret && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Real Cryptographic Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>ECDH Shared Secret (256-bit)</Label>
                      <div className="font-mono text-xs bg-slate-50 p-2 rounded border break-all">
                        {arrayBufferToHex(realCrypto.sharedSecret)}
                      </div>
                    </div>

                    {realCrypto.encryptedData && (
                      <>
                        <div>
                          <Label>AES-GCM IV (96-bit)</Label>
                          <div className="font-mono text-xs bg-slate-50 p-2 rounded border break-all">
                            {arrayBufferToHex(realCrypto.encryptedData.iv)}
                          </div>
                        </div>
                        <div>
                          <Label>Encrypted Message</Label>
                          <div className="font-mono text-xs bg-slate-50 p-2 rounded border break-all">
                            {arrayBufferToHex(realCrypto.encryptedData.ciphertext)}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={decryptRealMessage}
                        disabled={!realCrypto.encryptedData || isProcessing}
                        className="flex-1"
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        {isProcessing ? "Decrypting..." : "Decrypt Message"}
                      </Button>
                    </div>

                    {realCrypto.decryptedText && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <Label className="text-green-800 font-semibold">Decrypted Message</Label>
                        <div className="mt-2 p-3 bg-white rounded border">
                          <p className="text-slate-800">{realCrypto.decryptedText}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>Real AES-GCM decryption successful!</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Technical Specifications */}
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle>Real-World Implementation Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>Key Exchange:</strong> ECDH with P-256 curve (equivalent to 3072-bit RSA)
                  </p>
                  <p>
                    <strong>Symmetric Encryption:</strong> AES-256-GCM (authenticated encryption)
                  </p>
                  <p>
                    <strong>Key Derivation:</strong> Direct ECDH shared secret → AES key
                  </p>
                  <p>
                    <strong>IV Generation:</strong> Cryptographically secure random 96-bit IV
                  </p>
                  <p>
                    <strong>Security Features:</strong> Forward secrecy, authenticated encryption, timing attack
                    resistance
                  </p>
                  <p>
                    <strong>Standards:</strong> NIST-approved algorithms, used in TLS 1.3, Signal Protocol
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
