"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Key, Lock, Users, Shield, AlertTriangle } from "lucide-react"

// Educational DH parameters (small for learning)
const EDUCATIONAL_P = 23
const EDUCATIONAL_G = 5

// Real crypto key pair type
interface CryptoKeyPairWithExport {
  publicKey: CryptoKey
  privateKey: CryptoKey
  publicKeyRaw?: ArrayBuffer
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

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

export default function DiffieHellmanDemo() {
  // Educational DH state
  const [alicePrivateKey, setAlicePrivateKey] = useState<string>("")
  const [bobPrivateKey, setBobPrivateKey] = useState<string>("")
  const [alicePublicKey, setAlicePublicKey] = useState<number | null>(null)
  const [bobPublicKey, setBobPublicKey] = useState<number | null>(null)
  const [aliceSharedSecret, setAliceSharedSecret] = useState<number | null>(null)
  const [bobSharedSecret, setBobSharedSecret] = useState<number | null>(null)
  const [educationalExchangeComplete, setEducationalExchangeComplete] = useState(false)

  // Real crypto state
  const [aliceRealKeys, setAliceRealKeys] = useState<CryptoKeyPairWithExport | null>(null)
  const [bobRealKeys, setBobRealKeys] = useState<CryptoKeyPairWithExport | null>(null)
  const [aliceRealSharedSecret, setAliceRealSharedSecret] = useState<string | null>(null)
  const [bobRealSharedSecret, setBobRealSharedSecret] = useState<string | null>(null)
  const [realExchangeComplete, setRealExchangeComplete] = useState(false)
  const [cryptoSupported, setCryptoSupported] = useState(true)
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)

  // Check Web Crypto API support
  useEffect(() => {
    setCryptoSupported(
      typeof window !== "undefined" &&
        "crypto" in window &&
        "subtle" in window.crypto &&
        "generateKey" in window.crypto.subtle,
    )
  }, [])

  // Educational DH: Generate public keys when private keys change
  useEffect(() => {
    if (alicePrivateKey && !isNaN(Number(alicePrivateKey))) {
      const privateKey = Number(alicePrivateKey)
      if (privateKey > 0 && privateKey < EDUCATIONAL_P) {
        setAlicePublicKey(modPow(EDUCATIONAL_G, privateKey, EDUCATIONAL_P))
      } else {
        setAlicePublicKey(null)
      }
    } else {
      setAlicePublicKey(null)
    }
  }, [alicePrivateKey])

  useEffect(() => {
    if (bobPrivateKey && !isNaN(Number(bobPrivateKey))) {
      const privateKey = Number(bobPrivateKey)
      if (privateKey > 0 && privateKey < EDUCATIONAL_P) {
        setBobPublicKey(modPow(EDUCATIONAL_G, privateKey, EDUCATIONAL_P))
      } else {
        setBobPublicKey(null)
      }
    } else {
      setBobPublicKey(null)
    }
  }, [bobPrivateKey])

  // Educational key exchange
  const performEducationalKeyExchange = () => {
    if (alicePublicKey && bobPublicKey && alicePrivateKey && bobPrivateKey) {
      const aliceSecret = modPow(bobPublicKey, Number(alicePrivateKey), EDUCATIONAL_P)
      const bobSecret = modPow(alicePublicKey, Number(bobPrivateKey), EDUCATIONAL_P)

      setAliceSharedSecret(aliceSecret)
      setBobSharedSecret(bobSecret)
      setEducationalExchangeComplete(true)
    }
  }

  // Real crypto: Generate ECDH key pairs
  const generateRealKeyPairs = async () => {
    if (!cryptoSupported) return

    setIsGeneratingKeys(true)
    try {
      // Generate Alice's key pair
      const aliceKeyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true, // extractable
        ["deriveKey", "deriveBits"],
      )

      // Generate Bob's key pair
      const bobKeyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true, // extractable
        ["deriveKey", "deriveBits"],
      )

      // Export public keys for display
      const alicePublicKeyRaw = await window.crypto.subtle.exportKey("raw", aliceKeyPair.publicKey)
      const bobPublicKeyRaw = await window.crypto.subtle.exportKey("raw", bobKeyPair.publicKey)

