"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Settings,
  MessageSquare,
  Shield,
  Clock,
  RotateCcw,
  History,
  Timer,
} from "lucide-react"

interface Message {
  id: string
  sender: "Alice" | "Bob"
  plaintext: string
  ciphertext: string
  timestamp: Date
  iv: string
}

interface EncryptionState {
  sharedSecret: string
  method: string
  keySize: number
}

interface KeyRotationConfig {
  enabled: boolean
  intervalSeconds: number
  maxMessages: number
  strategy: "time" | "message-count" | "manual"
}

interface KeyHistory {
  id: string
  sharedSecret: string
  createdAt: Date
  rotatedAt?: Date
  messagesEncrypted: number
  status: "active" | "rotated" | "expired"
}

// Simulated AES encryption (for demo purposes)
function simulateAESEncrypt(plaintext: string, key: string): { ciphertext: string; iv: string } {
  // Generate random IV
  const iv = Math.random().toString(36).substring(2, 18)

  // Simulate encryption by creating a hex-like string
  const combined = plaintext + key + iv
  let ciphertext = ""
  for (let i = 0; i < combined.length; i++) {
    ciphertext += combined.charCodeAt(i).toString(16).padStart(2, "0")
  }

  return { ciphertext: ciphertext.substring(0, Math.max(32, plaintext.length * 2)), iv }
}

function simulateAESDecrypt(ciphertext: string, key: string, iv: string): string {
  // This is a simulation - in reality, we'd need the actual decryption
  // For demo purposes, we'll just return a placeholder
  return "[Decrypted using AES-256-CBC]"
}

