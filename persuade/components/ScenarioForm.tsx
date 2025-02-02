"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import type { ScenarioOption } from "@/lib/kv"

export default function ScenarioForm() {
  const [difficulty, setDifficulty] = useState("")
  const [emotion, setEmotion] = useState("")
  const [product, setProduct] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("Product")
  const [options, setOptions] = useState<{
    difficulties: ScenarioOption[]
    emotions: ScenarioOption[]
    products: ScenarioOption[]
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/scenarios")
        const data = await response.json()
        setOptions(data)
      } catch (error) {
        console.error("Error fetching scenario options:", error)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    const scenarioData = localStorage.getItem("currentScenario")
    if (scenarioData) {
      const { product } = JSON.parse(scenarioData)
      setSelectedProduct(product)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store the selected scenario in localStorage for the simulation
    localStorage.setItem(
      "currentScenario",
      JSON.stringify({
        difficulty,
        emotion,
        product,
      }),
    )
    router.push("/simulation")
  }

  if (!options) {
    return <div>Loading...</div>
  }

  const instructions = encodeURIComponent(
    `You are an AI sales training simulator playing the role of a ${emotion.toLowerCase()} customer 
     interested in ${selectedProduct}. This is a ${difficulty.toLowerCase()} level conversation.
     Your responses should reflect the emotional state and difficulty level selected.
     Be natural and conversational, presenting realistic objections and concerns specific to ${selectedProduct}.
     Focus on common customer pain points and objections related to this type of product.
     Maintain consistent character traits and product knowledge throughout the conversation.`
  )

  return (
    <Card className="neomorphic-flat max-w-md mx-auto bg-[#ffffff] text-[#161616]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Configure Your Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Call Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="neomorphic-flat bg-[#ffffff] border-[#7a5bfe]">
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
            <label htmlFor="emotion" className="text-sm font-medium">
              Customer Emotion
            </label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger id="emotion" className="neomorphic-flat bg-[#ffffff] border-[#7a5bfe]">
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
            <label htmlFor="product" className="text-sm font-medium">
              Product/Service
            </label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger id="product" className="neomorphic-flat bg-[#ffffff] border-[#7a5bfe]">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {options.products.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full neomorphic-flat hover:neomorphic-pressed transition-all duration-300 bg-[#7a5bfe] text-[#ffffff]"
          >
            Start Simulation
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