      setAliceRealKeys({
        ...aliceKeyPair,
        publicKeyRaw: alicePublicKeyRaw,
      })

      setBobRealKeys({
        ...bobKeyPair,
        publicKeyRaw: bobPublicKeyRaw,
      })
    } catch (error) {
      console.error("Error generating key pairs:", error)
    } finally {
      setIsGeneratingKeys(false)
    }
  }

  // Real crypto: Perform ECDH key exchange
  const performRealKeyExchange = async () => {
    if (!aliceRealKeys || !bobRealKeys || !cryptoSupported) return

    try {
      // Alice derives shared secret using Bob's public key
      const aliceSharedBits = await window.crypto.subtle.deriveBits(
        {
          name: "ECDH",
          public: bobRealKeys.publicKey,
        },
        aliceRealKeys.privateKey,
        256, // 256 bits
      )

      // Bob derives shared secret using Alice's public key
      const bobSharedBits = await window.crypto.subtle.deriveBits(
        {
          name: "ECDH",
          public: aliceRealKeys.publicKey,
        },
        bobRealKeys.privateKey,
        256, // 256 bits
      )

      // Convert to hex for display
      const aliceSecretHex = arrayBufferToHex(aliceSharedBits)
      const bobSecretHex = arrayBufferToHex(bobSharedBits)

      setAliceRealSharedSecret(aliceSecretHex)
      setBobRealSharedSecret(bobSecretHex)
      setRealExchangeComplete(true)
    } catch (error) {
      console.error("Error performing key exchange:", error)
    }
  }

  const resetDemo = () => {
    // Reset educational demo
    setAlicePrivateKey("")
    setBobPrivateKey("")
    setAlicePublicKey(null)
    setBobPublicKey(null)
    setAliceSharedSecret(null)
    setBobSharedSecret(null)
    setEducationalExchangeComplete(false)

    // Reset real crypto demo
    setAliceRealKeys(null)
    setBobRealKeys(null)
    setAliceRealSharedSecret(null)
    setBobRealSharedSecret(null)
    setRealExchangeComplete(false)
  }

  const canPerformEducationalExchange = alicePublicKey !== null && bobPublicKey !== null && !educationalExchangeComplete
  const canPerformRealExchange = aliceRealKeys && bobRealKeys && !realExchangeComplete

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-slate-600" />
            <h1 className="text-3xl font-bold text-slate-800">Diffie-Hellman Key Exchange</h1>
          </div>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Compare educational simulation with real-world cryptography using Web Crypto API
          </p>
        </div>

        <Tabs defaultValue="educational" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="educational" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Educational Demo
            </TabsTrigger>
            <TabsTrigger value="real" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Real Cryptography
            </TabsTrigger>
          </TabsList>

          {/* Educational Demo Tab */}
          <TabsContent value="educational" className="space-y-8">
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Key className="h-5 w-5" />
                  Educational Simulation
                </CardTitle>
                <CardDescription>
                  Learn DH concepts with small numbers: p = {EDUCATIONAL_P}, g = {EDUCATIONAL_G}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Educational Split Screen */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Alice's Side */}
              <Card className="border-2 border-rose-200 bg-rose-50/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-rose-600">A</span>
                  </div>
                  <CardTitle className="text-rose-700">Alice</CardTitle>
                  <CardDescription>Initiating secure key exchange</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="alice-private" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Private Key (1-{EDUCATIONAL_P - 1})
                    </Label>
                    <Input
                      id="alice-private"
                      type="number"
                      min="1"
                      max={EDUCATIONAL_P - 1}
                      value={alicePrivateKey}
                      onChange={(e) => setAlicePrivateKey(e.target.value)}
                      placeholder="Enter private key"
                      className="text-center font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Public Key
                    </Label>
                    <div className="p-3 bg-white rounded-md border text-center font-mono">
                      {alicePublicKey !== null ? (
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {alicePublicKey}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">Enter private key to generate</span>
                      )}
                    </div>
                    {alicePublicKey !== null && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        Calculation: {EDUCATIONAL_G}^{alicePrivateKey} mod {EDUCATIONAL_P} = {alicePublicKey}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4" />
                      Shared Secret
                    </Label>
                    <div className="p-3 bg-white rounded-md border text-center font-mono">
                      {aliceSharedSecret !== null ? (
                        <Badge variant="default" className="text-lg px-4 py-2 bg-green-600">
                          {aliceSharedSecret}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">Waiting for key exchange</span>
                      )}
                    </div>
                    {aliceSharedSecret !== null && bobPublicKey && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        Calculation: {bobPublicKey}^{alicePrivateKey} mod {EDUCATIONAL_P} = {aliceSharedSecret}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Bob's Side */}
              <Card className="border-2 border-emerald-200 bg-emerald-50/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-emerald-600">B</span>
                  </div>
                  <CardTitle className="text-emerald-700">Bob</CardTitle>
                  <CardDescription>Receiving secure key exchange</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bob-private" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Private Key (1-{EDUCATIONAL_P - 1})
                    </Label>
                    <Input
                      id="bob-private"
                      type="number"
                      min="1"
                      max={EDUCATIONAL_P - 1}
                      value={bobPrivateKey}
                      onChange={(e) => setBobPrivateKey(e.target.value)}
                      placeholder="Enter private key"
                      className="text-center font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Public Key
                    </Label>
                    <div className="p-3 bg-white rounded-md border text-center font-mono">
                      {bobPublicKey !== null ? (
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {bobPublicKey}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">Enter private key to generate</span>
                      )}
                    </div>
                    {bobPublicKey !== null && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        Calculation: {EDUCATIONAL_G}^{bobPrivateKey} mod {EDUCATIONAL_P} = {bobPublicKey}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4" />
                      Shared Secret
                    </Label>
                    <div className="p-3 bg-white rounded-md border text-center font-mono">
                      {bobSharedSecret !== null ? (
                        <Badge variant="default" className="text-lg px-4 py-2 bg-green-600">
                          {bobSharedSecret}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">Waiting for key exchange</span>
                      )}
                    </div>
                    {bobSharedSecret !== null && alicePublicKey && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        Calculation: {alicePublicKey}^{bobPrivateKey} mod {EDUCATIONAL_P} = {bobSharedSecret}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Educational Controls */}
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={performEducationalKeyExchange}
                  disabled={!canPerformEducationalExchange}
                  size="lg"
                  className="px-8"
                >
                  <ArrowLeftRight className="h-5 w-5 mr-2" />
                  Exchange Keys
                </Button>
                <Button onClick={resetDemo} variant="outline" size="lg" className="px-8 bg-transparent">
                  Reset Demo
                </Button>
              </div>

              {educationalExchangeComplete && aliceSharedSecret === bobSharedSecret && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                  <p className="text-green-700 font-medium">
                    ✅ Educational exchange successful! Both parties share secret: {aliceSharedSecret}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Real Cryptography Tab */}
          <TabsContent value="real" className="space-y-8">
            <Card className="bg-purple-50/50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Shield className="h-5 w-5" />
                  Real-World Cryptography
                </CardTitle>
                <CardDescription>
                  ECDH (Elliptic Curve Diffie-Hellman) using Web Crypto API with P-256 curve
                </CardDescription>
              </CardHeader>
            </Card>

            {!cryptoSupported && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Web Crypto API not supported in this environment</span>
                  </div>
                  <p className="text-red-600 text-sm mt-2">
                    Real cryptography features require a modern browser with Web Crypto API support.
                  </p>
                </CardContent>
              </Card>
            )}

            {cryptoSupported && (
              <>
                {/* Real Crypto Split Screen */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Alice's Real Keys */}
                  <Card className="border-2 border-purple-200 bg-purple-50/50">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">A</span>
                      </div>
                      <CardTitle className="text-purple-700">Alice (Real Crypto)</CardTitle>
                      <CardDescription>ECDH P-256 Key Pair</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Public Key (P-256 Point)
                        </Label>
                        <div className="p-3 bg-white rounded-md border">
                          {aliceRealKeys?.publicKeyRaw ? (
                            <div className="font-mono text-xs break-all">
                              {arrayBufferToHex(aliceRealKeys.publicKeyRaw).substring(0, 64)}...
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Generate keys to see public key</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <ArrowLeftRight className="h-4 w-4" />
                          Shared Secret (256-bit)
                        </Label>
                        <div className="p-3 bg-white rounded-md border">
                          {aliceRealSharedSecret ? (
                            <div className="font-mono text-xs break-all text-green-700">
                              {aliceRealSharedSecret.substring(0, 32)}...
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Waiting for key exchange</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bob's Real Keys */}
                  <Card className="border-2 border-indigo-200 bg-indigo-50/50">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-indigo-600">B</span>
                      </div>
                      <CardTitle className="text-indigo-700">Bob (Real Crypto)</CardTitle>
                      <CardDescription>ECDH P-256 Key Pair</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Public Key (P-256 Point)
                        </Label>
                        <div className="p-3 bg-white rounded-md border">
                          {bobRealKeys?.publicKeyRaw ? (
                            <div className="font-mono text-xs break-all">
                              {arrayBufferToHex(bobRealKeys.publicKeyRaw).substring(0, 64)}...
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Generate keys to see public key</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <ArrowLeftRight className="h-4 w-4" />
                          Shared Secret (256-bit)
                        </Label>
                        <div className="p-3 bg-white rounded-md border">
                          {bobRealSharedSecret ? (
                            <div className="font-mono text-xs break-all text-green-700">
                              {bobRealSharedSecret.substring(0, 32)}...
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Waiting for key exchange</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Real Crypto Controls */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={generateRealKeyPairs}
                      disabled={isGeneratingKeys || (aliceRealKeys && bobRealKeys)}
                      size="lg"
                      className="px-8"
                    >
                      {isGeneratingKeys ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Keys...
                        </>
                      ) : (
                        <>
                          <Key className="h-5 w-5 mr-2" />
                          Generate Real Key Pairs
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={performRealKeyExchange}
                      disabled={!canPerformRealExchange}
                      size="lg"
                      className="px-8"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Perform ECDH Exchange
                    </Button>
                    <Button onClick={resetDemo} variant="outline" size="lg" className="px-8 bg-transparent">
                      Reset Demo
                    </Button>
                  </div>

                  {realExchangeComplete && aliceRealSharedSecret === bobRealSharedSecret && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                      <p className="text-green-700 font-medium mb-2">
                        ✅ Real ECDH exchange successful! Both parties derived the same 256-bit shared secret.
                      </p>
                      <div className="text-xs text-green-600 font-mono bg-green-100 p-2 rounded">
                        Full shared secret: {aliceRealSharedSecret}
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Details */}
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-slate-700">Real Cryptography Details</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 space-y-2">
                    <p>
                      <strong>Algorithm:</strong> ECDH (Elliptic Curve Diffie-Hellman)
                    </p>
                    <p>
                      <strong>Curve:</strong> P-256 (secp256r1) - NIST recommended curve
                    </p>
                    <p>
                      <strong>Key Size:</strong> 256-bit private keys, 512-bit public keys (uncompressed)
                    </p>
                    <p>
                      <strong>Shared Secret:</strong> 256-bit derived using ECDH key agreement
                    </p>
                    <p>
                      <strong>Security:</strong> Equivalent to ~3072-bit RSA, quantum-resistant until large quantum
                      computers
                    </p>
                    <p>
                      <strong>Use Cases:</strong> TLS, Signal Protocol, Bitcoin, modern secure messaging
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Comparison */}
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-slate-700">Educational vs Real-World Comparison</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Educational Demo</h4>
                <ul className="space-y-1">
                  <li>• Small prime (p=23) for easy calculation</li>
                  <li>• Visible private keys for learning</li>
                  <li>• Manual modular arithmetic</li>
                  <li>• Vulnerable to brute force</li>
                  <li>• Perfect for understanding concepts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-700 mb-2">Real Cryptography</h4>
                <ul className="space-y-1">
                  <li>• 256-bit elliptic curve (P-256)</li>
                  <li>• Private keys never exposed</li>
                  <li>• Hardware-accelerated operations</li>
                  <li>• Cryptographically secure</li>
                  <li>• Production-ready implementation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
