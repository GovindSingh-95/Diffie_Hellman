"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, ArrowRight, Hash } from "lucide-react"

interface CalculationStep {
  step: number
  operation: string
  calculation: string
  result: number
  explanation: string
}

export function ModularExponentiationVisualizer() {
  const [base, setBase] = useState("5")
  const [exponent, setExponent] = useState("6")
  const [modulus, setModulus] = useState("23")
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [finalResult, setFinalResult] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateStepByStep = async () => {
    const g = Number.parseInt(base)
    const a = Number.parseInt(exponent)
    const p = Number.parseInt(modulus)

    if (isNaN(g) || isNaN(a) || isNaN(p) || p <= 1) return

    setIsCalculating(true)
    const calculationSteps: CalculationStep[] = []

    // Method: Repeated squaring (binary exponentiation)
    let result = 1
    let baseValue = g % p
    const exp = a
    let stepCount = 1

    // Initial step
    calculationSteps.push({
      step: stepCount++,
      operation: "Initialize",
      calculation: `result = 1, base = ${g} mod ${p} = ${baseValue}`,
      result: 1,
      explanation: "Start with result = 1 and reduce base modulo p",
    })

    // Convert exponent to binary for visualization
    const binaryExp = exp.toString(2)
    calculationSteps.push({
      step: stepCount++,
      operation: "Binary Conversion",
      calculation: `${exp} in binary = ${binaryExp}`,
      result: result,
      explanation: "Convert exponent to binary for efficient calculation",
    })

    // Process each bit from right to left
    for (let i = 0; i < binaryExp.length; i++) {
      const bit = binaryExp[binaryExp.length - 1 - i]

      if (bit === "1") {
        const oldResult = result
        result = (result * baseValue) % p
        calculationSteps.push({
          step: stepCount++,
          operation: `Bit ${i} = 1`,
          calculation: `result = (${oldResult} × ${baseValue}) mod ${p} = ${result}`,
          result: result,
          explanation: `Multiply result by current base value since bit ${i} is 1`,
        })
      } else {
        calculationSteps.push({
          step: stepCount++,
          operation: `Bit ${i} = 0`,
          calculation: `Skip multiplication (bit is 0)`,
          result: result,
          explanation: `No multiplication needed since bit ${i} is 0`,
        })
      }

      // Square the base for next iteration (except for last bit)
      if (i < binaryExp.length - 1) {
        const oldBase = baseValue
        baseValue = (baseValue * baseValue) % p
        calculationSteps.push({
          step: stepCount++,
          operation: "Square Base",
          calculation: `base = (${oldBase}²) mod ${p} = ${baseValue}`,
          result: result,
          explanation: "Square the base for the next bit position",
        })
      }
    }

    // Final result
    calculationSteps.push({
      step: stepCount,
      operation: "Final Result",
      calculation: `${g}^${a} mod ${p} = ${result}`,
      result: result,
      explanation: "The final result of modular exponentiation",
    })

    // Animate steps
    setSteps([])
    for (let i = 0; i < calculationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSteps((prev) => [...prev, calculationSteps[i]])
    }

    setFinalResult(result)
    setIsCalculating(false)
  }

  const reset = () => {
    setSteps([])
    setFinalResult(null)
    setIsCalculating(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-800">Modular Exponentiation Visualizer</h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Step-by-step visualization of computing g^a mod p using the efficient binary exponentiation method
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Input Parameters
          </CardTitle>
          <CardDescription>Enter the base (g), exponent (a), and modulus (p) for calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base">Base (g)</Label>
              <Input
                id="base"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="text-center font-mono text-lg"
                disabled={isCalculating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exponent">Exponent (a)</Label>
              <Input
                id="exponent"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                className="text-center font-mono text-lg"
                disabled={isCalculating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modulus">Modulus (p)</Label>
              <Input
                id="modulus"
                value={modulus}
                onChange={(e) => setModulus(e.target.value)}
                className="text-center font-mono text-lg"
                disabled={isCalculating}
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button onClick={calculateStepByStep} disabled={isCalculating} className="w-full">
                Calculate
              </Button>
              <Button onClick={reset} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equation Display */}
      <div className="text-center mb-8">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border">
          <div className="text-4xl font-mono font-bold text-slate-700 mb-4">
            {base}^{exponent} mod {modulus}
          </div>
          {finalResult !== null && (
            <div className="flex items-center justify-center gap-4">
              <ArrowRight className="h-6 w-6 text-purple-600" />
              <div className="text-5xl font-bold text-purple-600">{finalResult}</div>
            </div>
          )}
        </div>
      </div>

      {/* Calculation Steps */}
      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Calculation</CardTitle>
            <CardDescription>Binary exponentiation method for efficient modular exponentiation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    index === steps.length - 1 && isCalculating
                      ? "bg-yellow-50 border-yellow-200 animate-pulse"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        Step {step.step}
                      </Badge>
                      <span className="font-semibold text-slate-700">{step.operation}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      Result: {step.result}
                    </Badge>
                  </div>

                  <div className="mb-2">
                    <div className="font-mono text-lg bg-white p-3 rounded border">{step.calculation}</div>
                  </div>

                  <div className="text-sm text-slate-600 italic">{step.explanation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Algorithm Explanation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Binary Exponentiation Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Why This Method?</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Reduces O(n) multiplications to O(log n)</li>
                <li>• Essential for cryptographic operations</li>
                <li>• Prevents integer overflow with large numbers</li>
                <li>• Used in RSA, DH, and other crypto algorithms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Key Steps</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Convert exponent to binary representation</li>
                <li>• Process bits from right to left</li>
                <li>• Square base for each bit position</li>
                <li>• Multiply result when bit is 1</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