export function EncryptedChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentSender, setCurrentSender] = useState<"Alice" | "Bob">("Alice")
  const [showDecrypted, setShowDecrypted] = useState(false)
  const [debugMode, setDebugMode] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [keyRotation, setKeyRotation] = useState<KeyRotationConfig>({
    enabled: true,
    intervalSeconds: 30,
    maxMessages: 5,
    strategy: "time",
  })
  const [keyHistory, setKeyHistory] = useState<KeyHistory[]>([
    {
      id: "1",
      sharedSecret: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      createdAt: new Date(),
      messagesEncrypted: 0,
      status: "active",
    },
  ])
  const [rotationTimer, setRotationTimer] = useState<number>(keyRotation.intervalSeconds)
  const [isRotating, setIsRotating] = useState(false)
  const [showKeyHistory, setShowKeyHistory] = useState(false)

  const activeKey = keyHistory.find((k) => k.status === "active")
  const [encryptionState] = useState<EncryptionState>({
    sharedSecret: activeKey?.sharedSecret || "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    method: "AES-256-CBC",
    keySize: 256,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Key rotation timer
  useEffect(() => {
    if (!keyRotation.enabled || keyRotation.strategy !== "time") return

    const interval = setInterval(() => {
      setRotationTimer((prev) => {
        if (prev <= 1) {
          performKeyRotation()
          return keyRotation.intervalSeconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [keyRotation])

  // Check message-based rotation
  useEffect(() => {
    if (keyRotation.strategy === "message-count" && keyRotation.enabled) {
      const currentKey = keyHistory.find((k) => k.status === "active")
      if (currentKey && currentKey.messagesEncrypted >= keyRotation.maxMessages) {
        performKeyRotation()
      }
    }
  }, [messages, keyRotation])

  const performKeyRotation = async () => {
    setIsRotating(true)

    // Generate new shared secret (simulated)
    const newSecret = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    const paddedSecret = newSecret.padEnd(64, "0").substring(0, 64)

    // Update key history
    setKeyHistory((prev) => {
      const updated = prev.map((key) =>
        key.status === "active" ? { ...key, status: "rotated" as const, rotatedAt: new Date() } : key,
      )

      updated.push({
        id: Date.now().toString(),
        sharedSecret: paddedSecret,
        createdAt: new Date(),
        messagesEncrypted: 0,
        status: "active",
      })

      return updated
    })

    // Simulate rotation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRotating(false)
    setRotationTimer(keyRotation.intervalSeconds)
  }

  const manualKeyRotation = () => {
    if (!isRotating) {
      performKeyRotation()
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const activeKey = keyHistory.find((k) => k.status === "active")
    if (!activeKey) return

    const { ciphertext, iv } = simulateAESEncrypt(newMessage, activeKey.sharedSecret)

    const message: Message = {
      id: Date.now().toString(),
      sender: currentSender,
      plaintext: newMessage,
      ciphertext,
      iv,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setSelectedMessage(message)

    // Update message count for active key
    setKeyHistory((prev) =>
      prev.map((key) => (key.status === "active" ? { ...key, messagesEncrypted: key.messagesEncrypted + 1 } : key)),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Encrypted Chat</h1>
                <p className="text-sm text-slate-600">End-to-end encrypted with DH + AES</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-decrypted" className="text-sm">
                  Show Decrypted
                </Label>
                <Switch id="show-decrypted" checked={showDecrypted} onCheckedChange={setShowDecrypted} />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
              {/* Key Rotation Status */}
              <div className="flex items-center gap-2">
                {isRotating ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
                    <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                    Rotating Keys...
                  </Badge>
                ) : keyRotation.enabled ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Timer className="h-3 w-3 mr-1" />
                    Auto-Rotate: {rotationTimer}s
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Manual Only
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 mt-20">
              <Lock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No messages yet. Start a secure conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "Alice" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer transition-all ${
                    message.sender === "Alice"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  } ${selectedMessage?.id === message.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-75">{message.sender}</span>
                    {showDecrypted ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </div>
                  <p className="text-sm font-mono">
                    {showDecrypted ? message.plaintext : message.ciphertext.substring(0, 40) + "..."}
                  </p>
                  <p className="text-xs opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Label className="text-sm font-medium">Send as:</Label>
            <Button
              variant={currentSender === "Alice" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSender("Alice")}
            >
              Alice
            </Button>
            <Button
              variant={currentSender === "Bob" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSender("Bob")}
            >
              Bob
            </Button>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[40px] max-h-[120px]"
              rows={1}
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      {debugMode && (
        <div className="w-96 bg-slate-900 text-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="font-semibold">Encryption Console</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Encryption Method */}
            <div>
              <Label className="text-slate-300 text-sm">Encryption Method</Label>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-sm">{encryptionState.method}</div>
            </div>

            {/* Shared Secret */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-sm">Shared Secret ({encryptionState.keySize}-bit)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(encryptionState.sharedSecret)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-xs break-all">
                {encryptionState.sharedSecret}
              </div>
            </div>

            {/* Key Rotation Controls */}
            <div>
              <Label className="text-slate-300 text-sm">Key Rotation</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-800 rounded border">
                  <span className="text-xs">Strategy:</span>
                  <select
                    value={keyRotation.strategy}
                    onChange={(e) => setKeyRotation((prev) => ({ ...prev, strategy: e.target.value as any }))}
                    className="bg-slate-700 text-slate-200 text-xs rounded px-1"
                  >
                    <option value="time">Time-based</option>
                    <option value="message-count">Message-count</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                {keyRotation.strategy === "time" && (
                  <div className="flex items-center justify-between p-2 bg-slate-800 rounded border">
                    <span className="text-xs">Interval:</span>
                    <input
                      type="number"
                      value={keyRotation.intervalSeconds}
                      onChange={(e) => setKeyRotation((prev) => ({ ...prev, intervalSeconds: Number(e.target.value) }))}
                      className="bg-slate-700 text-slate-200 text-xs rounded px-1 w-16"
                      min="10"
                      max="300"
                    />
                  </div>
                )}

                {keyRotation.strategy === "message-count" && (
                  <div className="flex items-center justify-between p-2 bg-slate-800 rounded border">
                    <span className="text-xs">Max Messages:</span>
                    <input
                      type="number"
                      value={keyRotation.maxMessages}
                      onChange={(e) => setKeyRotation((prev) => ({ ...prev, maxMessages: Number(e.target.value) }))}
                      className="bg-slate-700 text-slate-200 text-xs rounded px-1 w-16"
                      min="1"
                      max="20"
                    />
                  </div>
                )}

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={manualKeyRotation}
                    disabled={isRotating}
                    className="flex-1 h-7 text-xs text-slate-300 hover:text-slate-100"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Rotate Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeyHistory(!showKeyHistory)}
                    className="h-7 text-xs text-slate-300 hover:text-slate-100"
                  >
                    <History className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Key History */}
            {showKeyHistory && (
              <div>
                <Label className="text-slate-300 text-sm">Key History</Label>
                <div className="mt-1 space-y-1 max-h-40 overflow-y-auto">
                  {keyHistory
                    .slice()
                    .reverse()
                    .map((key) => (
                      <div key={key.id} className="p-2 bg-slate-800 rounded border text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              key.status === "active"
                                ? "bg-green-900/20 text-green-300 border-green-700"
                                : "bg-slate-700 text-slate-400 border-slate-600"
                            }`}
                          >
                            {key.status}
                          </Badge>
                          <span className="text-slate-400">{key.messagesEncrypted} msgs</span>
                        </div>
                        <div className="font-mono text-xs text-slate-300 truncate">
                          {key.sharedSecret.substring(0, 16)}...
                        </div>
                        <div className="text-slate-500 text-xs">{key.createdAt.toLocaleTimeString()}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedMessage && (
              <>
                <Separator className="bg-slate-700" />

                {/* Selected Message Details */}
                <div>
                  <Label className="text-slate-300 text-sm">Selected Message</Label>
                  <div className="mt-1 p-2 bg-slate-800 rounded border text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400">From:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedMessage.sender}
                      </Badge>
                    </div>
                    <div className="text-slate-400 text-xs">{selectedMessage.timestamp.toLocaleString()}</div>
                  </div>
                </div>

                {/* IV */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 text-sm">Initialization Vector (IV)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMessage.iv)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-xs">{selectedMessage.iv}</div>
                </div>

                {/* Plaintext */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 text-sm flex items-center gap-1">
                      <Unlock className="h-3 w-3" />
                      Plaintext
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMessage.plaintext)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-1 p-2 bg-green-900/20 border border-green-700 rounded font-mono text-sm">
                    {selectedMessage.plaintext}
                  </div>
                </div>

                {/* Ciphertext */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 text-sm flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Ciphertext
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMessage.ciphertext)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-1 p-2 bg-red-900/20 border border-red-700 rounded font-mono text-xs break-all">
                    {selectedMessage.ciphertext}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDebugMode(false)}
              className="w-full text-slate-400 hover:text-slate-200"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Console
            </Button>
          </div>
        </div>
      )}

      {!debugMode && (
        <Button onClick={() => setDebugMode(true)} className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0">
          <Eye className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
