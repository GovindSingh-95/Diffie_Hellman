"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Key, Shield, Copy, FileSignature } from "lucide-react"

interface RSAKeyPair {
  publicKey: { n: number; e: number }
  privateKey: { n: number; d: number }
}

interface SignatureData {
  message: string
  signature: string
  verified: boolean | null
}

export function SignedKeyExchange() {
  const [alicePublicKey, setAlicePublicKey] = useState("8")
  const [bobPublicKey, setBobPublicKey] = useState("18")
  const [rsaKeys] = useState<RSAKeyPair>({
    publicKey: { n: 3233, e: 17 },
    privateKey: { n: 3233, d: 2753 },
  })
  const [signatures, setSignatures] = useState<{ alice: SignatureData; bob: SignatureData }>({
    alice: { message: "", signature: "", verified: null },
    bob: { message: "", signature: "", verified: null },
  })

  // Simplified RSA signing (for demo purposes)
  const rsaSign = (message: string, privateKey: { n: number; d: number }): string => {
    // Convert message to number (simplified)
    let messageNum = 0
    for (let i = 0; i < message.length; i++) {
      messageNum += message.charCodeAt(i) * Math.pow(256, i % 4)
    }
    messageNum = messageNum % privateKey.n

    // Sign: signature = message^d mod n
    const signature = modPow(messageNum, privateKey.d, privateKey.n)
    return btoa(signature.toString()) // Base64 encode
  }

  const rsaVerify = (message: string, signature: string, publicKey: { n: number; e: number }): boolean => {
    try {
      const signatureNum = Number.parseInt(atob(signature))

      // Convert message to number (same as signing)
      let messageNum = 0
      for (let i = 0; i < message.length; i++) {
        messageNum += message.charCodeAt(i) * Math.pow(256, i % 4)
      }
      messageNum = messageNum % publicKey.n

      // Verify: decrypted = signature^e mod n
      const decrypted = modPow(signatureNum, publicKey.e, publicKey.n)
      return decrypted === messageNum
    } catch {
      return false
    }
  }

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

  const signKey = (actor: "alice" | "bob") => {
    const publicKey = actor === "alice" ? alicePublicKey : bobPublicKey
    const message = `DH_PUBLIC_KEY:${publicKey}`
    const signature = rsaSign(message, rsaKeys.privateKey)

    setSignatures((prev) => ({
      ...prev,
      [actor]: { message, signature, verified: null },
    }))
  }

  const verifySignature = (actor: "alice" | "bob") => {
    const signatureData = signatures[actor]
    const verified = rsaVerify(signatureData.message, signatureData.signature, rsaKeys.publicKey)

    setSignatures((prev) => ({
      ...prev,
      [actor]: { ...prev[actor], verified },
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileSignature className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-slate-800">Signed Diffie-Hellman Key Exchange</h1>
        </div>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Demonstrate how RSA signatures prevent man-in-the-middle attacks by authenticating DH public keys
        </p>
      </div>

      {/* RSA Key Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            RSA Signing Keys (Certificate Authority)
          </CardTitle>
          <CardDescription>These keys are used to sign and verify DH public keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">RSA Public Key (Verification)</h4>
              <div className="space-y-1 font-mono text-sm">
                <div>n = {rsaKeys.publicKey.n}</div>
                <div>e = {rsaKeys.publicKey.e}</div>
              </div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">RSA Private Key (Signing)</h4>
              <div className="space-y-1 font-mono text-sm">
                <div>n = {rsaKeys.privateKey.n}</div>
                <div>d = {rsaKeys.privateKey.d}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DH Public Keys and Signatures */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Alice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Alice's Key Exchange</CardTitle>
            <CardDescription>Generate and sign Alice's DH public key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alice-key">DH Public Key</Label>
              <Input
                id="alice-key"
                value={alicePublicKey}
                onChange={(e) => setAlicePublicKey(e.target.value)}
                className="font-mono text-center"
              />
            </div>

            <Button onClick={() => signKey("alice")} className="w-full">
              <FileSignature className="h-4 w-4 mr-2" />
              Sign Public Key
            </Button>

            {signatures.alice.signature && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Message to Sign</Label>
                  <div className="p-2 bg-slate-50 rounded border font-mono text-xs break-all">
                    {signatures.alice.message}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">RSA Signature (Base64)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(signatures.alice.signature)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={signatures.alice.signature}
                    readOnly
                    className="font-mono text-xs h-20 resize-none"
                  />
                </div>

                <Button onClick={() => verifySignature("alice")} variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Signature
                </Button>

                {signatures.alice.verified !== null && (
                  <div
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      signatures.alice.verified
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {signatures.alice.verified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <span className="font-medium">
                      {signatures.alice.verified ? "Signature Valid ✓" : "Signature Invalid ✗"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bob */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Bob's Key Exchange</CardTitle>
            <CardDescription>Generate and sign Bob's DH public key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bob-key">DH Public Key</Label>
              <Input
                id="bob-key"
                value={bobPublicKey}
                onChange={(e) => setBobPublicKey(e.target.value)}
                className="font-mono text-center"
              />
            </div>

            <Button onClick={() => signKey("bob")} className="w-full">
              <FileSignature className="h-4 w-4 mr-2" />
              Sign Public Key
            </Button>

            {signatures.bob.signature && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Message to Sign</Label>
                  <div className="p-2 bg-slate-50 rounded border font-mono text-xs break-all">
                    {signatures.bob.message}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">RSA Signature (Base64)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(signatures.bob.signature)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Textarea value={signatures.bob.signature} readOnly className="font-mono text-xs h-20 resize-none" />
                </div>

                <Button onClick={() => verifySignature("bob")} variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Signature
                </Button>

                {signatures.bob.verified !== null && (
                  <div
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      signatures.bob.verified
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {signatures.bob.verified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <span className="font-medium">
                      {signatures.bob.verified ? "Signature Valid ✓" : "Signature Invalid ✗"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How Signatures Prevent MITM Attacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Authentication</h4>
              <p className="text-sm text-blue-700">
                RSA signatures prove that the public key came from the claimed sender and hasn't been modified.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Integrity</h4>
              <p className="text-sm text-green-700">
                Any tampering with the public key will cause signature verification to fail.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Non-repudiation</h4>
              <p className="text-sm text-purple-700">
                The signer cannot deny having signed the public key, providing accountability.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Real-World Implementation</h4>
            <p className="text-sm text-yellow-700">
              In practice, this is implemented using digital certificates (X.509) issued by trusted Certificate
              Authorities (CAs). The CA's public key is pre-installed in browsers and operating systems, creating a
              chain of trust.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
