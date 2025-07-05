"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EncryptedChat } from "./encrypted-chat"
import { KeyStrengthAnalyzer } from "./key-strength-analyzer"
import { HybridEncryptionDemo } from "./hybrid-encryption-demo"
import { KeyRotationDemo } from "./key-rotation-demo"

export default function EncryptionSuite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Diffie-Hellman Encryption Suite</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Comprehensive tools for understanding and implementing Diffie-Hellman key exchange in real-world encryption
            scenarios
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="chat">Encrypted Chat</TabsTrigger>
            <TabsTrigger value="analyzer">Key Strength</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Encryption</TabsTrigger>
            <TabsTrigger value="rotation">Key Rotation</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <EncryptedChat />
          </TabsContent>

          <TabsContent value="analyzer" className="mt-0">
            <KeyStrengthAnalyzer />
          </TabsContent>

          <TabsContent value="hybrid" className="mt-0">
            <HybridEncryptionDemo />
          </TabsContent>

          <TabsContent value="rotation" className="mt-0">
            <KeyRotationDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
