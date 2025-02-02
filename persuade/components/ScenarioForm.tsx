"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function ScenarioForm() {
  const [difficulty, setDifficulty] = useState("")
  const [emotion, setEmotion] = useState("")
  const [product, setProduct] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the form and then navigate to the simulation
    router.push("/simulation")
  }

  return (
    <Card className="neomorphic-flat max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configure Your Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Call Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="neomorphic-flat">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="emotion" className="text-sm font-medium">
              Customer Emotion
            </label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger id="emotion" className="neomorphic-flat">
                <SelectValue placeholder="Select emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="indifferent">Indifferent</SelectItem>
                <SelectItem value="frustrated">Frustrated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="product" className="text-sm font-medium">
              Product/Service
            </label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger id="product" className="neomorphic-flat">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crm">CRM Software</SelectItem>
                <SelectItem value="erp">ERP System</SelectItem>
                <SelectItem value="marketing">Marketing Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full neomorphic-flat hover:neomorphic-pressed transition-all duration-300">
            Start Simulation
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

