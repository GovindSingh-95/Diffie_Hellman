"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Globe, Server, Key, ArrowRight, CheckCircle, Info, ExternalLink } from "lucide-react"

interface ProtocolInfo {
  name: string
  description: string
  dhUsage: string
  keyExchangeStep: string
  securityBenefits: string[]
  implementation: string
  diagram: React.ReactNode
}

const protocols: Record<string, ProtocolInfo> = {
  tls: {
    name: "TLS/SSL",
    description: "Transport Layer Security protocol for secure web communications",
    dhUsage: "Used in TLS handshake for Perfect Forward Secrecy (PFS)",
    keyExchangeStep: "Client and server exchange DH parameters during handshake to establish session keys",
    securityBenefits: [
      "Perfect Forward Secrecy - past sessions remain secure",
      "Ephemeral keys prevent long-term key compromise",
      "Authenticated with digital certificates",
      "Widely supported across browsers and servers",
    ],
    implementation: "Ephemeral Diffie-Hellman (DHE) or Elliptic Curve DH (ECDHE)",
    diagram: (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-16 text-center bg-blue-100 rounded px-2 py-1">Client</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-slate-100 rounded px-2 py-1">ClientHello + DH params</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-16 text-center bg-green-100 rounded px-2 py-1">Server</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 text-center bg-blue-100 rounded px-2 py-1">Client</div>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <div className="flex-1 text-center bg-slate-100 rounded px-2 py-1">ServerHello + Certificate + DH params</div>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <div className="w-16 text-center bg-green-100 rounded px-2 py-1">Server</div>
        </div>
        <div className="text-center text-xs text-slate-600 mt-2">
          Both compute shared secret → Derive session keys → Secure communication
        </div>
      </div>
    ),
  },
  ssh: {
    name: "SSH",
    description: "Secure Shell protocol for remote system administration",
    dhUsage: "Establishes secure channel for authentication and data transfer",
    keyExchangeStep: "DH key exchange occurs after protocol version negotiation but before authentication",
    securityBenefits: [
      "Secure remote access to servers",
      "Encrypted command execution and file transfer",
      "Host key verification prevents MITM attacks",
      "Support for multiple authentication methods",
    ],
    implementation: "diffie-hellman-group14-sha256 or curve25519-sha256",
    diagram: (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-16 text-center bg-blue-100 rounded px-2 py-1">Client</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-slate-100 rounded px-2 py-1">SSH version + algorithms</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-16 text-center bg-green-100 rounded px-2 py-1">Server</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 text-center bg-blue-100 rounded px-2 py-1">Client</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-yellow-100 rounded px-2 py-1">DH Key Exchange</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-16 text-center bg-green-100 rounded px-2 py-1">Server</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 text-center bg-blue-100 rounded px-2 py-1">Client</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-purple-100 rounded px-2 py-1">Authentication + Encrypted Session</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-16 text-center bg-green-100 rounded px-2 py-1">Server</div>
        </div>
      </div>
    ),
  },
  vpn: {
    name: "VPN (IPSec)",
    description: "Virtual Private Network for secure network-to-network communication",
    dhUsage: "Internet Key Exchange (IKE) protocol uses DH for establishing IPSec security associations",
    keyExchangeStep: "Phase 1 of IKE uses DH to establish secure channel, Phase 2 derives IPSec keys",
    securityBenefits: [
      "Secure site-to-site connectivity",
      "Protection against network eavesdropping",
      "Authentication of network endpoints",
      "Flexible security policy enforcement",
    ],
    implementation: "IKEv2 with DH groups 14, 19, 20, or 21",
    diagram: (
      <div className="space-y-2 text-sm">
        <div className="text-center font-medium mb-2">IKE Phase 1 (Main Mode)</div>
        <div className="flex items-center gap-2">
          <div className="w-20 text-center bg-blue-100 rounded px-2 py-1">Gateway A</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-slate-100 rounded px-2 py-1">SA proposal</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-20 text-center bg-green-100 rounded px-2 py-1">Gateway B</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 text-center bg-blue-100 rounded px-2 py-1">Gateway A</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-yellow-100 rounded px-2 py-1">DH Exchange</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-20 text-center bg-green-100 rounded px-2 py-1">Gateway B</div>
        </div>
        <div className="text-center font-medium mt-2 mb-1">IKE Phase 2 (Quick Mode)</div>
        <div className="flex items-center gap-2">
          <div className="w-20 text-center bg-blue-100 rounded px-2 py-1">Gateway A</div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex-1 text-center bg-purple-100 rounded px-2 py-1">IPSec SA + ESP/AH keys</div>
          <ArrowRight className="h-4 w-4" />
          <div className="w-20 text-center bg-green-100 rounded px-2 py-1">Gateway B</div>
        </div>
      </div>
    ),
  },
}

