"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ChevronDown, ChevronRight, BookOpen, Code, HelpCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface QAItem {
  id: string
  question: string
  answer: string
  category: "security" | "mathematics" | "implementation" | "theory"
  difficulty: "beginner" | "intermediate" | "advanced"
  codeExample?: string
  formula?: string
  tags: string[]
}

const qaItems: QAItem[] = [
  {
    id: "why-secure",
    question: "Why is Diffie-Hellman considered secure?",
    answer:
      "Diffie-Hellman security relies on the discrete logarithm problem - given g, p, and g^x mod p, it's computationally infeasible to find x. Even though the public keys g^a mod p and g^b mod p are transmitted openly, an attacker cannot compute the shared secret g^(ab) mod p without solving the discrete logarithm problem, which is believed to be hard for large primes.",
    category: "security",
    difficulty: "beginner",
    formula: "Given: g, p, g^x mod p → Find: x (discrete logarithm problem)",
    tags: ["discrete-logarithm", "computational-hardness", "public-key"],
  },
  {
    id: "primitive-root",
    question: "What is a primitive root and why is it important?",
    answer:
      "A primitive root modulo p is a generator g such that its powers g^1, g^2, ..., g^(p-1) generate all non-zero elements modulo p. This ensures the largest possible key space and prevents the key exchange from being limited to a small subgroup, which would make it vulnerable to attacks.",
    category: "mathematics",
    difficulty: "intermediate",
    formula: "g is primitive root mod p ⟺ order(g) = p-1",
    codeExample: `def is_primitive_root(g, p):
    """Check if g is a primitive root modulo p"""
    if gcd(g, p) != 1:
        return False
    
    # Check if g^((p-1)/q) ≢ 1 (mod p) for all prime factors q of p-1
    factors = prime_factors(p - 1)
    for q in factors:
        if pow(g, (p - 1) // q, p) == 1:
            return False
    return True`,
    tags: ["generator", "group-theory", "mathematics"],
  },
  {
    id: "compute-secret",
    question: "How can't attackers compute the shared secret?",
    answer:
      "Attackers can observe g^a mod p and g^b mod p, but computing g^(ab) mod p from these values requires solving the Computational Diffie-Hellman (CDH) problem. This is believed to be as hard as the discrete logarithm problem. Even with quantum computers, Shor's algorithm would be needed, requiring large-scale quantum computers not yet available.",
    category: "security",
    difficulty: "intermediate",
    formula: "CDH Problem: Given g^a mod p, g^b mod p → Compute g^(ab) mod p",
    tags: ["cdh-problem", "quantum-resistance", "cryptanalysis"],
  },
  {
    id: "safe-primes",
    question: "What are safe primes and why use them?",
    answer:
      "A safe prime is a prime p where p = 2q + 1 and q is also prime (called a Sophie Germain prime). Safe primes prevent certain attacks like the Pohlig-Hellman algorithm, which can solve discrete logarithms efficiently when p-1 has only small prime factors. Using safe primes ensures the multiplicative group has a large prime-order subgroup.",
    category: "mathematics",
    difficulty: "advanced",
    formula: "Safe prime: p = 2q + 1 where both p and q are prime",
    codeExample: `def is_safe_prime(p):
    """Check if p is a safe prime"""
    if not is_prime(p):
        return False
    
    q = (p - 1) // 2
    return is_prime(q)

# Example safe primes
safe_primes = [5, 7, 11, 23, 47, 59, 83, 107, 167, 179, 227, 263, 347, 359, 383, 467, 479, 503, 563, 587, 719, 839, 863, 887, 983, 1019, 1187, 1283, 1307, 1319, 1367, 1439, 1487, 1523, 1619, 1823, 1907]`,
    tags: ["safe-primes", "pohlig-hellman", "number-theory"],
  },
  {
    id: "forward-secrecy",
    question: "What is Perfect Forward Secrecy (PFS)?",
    answer:
      "Perfect Forward Secrecy ensures that if long-term keys are compromised, past communication sessions remain secure. In DH, this is achieved by using ephemeral (temporary) key pairs for each session. Even if an attacker later obtains the private keys, they cannot decrypt previously recorded sessions because each session used different, discarded keys.",
    category: "security",
    difficulty: "intermediate",
    tags: ["forward-secrecy", "ephemeral-keys", "session-security"],
  },
  {
    id: "implementation-attacks",
    question: "What are common implementation vulnerabilities?",
    answer:
      "Common DH implementation vulnerabilities include: timing attacks on modular exponentiation, weak random number generation for private keys, insufficient parameter validation, small subgroup attacks, and invalid curve attacks in ECDH. Proper implementations use constant-time algorithms, validated parameters, and strong entropy sources.",
    category: "implementation",
    difficulty: "advanced",
    codeExample: `# Secure DH implementation considerations
def secure_dh_keygen(p, g):
    # Use cryptographically secure random number generator
    private_key = secrets.randbelow(p - 2) + 1
    
    # Use constant-time modular exponentiation
    public_key = pow(g, private_key, p)
    
    # Validate parameters
    assert is_prime(p), "p must be prime"
    assert 1 < g < p, "g must be in range (1, p)"
    assert pow(g, (p-1)//2, p) != 1, "g should have large order"
    
    return private_key, public_key`,
    tags: ["timing-attacks", "parameter-validation", "secure-implementation"],
  },
  {
    id: "key-sizes",
    question: "What key sizes should be used for security?",
    answer:
      "NIST recommends minimum 2048-bit primes for new systems, with 3072-bit for future-proofing. The security level roughly corresponds to: 1024-bit ≈ 80-bit security, 2048-bit ≈ 112-bit security, 3072-bit ≈ 128-bit security. For comparison with symmetric crypto: 2048-bit DH ≈ 112-bit AES, 3072-bit DH ≈ 128-bit AES.",
    category: "implementation",
    difficulty: "beginner",
    tags: ["key-sizes", "nist-recommendations", "security-levels"],
  },
  {
    id: "elliptic-curve",
    question: "How does Elliptic Curve Diffie-Hellman (ECDH) differ?",
    answer:
      "ECDH uses elliptic curves instead of modular arithmetic. The discrete logarithm problem on elliptic curves is believed to be harder, allowing smaller key sizes for equivalent security. A 256-bit ECDH key provides similar security to a 3072-bit traditional DH key, making ECDH more efficient for mobile and embedded devices.",
    category: "theory",
    difficulty: "advanced",
    formula: "ECDH: Point multiplication P = k·G on elliptic curve",
    codeExample: `# ECDH key exchange (conceptual)
# Alice generates key pair
alice_private = random_scalar()
alice_public = alice_private * G  # Point multiplication

# Bob generates key pair  
bob_private = random_scalar()
bob_public = bob_private * G

# Both compute same shared secret
shared_secret_alice = alice_private * bob_public
shared_secret_bob = bob_private * alice_public
# shared_secret_alice == shared_secret_bob`,
    tags: ["elliptic-curves", "ecdh", "efficiency"],
  },
]

