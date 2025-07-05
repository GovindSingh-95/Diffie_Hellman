"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calculator, Info, Play, RotateCcw } from "lucide-react"

interface CalculationStep {
  step: number
  description: string
  calculation: string
  result: number
}

export function ModularExponentiationDemo() {
  const [g, setG] = useState<string>("5")
  const [a, setA] = useState<string>("6")
  const [p, setP] = useState<string>("23")
  const [result, setResult] = useState<number | null>(null)
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const calculateModularExponentiation = async () => {
    const base = Number.parseInt(g)
    const exponent = Number.parseInt(a)
    const modulus = Number.parseInt(p)

    if (isNaN(base) || isNaN(exponent) || isNaN(modulus) || modulus <= 1) {
      return
    }

    setIsCalculating(true)
    setCurrentStep(0)
    const calculationSteps: CalculationStep[] = []

    // Step-by-step calculation using binary exponentiation
    let result = 1
    let baseValue = base % modulus
    const exp = exponent

    calculationSteps.push({
      step: 1,
      description: "Initialize",
      calculation: `result = 1, base = ${base} mod ${modulus} = ${baseValue}`,
      result: 1,
    })

    let stepCount = 2
    const binaryExp = exp.toString(2)

    calculationSteps.push({
      step: stepCount++,
      description: "Convert exponent to binary",
      calculation: `${exp} in binary = ${binaryExp}`,
      result: result,
    })

    // Process each bit from right to left
    for (let i = 0; i < binaryExp.length; i++) {
      const bit = binaryExp[binaryExp.length - 1 - i]

      if (bit === "1") {
        const oldResult = result
        result = (result * baseValue) % modulus
        calculationSteps.push({
          step: stepCount++,
          description: `Bit ${i} is 1: multiply result by base`,
          calculation: `${oldResult} × ${baseValue} mod ${modulus} = ${result}`,
          result: result,
        })
      }

      if (i < binaryExp.length - 1) {
        const oldBase = baseValue
        baseValue = (baseValue * baseValue) % modulus
        calculationSteps.push({
          step: stepCount++,
          description: `Square the base for next bit`,
          calculation: `${oldBase}² mod ${modulus} = ${baseValue}`,
          result: result,
        })
      }
    }

    calculationSteps.push({
      step: stepCount,
      description: "Final result",
      calculation: `${g}^${a} mod ${p} = ${result}`,
      result: result,
    })

    setSteps(calculationSteps)

    // Animate through steps
    for (let i = 0; i < calculationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCurrentStep(i + 1)
    }

    setResult(result)
    setIsCalculating(false)
  }

  const reset = () => {
    setResult(null)
    setSteps([])
    setCurrentStep(0)
    setIsCalculating(false)
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-purple-700">Modular Exponentiation</CardTitle>
          </div>
          <CardDescription>
            Interactive demonstration of A = g^a mod p calculation used in Diffie-Hellman
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="g-input" className="flex items-center gap-1">
                g (base)
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generator - a primitive root modulo p</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="g-input"
                value={g}
                onChange={(e) => setG(e.target.value)}
                className="text-center font-mono"
                disabled={isCalculating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-input" className="flex items-center gap-1">
                a (exponent)
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Private key - secret exponent</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="a-input"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="text-center font-mono"
                disabled={isCalculating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-input" className="flex items-center gap-1">
                p (modulus)
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Prime number - public parameter</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="p-input"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className="text-center font-mono"
                disabled={isCalculating}
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button onClick={calculateModularExponentiation} disabled={isCalculating} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Equation Display */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border">
            <div className="text-2xl font-mono font-bold text-slate-700 mb-2">
              A = {g}^{a} mod {p}
            </div>
            {result !== null && <div className="text-3xl font-bold text-purple-600">A = {result}</div>}
          </div>

          {/* Calculation Steps */}
          {steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-700">Calculation Steps:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      index < currentStep
                        ? "bg-green-50 border-green-200"
                        : index === currentStep - 1 && isCalculating
                          ? "bg-yellow-50 border-yellow-200 animate-pulse"
                          : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < currentStep ? "default" : "secondary"}>Step {step.step}</Badge>
                        <span className="font-medium text-slate-700">{step.description}</span>
                      </div>
                      {index < currentStep && (
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 font-mono text-sm text-slate-600 bg-white p-2 rounded border">
                      {step.calculation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
