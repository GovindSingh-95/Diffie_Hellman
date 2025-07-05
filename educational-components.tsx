"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModularExponentiationDemo } from "./modular-exponentiation-demo"
import { ThreatsDashboard } from "./threats-dashboard"
import { DHTimeline } from "./dh-timeline"

export default function EducationalComponents() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Diffie-Hellman Educational Suite</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Interactive components to understand the mathematics, security, and process of Diffie-Hellman Key Exchange
          </p>
        </div>

        <Tabs defaultValue="modular" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="modular">Modular Exponentiation</TabsTrigger>
            <TabsTrigger value="threats">Security Threats</TabsTrigger>
            <TabsTrigger value="timeline">Process Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="modular">
            <ModularExponentiationDemo />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatsDashboard />
          </TabsContent>

          <TabsContent value="timeline">
            <DHTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
