"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Send, Key, Shield, Clock, CheckCircle, AlertCircle, MessageSquare, Wifi, WifiOff } from "lucide-react"

interface Participant {
  id: string
  name: string
  status: "online" | "exchanging" | "completed"
  publicKey?: string
  realPublicKey?: CryptoKey
  lastSeen: Date
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: Date
  encrypted: boolean
}

interface RealCryptoSession {
  myKeyPair: CryptoKeyPair | null
  participants: Map<string, CryptoKey>
  sharedSecrets: Map<string, ArrayBuffer>
  aesKeys: Map<string, CryptoKey>
}

interface CollaborativeKeyExchangeProps {
  onCollaboration?: () => void
}

export default function CollaborativeKeyExchange({ onCollaboration }: CollaborativeKeyExchangeProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "Alice", status: "online", lastSeen: new Date() },
    { id: "2", name: "Bob", status: "online", lastSeen: new Date() },
    { id: "3", name: "Charlie", status: "exchanging", publicKey: "g^c mod p", lastSeen: new Date() },
  ])

  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
  const [exchangeStep, setExchangeStep] = useState(0)
  const [myPrivateKey, setMyPrivateKey] = useState<number | null>(null)
  const [myPublicKey, setMyPublicKey] = useState<string | null>(null)
  const [partnerPublicKey, setPartnerPublicKey] = useState<string | null>(null)
  const [sharedSecret, setSharedSecret] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System",
      message: "Welcome to collaborative key exchange! Select a partner to begin.",
      timestamp: new Date(),
      encrypted: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  // Real crypto state
  const [realCrypto, setRealCrypto] = useState<RealCryptoSession>({
    myKeyPair: null,
    participants: new Map(),
    sharedSecrets: new Map(),
    aesKeys: new Map(),
  })
  const [cryptoSupported, setCryptoSupported] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check Web Crypto API support
  useEffect(() => {
    setCryptoSupported(typeof window !== "undefined" && "crypto" in window && "subtle" in window.crypto)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          lastSeen: new Date(Date.now() - Math.random() * 60000),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Utility functions for real crypto
  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    return new TextEncoder().encode(str)
  }

  const arrayBufferToString = (buffer: ArrayBuffer): string => {
    return new TextDecoder().decode(buffer)
  }

  // Educational key exchange
  const startKeyExchange = (partnerId: string) => {
    setSelectedPartner(partnerId)
    setExchangeStep(1)

    // Generate private key (simulated)
    const privateKey = Math.floor(Math.random() * 100) + 1
    setMyPrivateKey(privateKey)

    // Simulate public key generation
    const publicKey = `g^${privateKey} mod p`
    setMyPublicKey(publicKey)

    // Update participant status
    setParticipants((prev) => prev.map((p) => (p.id === partnerId ? { ...p, status: "exchanging" } : p)))

    // Add system message
    const partner = participants.find((p) => p.id === partnerId)
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "System",
        message: `Started key exchange with ${partner?.name}. Your public key: ${publicKey}`,
        timestamp: new Date(),
        encrypted: false,
      },
    ])

    onCollaboration?.()
  }

  const completeExchange = () => {
    if (!selectedPartner || !myPrivateKey) return

    // Simulate receiving partner's public key
    const partner = participants.find((p) => p.id === selectedPartner)
    const partnerKey = `g^${Math.floor(Math.random() * 100) + 1} mod p`
    setPartnerPublicKey(partnerKey)

    // Simulate shared secret computation
    const secret = `g^${myPrivateKey * 42} mod p` // Simplified simulation
    setSharedSecret(secret)
    setExchangeStep(2)

    // Update status
    setParticipants((prev) =>
      prev.map((p) => (p.id === selectedPartner ? { ...p, status: "completed", publicKey: partnerKey } : p)),
    )

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "System",
        message: `Key exchange completed! Shared secret established with ${partner?.name}`,
        timestamp: new Date(),
        encrypted: false,
      },
    ])
  }

  // Real crypto functions
  const generateRealKeyPair = async () => {
    if (!cryptoSupported) return

    setIsProcessing(true)
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      )

      setRealCrypto((prev) => ({
        ...prev,
        myKeyPair: keyPair,
      }))

      // Simulate other participants generating keys
      for (const participant of participants) {
        if (participant.status === "online") {
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
            participants: new Map(prev.participants.set(participant.id, partnerKeyPair.publicKey)),
          }))
        }
      }
    } catch (error) {
      console.error("Error generating key pair:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const performRealKeyExchange = async (partnerId: string) => {
    if (!realCrypto.myKeyPair || !realCrypto.participants.has(partnerId)) return

    setIsProcessing(true)
    try {
      const partnerPublicKey = realCrypto.participants.get(partnerId)!

      // Derive shared secret
      const sharedBits = await window.crypto.subtle.deriveBits(
        {
          name: "ECDH",
          public: partnerPublicKey,
        },
        realCrypto.myKeyPair.privateKey,
        256,
      )

      // Derive AES key for secure messaging
      const aesKey = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: partnerPublicKey,
        },
        realCrypto.myKeyPair.privateKey,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"],
      )

      setRealCrypto((prev) => ({
        ...prev,
        sharedSecrets: new Map(prev.sharedSecrets.set(partnerId, sharedBits)),
        aesKeys: new Map(prev.aesKeys.set(partnerId, aesKey)),
      }))

      const partner = participants.find((p) => p.id === partnerId)
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "System",
          message: `Real ECDH key exchange completed with ${partner?.name}! 256-bit shared secret established.`,
          timestamp: new Date(),
          encrypted: false,
        },
      ])
    } catch (error) {
      console.error("Error performing real key exchange:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const isEncrypted = !!sharedSecret || (selectedPartner && realCrypto.aesKeys.has(selectedPartner))

    // For real crypto, encrypt the message
    let messageToSend = newMessage
    if (selectedPartner && realCrypto.aesKeys.has(selectedPartner)) {
      try {
        const aesKey = realCrypto.aesKeys.get(selectedPartner)!
        const iv = window.crypto.getRandomValues(new Uint8Array(12))
        const encodedMessage = stringToArrayBuffer(newMessage)

        const ciphertext = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv,
          },
          aesKey,
          encodedMessage,
        )

        messageToSend = `🔒 ${arrayBufferToHex(ciphertext).substring(0, 32)}...`
      } catch (error) {
        console.error("Error encrypting message:", error)
      }
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      message: messageToSend,
      timestamp: new Date(),
      encrypted: isEncrypted,
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate partner response
    setTimeout(
      () => {
        const responses = [
          "Great! The key exchange worked perfectly.",
          "I can see your encrypted message clearly.",
          "This demonstrates perfect forward secrecy.",
          "The shared secret is secure between us.",
          "Real cryptography is fascinating!",
          "The ECDH implementation is working well.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const responder = participants.find((p) => p.id === selectedPartner)

        if (responder) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: responder.name,
              message: randomResponse,
              timestamp: new Date(),
              encrypted: isEncrypted,
            },
          ])
        }
      },
      1000 + Math.random() * 2000,
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "exchanging":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-3 w-3" />
      case "exchanging":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <Shield className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle>Collaborative Key Exchange</CardTitle>
              <CardDescription>
                Practice both educational and real-world key exchange with simulated partners
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="educational" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="educational">Educational Demo</TabsTrigger>
          <TabsTrigger value="real">Real Cryptography</TabsTrigger>
        </TabsList>

        {/* Educational Demo Tab */}
        <TabsContent value="educational" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Participants Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Online Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{participant.name}</div>
                          <div className="text-xs text-slate-500">
                            {Math.floor((Date.now() - participant.lastSeen.getTime()) / 1000)}s ago
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`text-xs ${getStatusColor(participant.status)}`}>
                          {getStatusIcon(participant.status)}
                          {participant.status}
                        </Badge>
                        {participant.id !== selectedPartner && participant.status === "online" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startKeyExchange(participant.id)}
                            className="text-xs"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Exchange Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Key Exchange Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedPartner ? (
                  <div className="text-center py-8 text-slate-500">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a participant to start key exchange</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span>Partner:</span>
                      <Badge variant="outline">{participants.find((p) => p.id === selectedPartner)?.name}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div
                        className={`p-3 rounded-lg ${exchangeStep >= 1 ? "bg-green-50 border border-green-200" : "bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {exchangeStep >= 1 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                          )}
                          <span className="font-medium text-sm">Step 1: Generate Keys</span>
                        </div>
                        {myPublicKey && (
                          <div className="text-xs text-slate-600 font-mono bg-white p-2 rounded">
                            Your public key: {myPublicKey}
                          </div>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-lg ${exchangeStep >= 2 ? "bg-green-50 border border-green-200" : "bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {exchangeStep >= 2 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                          )}
                          <span className="font-medium text-sm">Step 2: Exchange & Compute</span>
                        </div>
                        {partnerPublicKey && (
                          <div className="text-xs text-slate-600 font-mono bg-white p-2 rounded mb-2">
                            Partner's key: {partnerPublicKey}
                          </div>
                        )}
                        {sharedSecret && (
                          <div className="text-xs text-green-700 font-mono bg-green-100 p-2 rounded">
                            Shared secret: {sharedSecret}
                          </div>
                        )}
                      </div>
                    </div>

                    {exchangeStep === 1 && (
                      <Button onClick={completeExchange} className="w-full">
                        Complete Exchange
                      </Button>
                    )}

                    {exchangeStep === 2 && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700 font-medium">Secure channel established!</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Secure Chat
                  {sharedSecret && <Badge className="bg-green-100 text-green-800">Encrypted</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full border rounded-lg p-3">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-2 rounded-lg text-sm ${
                          message.sender === "You"
                            ? "bg-blue-100 text-blue-800 ml-4"
                            : message.sender === "System"
                              ? "bg-slate-100 text-slate-700 text-center"
                              : "bg-slate-50 text-slate-800 mr-4"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.sender}</span>
                          {message.encrypted && <Shield className="h-3 w-3 text-green-600" />}
                          <span className="text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p>{message.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder={sharedSecret ? "Send encrypted message..." : "Establish key exchange first"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={!selectedPartner}
                  />
                  <Button onClick={sendMessage} disabled={!selectedPartner || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real Cryptography Tab */}
        <TabsContent value="real" className="space-y-6">
          {!cryptoSupported ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <WifiOff className="h-5 w-5" />
                  <span className="font-medium">Web Crypto API not supported</span>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  Real cryptography features require a modern browser with Web Crypto API support.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Real Crypto Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Real ECDH Key Exchange
                  </CardTitle>
                  <CardDescription>Generate real P-256 ECDH keys and perform secure key exchange</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={generateRealKeyPair}
                    disabled={isProcessing || realCrypto.myKeyPair !== null}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Keys...
                      </>
                    ) : realCrypto.myKeyPair ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Keys Generated
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Generate ECDH Key Pair
                      </>
                    )}
                  </Button>

                  {realCrypto.myKeyPair && (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">P-256 Key Pair Generated</span>
                        </div>
                        <p className="text-xs text-green-700">Your ECDH key pair is ready for secure key exchange</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Available Partners:</h4>
                        {participants
                          .filter((p) => p.status === "online")
                          .map((participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between p-2 bg-slate-50 rounded"
                            >
                              <span className="text-sm">{participant.name}</span>
                              <Button
                                size="sm"
                                onClick={() => performRealKeyExchange(participant.id)}
                                disabled={isProcessing || realCrypto.sharedSecrets.has(participant.id)}
                              >
                                {realCrypto.sharedSecrets.has(participant.id) ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Connected
                                  </>
                                ) : (
                                  "Exchange"
                                )}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real Crypto Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {realCrypto.sharedSecrets.size === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No secure connections established</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.from(realCrypto.sharedSecrets.entries()).map(([partnerId, secret]) => {
                        const partner = participants.find((p) => p.id === partnerId)
                        return (
                          <div key={partnerId} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-800">{partner?.name}</span>
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Secure
                              </Badge>
                            </div>
                            <div className="text-xs text-green-700 font-mono bg-white p-2 rounded">
                              Shared Secret: {arrayBufferToHex(secret).substring(0, 32)}...
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
