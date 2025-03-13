"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import type { ScenarioOption, Product } from "@/lib/kv"

export default function ScenarioForm() {
  const [difficulty, setDifficulty] = useState("")
  const [emotion, setEmotion] = useState("")
  const [product, setProduct] = useState("")
  const [options, setOptions] = useState<{
    difficulties: ScenarioOption[]
    emotions: ScenarioOption[]
  } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scenario options (difficulties and emotions)
        const scenarioResponse = await fetch("/api/scenarios")
        const scenarioData = await scenarioResponse.json()
        setOptions({
          difficulties: scenarioData.difficulties,
          emotions: scenarioData.emotions,
        })

        // Fetch products
        const productsResponse = await fetch("/api/products")
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Store scenario data
    localStorage.setItem(
      "currentScenario",
      JSON.stringify({
        difficulty,
        emotion,
        product,
      }),
    )

    try {
      // Update metrics for simulation start
      await fetch("/api/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type: "simulation_start"
        }),
      })
    } catch (error) {
      console.error("Error updating metrics:", error)
    }

    router.push("/simulation")
  }

  if (!options) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Configure Scenario</h1>
            <p className="text-muted-foreground">
              Customize your training simulation by selecting the parameters below
            </p>
          </div>

          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-medium text-gray-900">
                    Call Difficulty
                  </label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger
                      id="difficulty"
                      className="w-full bg-white border-gray-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.difficulties.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="emotion" className="text-sm font-medium text-gray-900">
                    Customer Emotion
                  </label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger
                      id="emotion"
                      className="w-full bg-white border-gray-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    >
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.emotions.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="product" className="text-sm font-medium text-gray-900">
                    Product/Service
                  </label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger
                      id="product"
                      className="w-full bg-white border-gray-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    >
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-11 rounded-md shadow-md hover:shadow-lg transition-all"
                  disabled={!difficulty || !emotion || !product}
                >
                  Start Simulation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

