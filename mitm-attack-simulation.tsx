"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, AlertTriangle, ArrowRight, Eye, RotateCcw, Play } from "lucide-react"

interface Actor {
  name: string
  privateKey: number
  publicKey: number
  sharedSecret: number | null
  color: string
}

interface AttackState {
  step: number
  isActive: boolean
  intercepted: boolean
  malloryKeys: { alice: number; bob: number }
}

export function MITMAttackSimulation() {
  const [actors, setActors] = useState<{ alice: Actor; bob: Actor; mallory: Actor }>({
    alice: { name: "Alice", privateKey: 6, publicKey: 0, sharedSecret: null, color: "blue" },
    bob: { name: "Bob", privateKey: 15, publicKey: 0, sharedSecret: null, color: "green" },
    mallory: { name: "Mallory", privateKey: 9, publicKey: 0, sharedSecret: null, color: "red" },
  })

  const [attack, setAttack] = useState<AttackState>({
    step: 0,
    isActive: false,
    intercepted: false,
    malloryKeys: { alice: 0, bob: 0 },
  })

  const [dhParams] = useState({ p: 23, g: 5 })
  const [animationStep, setAnimationStep] = useState(0)

  // Modular exponentiation
  const modPow = (base: number, exp: number, mod: number) => {
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }

  const startAttack = async () => {
    setAttack((prev) => ({ ...prev, isActive: true, step: 1 }))
    setAnimationStep(1)

    // Step 1: Generate public keys
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const alicePublic = modPow(dhParams.g, actors.alice.privateKey, dhParams.p)
    const bobPublic = modPow(dhParams.g, actors.bob.privateKey, dhParams.p)
    const malloryPublic = modPow(dhParams.g, actors.mallory.privateKey, dhParams.p)

    setActors((prev) => ({
      ...prev,
      alice: { ...prev.alice, publicKey: alicePublic },
      bob: { ...prev.bob, publicKey: bobPublic },
      mallory: { ...prev.mallory, publicKey: malloryPublic },
    }))

    // Step 2: Mallory intercepts
    setAnimationStep(2)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAttack((prev) => ({ ...prev, step: 2, intercepted: true }))

    // Step 3: Mallory establishes separate secrets
    setAnimationStep(3)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const malloryAliceSecret = modPow(alicePublic, actors.mallory.privateKey, dhParams.p)
    const malloryBobSecret = modPow(bobPublic, actors.mallory.privateKey, dhParams.p)

    setActors((prev) => ({
      ...prev,
      alice: { ...prev.alice, sharedSecret: malloryAliceSecret },
      bob: { ...prev.bob, sharedSecret: malloryBobSecret },
      mallory: { ...prev.mallory, sharedSecret: malloryAliceSecret }, // Can decrypt both
    }))

    setAttack((prev) => ({
      ...prev,
      step: 3,
      malloryKeys: { alice: malloryAliceSecret, bob: malloryBobSecret },
    }))

    setAnimationStep(4)
  }

  const resetSimulation = () => {
    setAttack({ step: 0, isActive: false, intercepted: false, malloryKeys: { alice: 0, bob: 0 } })
    setActors((prev) => ({
      alice: { ...prev.alice, publicKey: 0, sharedSecret: null },
      bob: { ...prev.bob, publicKey: 0, sharedSecret: null },
      mallory: { ...prev.mallory, publicKey: 0, sharedSecret: null },
    }))
    setAnimationStep(0)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Man-in-the-Middle Attack Simulation</h1>
        <p className="text-slate-600 max-w-3xl mx-auto mb-6">
          Watch how Mallory intercepts and manipulates the Diffie-Hellman key exchange between Alice and Bob
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={startAttack} disabled={attack.isActive} size="lg">
            <Play className="h-4 w-4 mr-2" />
            Start Attack
          </Button>
          <Button onClick={resetSimulation} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Attack Warning */}
      {attack.intercepted && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>MITM Attack Detected!</strong> Mallory has successfully intercepted the key exchange and can now
            decrypt all communications between Alice and Bob.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alice */}
        <Card className={`transition-all duration-500 ${animationStep >= 1 ? "ring-2 ring-blue-500" : ""}`}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-blue-700">Alice</CardTitle>
            <CardDescription>Sender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700 mb-1">Private Key</div>
              <div className="font-mono text-lg">{actors.alice.privateKey}</div>
            </div>

            {actors.alice.publicKey > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-1">Public Key</div>
                <div className="font-mono text-lg text-blue-800">{actors.alice.publicKey}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {dhParams.g}^{actors.alice.privateKey} mod {dhParams.p}
                </div>
              </div>
            )}

            {actors.alice.sharedSecret && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-1">Shared Secret (Compromised)</div>
                <div className="font-mono text-lg text-red-800">{actors.alice.sharedSecret}</div>
                <div className="text-xs text-red-600 mt-1">Mallory can decrypt this!</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mallory (Attacker) */}
        <Card className={`transition-all duration-500 ${animationStep >= 2 ? "ring-2 ring-red-500" : ""}`}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Mallory</CardTitle>
            <CardDescription>Attacker (MITM)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700 mb-1">Private Key</div>
              <div className="font-mono text-lg">{actors.mallory.privateKey}</div>
            </div>

            {actors.mallory.publicKey > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-1">Public Key</div>
                <div className="font-mono text-lg text-red-800">{actors.mallory.publicKey}</div>
              </div>
            )}

            {attack.intercepted && (
              <div className="space-y-2">
                <Badge variant="destructive" className="w-full justify-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Intercepting Keys
                </Badge>

                {attack.malloryKeys.alice > 0 && (
                  <div className="p-2 bg-red-100 rounded text-xs">
                    <div className="font-medium text-red-800">Secret with Alice: {attack.malloryKeys.alice}</div>
                    <div className="font-medium text-red-800">Secret with Bob: {attack.malloryKeys.bob}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bob */}
        <Card className={`transition-all duration-500 ${animationStep >= 1 ? "ring-2 ring-green-500" : ""}`}>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-700">Bob</CardTitle>
            <CardDescription>Receiver</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-700 mb-1">Private Key</div>
              <div className="font-mono text-lg">{actors.bob.privateKey}</div>
            </div>

            {actors.bob.publicKey > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-1">Public Key</div>
                <div className="font-mono text-lg text-green-800">{actors.bob.publicKey}</div>
                <div className="text-xs text-green-600 mt-1">
                  {dhParams.g}^{actors.bob.privateKey} mod {dhParams.p}
                </div>
              </div>
            )}

            {actors.bob.sharedSecret && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-1">Shared Secret (Compromised)</div>
                <div className="font-mono text-lg text-red-800">{actors.bob.sharedSecret}</div>
                <div className="text-xs text-red-600 mt-1">Mallory can decrypt this!</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attack Flow Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Attack Flow Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium">Alice</div>
            </div>

            <div className="flex-1 flex items-center justify-center space-x-4">
              <ArrowRight
                className={`h-6 w-6 transition-colors ${
                  animationStep >= 2 ? "text-red-500 animate-pulse" : "text-slate-400"
                }`}
              />
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    animationStep >= 2 ? "bg-red-100 animate-pulse" : "bg-slate-100"
                  }`}
                >
                  <Eye className={`h-6 w-6 ${animationStep >= 2 ? "text-red-600" : "text-slate-400"}`} />
                </div>
                <div className="text-sm font-medium">Mallory</div>
                <div className="text-xs text-red-600">Intercepting</div>
              </div>
              <ArrowRight
                className={`h-6 w-6 transition-colors ${
                  animationStep >= 2 ? "text-red-500 animate-pulse" : "text-slate-400"
                }`}
              />
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-medium">Bob</div>
            </div>
          </div>

          {attack.step >= 2 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">What Mallory Does:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Intercepts Alice's public key before it reaches Bob</li>
                <li>• Sends her own public key to Bob (pretending to be Alice)</li>
                <li>• Intercepts Bob's public key before it reaches Alice</li>
                <li>• Sends her own public key to Alice (pretending to be Bob)</li>
                <li>• Now has separate shared secrets with both Alice and Bob</li>
                <li>• Can decrypt, read, modify, and re-encrypt all messages</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How to Prevent MITM Attacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Authentication</h4>
              <p className="text-sm text-green-700">
                Use digital certificates or pre-shared keys to verify the identity of communication partners before key
                exchange.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Signed Key Exchange</h4>
              <p className="text-sm text-blue-700">
                Sign public keys with RSA or ECDSA to ensure they haven't been tampered with during transmission.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Certificate Authorities</h4>
              <p className="text-sm text-purple-700">
                Use trusted Certificate Authorities (CAs) to validate public keys, as done in TLS/SSL connections.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Key Fingerprints</h4>
              <p className="text-sm text-yellow-700">
                Compare key fingerprints through a separate, secure channel to verify key authenticity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