export function KnowledgeBasePanel() {
  const [selectedProtocol, setSelectedProtocol] = useState("tls")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Diffie-Hellman in Real-World Protocols</h1>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Explore how Diffie-Hellman key exchange is implemented in major security protocols that protect internet
          communications every day
        </p>
      </div>

      <Tabs value={selectedProtocol} onValueChange={setSelectedProtocol} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tls" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            TLS/SSL
          </TabsTrigger>
          <TabsTrigger value="ssh" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            SSH
          </TabsTrigger>
          <TabsTrigger value="vpn" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            VPN (IPSec)
          </TabsTrigger>
        </TabsList>

        {Object.entries(protocols).map(([key, protocol]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Protocol Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {key === "tls" && <Globe className="h-5 w-5 text-blue-600" />}
                    {key === "ssh" && <Server className="h-5 w-5 text-green-600" />}
                    {key === "vpn" && <Shield className="h-5 w-5 text-purple-600" />}
                    {protocol.name}
                  </CardTitle>
                  <CardDescription>{protocol.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <Key className="h-4 w-4" />
                      How DH is Used
                    </h4>
                    <p className="text-sm text-slate-600">{protocol.dhUsage}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      Key Exchange Process
                    </h4>
                    <p className="text-sm text-slate-600">{protocol.keyExchangeStep}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Implementation
                    </h4>
                    <Badge variant="outline" className="font-mono text-xs">
                      {protocol.implementation}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Security Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Security Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {protocol.securityBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Protocol Flow Diagram */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Protocol Flow Diagram
                </CardTitle>
                <CardDescription>Step-by-step visualization of how {protocol.name} uses Diffie-Hellman</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-50 rounded-lg">{protocol.diagram}</div>
              </CardContent>
            </Card>

            {/* Real-World Context */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Real-World Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {key === "tls" && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Web Browsers</h4>
                        <p className="text-sm text-blue-700">
                          Every HTTPS connection uses TLS with DH for secure web browsing
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">E-commerce</h4>
                        <p className="text-sm text-green-700">
                          Online shopping and banking rely on TLS-DH for payment security
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">API Security</h4>
                        <p className="text-sm text-purple-700">
                          REST APIs and microservices use TLS-DH for service-to-service communication
                        </p>
                      </div>
                    </>
                  )}

                  {key === "ssh" && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Server Administration</h4>
                        <p className="text-sm text-blue-700">
                          System administrators use SSH-DH for secure remote server management
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Git/GitHub</h4>
                        <p className="text-sm text-green-700">
                          Code repositories use SSH-DH for secure version control operations
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">DevOps</h4>
                        <p className="text-sm text-purple-700">
                          Automated deployment pipelines rely on SSH-DH for secure operations
                        </p>
                      </div>
                    </>
                  )}

                  {key === "vpn" && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Corporate Networks</h4>
                        <p className="text-sm text-blue-700">
                          Site-to-site VPNs use IPSec-DH to connect branch offices securely
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Remote Work</h4>
                        <p className="text-sm text-green-700">
                          Remote employees use VPN-DH to access corporate resources safely
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Cloud Security</h4>
                        <p className="text-sm text-purple-700">
                          Cloud providers use IPSec-DH for secure inter-datacenter communication
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
