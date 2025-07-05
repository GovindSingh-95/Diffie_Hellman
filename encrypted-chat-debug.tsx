"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Lock, Unlock, Copy, MessageSquare, Shield, Eye, EyeOff, Terminal } from "lucide-react"

interface Message {
  id: string
  sender: "Alice" | "Bob"
  plaintext: string
  ciphertext: string
  timestamp: Date
  iv: string
  keyUsed: string
}

interface DebugInfo {
  dhParams: { p: number; g: number }
  sharedSecret: string
  encryptionMethod: string
  keyDerivation: string
}

export function EncryptedChatDebug() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentSender, setCurrentSender] = useState<"Alice" | "Bob">("Alice")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showDebug, setShowDebug] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [debugInfo] = useState<DebugInfo>({
    dhParams: { p: 2357, g: 2 },
    sharedSecret: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
    encryptionMethod: "AES-256-GCM",
    keyDerivation: "HKDF-SHA256",
  })

  // Simulated AES encryption
  const simulateEncryption = (plaintext: string, key: string): { ciphertext: string; iv: string } => {
    const iv = Math.random().toString(36).substring(2, 18)

    // Simple XOR-based simulation for demo
    let encrypted = ""
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      encrypted += String.fromCharCode(char ^ keyChar)
    }

    return {
      ciphertext: btoa(encrypted),
      iv,
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const { ciphertext, iv } = simulateEncryption(newMessage, debugInfo.sharedSecret)

    const message: Message = {
      id: Date.now().toString(),
      sender: currentSender,
      plaintext: newMessage,
      ciphertext,
      iv,
      keyUsed: debugInfo.sharedSecret.substring(0, 16) + "...",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setSelectedMessage(message)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Encrypted Chat Playground</h1>
                <p className="text-sm text-slate-600">End-to-end encrypted with DH + AES</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
              <Button onClick={() => setShowDebug(!showDebug)} variant="outline" size="sm">
                {showDebug ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDebug ? "Hide" : "Show"} Debug
              </Button>
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
                  } ${selectedMessage?.id === message.id ? "ring-2 ring-purple-500" : ""}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-75">{message.sender}</span>
                    <Lock className="h-3 w-3 opacity-75" />
                  </div>
                  <p className="text-sm">{message.plaintext}</p>
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
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      {showDebug && (
        <div className="w-96 bg-slate-900 text-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <h2 className="font-semibold">Debug Console</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* DH Parameters */}
            <div>
              <Label className="text-slate-300 text-sm">DH Parameters</Label>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-sm space-y-1">
                <div>p = {debugInfo.dhParams.p}</div>
                <div>g = {debugInfo.dhParams.g}</div>
              </div>
            </div>

            {/* Shared Secret */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 text-sm">Shared Secret (256-bit)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugInfo.sharedSecret)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-xs break-all">
                {debugInfo.sharedSecret}
              </div>
            </div>

            {/* Encryption Method */}
            <div>
              <Label className="text-slate-300 text-sm">Encryption Method</Label>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-sm">{debugInfo.encryptionMethod}</div>
            </div>

            {/* Key Derivation */}
            <div>
              <Label className="text-slate-300 text-sm">Key Derivation</Label>
              <div className="mt-1 p-2 bg-slate-800 rounded border font-mono text-sm">{debugInfo.keyDerivation}</div>
            </div>

            {selectedMessage && (
              <>
                <div className="border-t border-slate-700 pt-4">
                  <Label className="text-slate-300 text-sm">Selected Message Debug</Label>
                </div>

                {/* Message Metadata */}
                <div>
                  <Label className="text-slate-300 text-sm">Message Info</Label>
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
                      Ciphertext (Base64)
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
                  <Textarea
                    value={selectedMessage.ciphertext}
                    readOnly
                    className="mt-1 bg-red-900/20 border-red-700 text-slate-300 font-mono text-xs h-20 resize-none"
                  />
                </div>

                {/* Encryption Process */}
                <div>
                  <Label className="text-slate-300 text-sm">Encryption Process</Label>
                  <div className="mt-1 p-2 bg-slate-800 rounded border text-xs space-y-1">
                    <div>1. Generate random IV: {selectedMessage.iv}</div>
                    <div>2. Derive AES key from shared secret</div>
                    <div>3. Encrypt: AES-GCM(plaintext, key, iv)</div>
                    <div>4. Encode result as Base64</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 space-y-1">
              <div>• Click messages to inspect encryption details</div>
              <div>• All cryptographic values are simulated for education</div>
              <div>• Real implementations use hardware security modules</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