export function CryptoQAAccordion() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredItems = qaItems.filter((item) => {
    const categoryMatch = filterCategory === "all" || item.category === filterCategory
    const difficultyMatch = filterDifficulty === "all" || item.difficulty === filterDifficulty
    return categoryMatch && difficultyMatch
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "bg-red-100 text-red-800 border-red-200"
      case "mathematics":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "implementation":
        return "bg-green-100 text-green-800 border-green-200"
      case "theory":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-800">Cryptography Q&A</h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Interactive knowledge base with detailed explanations, formulas, and code examples for understanding
          Diffie-Hellman key exchange
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filter Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {["all", "security", "mathematics", "implementation", "theory"].map((category) => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {["all", "beginner", "intermediate", "advanced"].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={filterDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterDifficulty(difficulty)}
                    className="capitalize"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Q&A Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <Collapsible open={openItems.includes(item.id)} onOpenChange={() => toggleItem(item.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-left flex items-center gap-2">
                        {openItems.includes(item.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {item.question}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                        <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Answer */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                    </div>

                    {/* Formula */}
                    {item.formula && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-800 flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            Mathematical Formula
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.formula!)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-mono text-sm bg-white p-3 rounded border">{item.formula}</div>
                      </div>
                    )}

                    {/* Code Example */}
                    {item.codeExample && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800 flex items-center gap-1">
                            <Code className="h-4 w-4" />
                            Code Example
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.codeExample!)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="font-mono text-sm bg-white p-3 rounded border overflow-x-auto">
                          <code>{item.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {/* All Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No questions match your current filters.</p>
            <Button
              onClick={() => {
                setFilterCategory("all")
                setFilterDifficulty("all")
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Knowledge Base Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-700">{qaItems.length}</div>
              <div className="text-sm text-slate-600">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {qaItems.filter((item) => item.codeExample).length}
              </div>
              <div className="text-sm text-blue-600">With Code Examples</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{qaItems.filter((item) => item.formula).length}</div>
              <div className="text-sm text-green-600">With Formulas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {new Set(qaItems.flatMap((item) => item.tags)).size}
              </div>
              <div className="text-sm text-purple-600">Unique Tags</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
