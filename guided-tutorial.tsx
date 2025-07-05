"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, BookOpen, Code, Shield, Lightbulb, ArrowRight, ArrowLeft, X } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  content: string
  codeExample?: string
  quiz?: {
    question: string
    options: string[]
    correct: number
  }
}

interface GuidedTutorialProps {
  onComplete?: (moduleId: string) => void
  onClose?: () => void
}

export default function GuidedTutorial({ onComplete, onClose }: GuidedTutorialProps) {
  const [currentModule, setCurrentModule] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})

  const modules = [
    {
      id: "basics",
      title: "Diffie-Hellman Basics",
      icon: <BookOpen className="h-5 w-5" />,
      steps: [
        {
          id: "intro",
          title: "What is Diffie-Hellman?",
          content:
            "The Diffie-Hellman key exchange is a method for two parties to establish a shared secret key over an insecure channel. It was one of the first public-key protocols and remains fundamental to modern cryptography.",
        },
        {
          id: "math",
          title: "Mathematical Foundation",
          content:
            "DH relies on the discrete logarithm problem. Given g^x mod p, it's computationally difficult to find x when g and p are large. This one-way function forms the security basis.",
          codeExample: `// Basic modular exponentiation
function modPow(base, exp, mod) {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}`,
        },
        {
          id: "process",
          title: "Key Exchange Process",
          content:
            "1. Alice and Bob agree on public parameters (g, p)\n2. Each generates a private key (a, b)\n3. Each computes public key (g^a mod p, g^b mod p)\n4. They exchange public keys\n5. Each computes shared secret (g^ab mod p)",
          quiz: {
            question: "What makes the discrete logarithm problem difficult?",
            options: [
              "The numbers are too small",
              "Finding x in g^x mod p is computationally hard for large numbers",
              "The algorithm is too simple",
              "It requires special hardware",
            ],
            correct: 1,
          },
        },
      ],
    },
    {
      id: "security",
      title: "Security Analysis",
      icon: <Shield className="h-5 w-5" />,
      steps: [
        {
          id: "threats",
          title: "Common Threats",
          content:
            "DH is vulnerable to man-in-the-middle attacks without authentication. An attacker can intercept and replace public keys, establishing separate shared secrets with each party.",
        },
        {
          id: "mitigation",
          title: "Security Measures",
          content:
            "To prevent MITM attacks, DH must be combined with authentication mechanisms like digital signatures, certificates, or pre-shared keys. Perfect Forward Secrecy can be achieved with ephemeral keys.",
          quiz: {
            question: "How can MITM attacks on DH be prevented?",
            options: [
              "Using larger prime numbers",
              "Adding authentication mechanisms",
              "Encrypting the public keys",
              "Using faster computers",
            ],
            correct: 1,
          },
        },
      ],
    },
    {
      id: "implementation",
      title: "Implementation",
      icon: <Code className="h-5 w-5" />,
      steps: [
        {
          id: "parameters",
          title: "Choosing Parameters",
          content:
            "Safe primes (p = 2q + 1 where q is also prime) are recommended. The generator g should have large order. Common groups include RFC 3526 groups and elliptic curve groups.",
          codeExample: `// RFC 3526 1024-bit group
const p = BigInt('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA237327FFFFFFFFFFFFFFFF');
const g = BigInt(2);`,
        },
        {
          id: "implementation",
          title: "Secure Implementation",
          content:
            "Use cryptographically secure random number generators for private keys. Validate public keys to prevent small subgroup attacks. Clear sensitive data from memory after use.",
          quiz: {
            question: "Why should private keys use cryptographically secure randomness?",
            options: [
              "To make the code run faster",
              "To prevent predictable key generation",
              "To reduce memory usage",
              "To improve compatibility",
            ],
            correct: 1,
          },
        },
      ],
    },
  ]

  const currentModuleData = modules[currentModule]
  const currentStepData = currentModuleData.steps[currentStep]
  const totalSteps = modules.reduce((sum, module) => sum + module.steps.length, 0)
  const completedCount = completedSteps.size
  const progress = (completedCount / totalSteps) * 100

  const handleStepComplete = () => {
    const stepId = `${currentModuleData.id}-${currentStepData.id}`
    setCompletedSteps((prev) => new Set([...prev, stepId]))

    if (currentStep < currentModuleData.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1)
      setCurrentStep(0)
    } else {
      // Tutorial complete
      onComplete?.(currentModuleData.id)
    }
  }

  const handleQuizAnswer = (answer: number) => {
    const stepId = `${currentModuleData.id}-${currentStepData.id}`
    setQuizAnswers((prev) => ({ ...prev, [stepId]: answer }))
  }

  const isQuizCorrect = () => {
    const stepId = `${currentModuleData.id}-${currentStepData.id}`
    return quizAnswers[stepId] === currentStepData.quiz?.correct
  }

  return (
    <div className="max-w-4xl mx-auto">
      {onClose && (
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Guided Tutorial</CardTitle>
                <CardDescription>Interactive learning path for Diffie-Hellman mastery</CardDescription>
              </div>
            </div>
            <Badge variant="outline">
              {completedCount}/{totalSteps} Steps
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex gap-2">
              {modules.map((module, idx) => (
                <div
                  key={module.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    idx === currentModule
                      ? "bg-blue-100 text-blue-700"
                      : idx < currentModule
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {module.icon}
                  {module.title}
                  {idx < currentModule && <CheckCircle className="h-4 w-4" />}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentModuleData.icon}
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>
                Module {currentModule + 1}: {currentModuleData.title} • Step {currentStep + 1} of{" "}
                {currentModuleData.steps.length}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{currentStepData.content}</p>
          </div>

          {currentStepData.codeExample && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{currentStepData.codeExample}</code>
              </pre>
            </div>
          )}

          {currentStepData.quiz && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Knowledge Check
              </h4>
              <p className="mb-4">{currentStepData.quiz.question}</p>
              <div className="space-y-2">
                {currentStepData.quiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      quizAnswers[`${currentModuleData.id}-${currentStepData.id}`] === idx
                        ? idx === currentStepData.quiz!.correct
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-red-100 border-red-300 text-red-800"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1)
                } else if (currentModule > 0) {
                  setCurrentModule(currentModule - 1)
                  setCurrentStep(modules[currentModule - 1].steps.length - 1)
                }
              }}
              disabled={currentModule === 0 && currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleStepComplete}
              disabled={currentStepData.quiz && !isQuizCorrect()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentModule === modules.length - 1 && currentStep === currentModuleData.steps.length - 1
                ? "Complete Tutorial"
                : "Next Step"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
