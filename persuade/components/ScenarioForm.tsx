"use client"

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
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="veteran">Veteran</SelectItem>
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
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="non-caring">Non-caring</SelectItem>
                <SelectItem value="angry">Angry</SelectItem>
                <SelectItem value="confused">Confused</SelectItem>
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
                <SelectItem value="crm">CRM Software</SelectItem>
                <SelectItem value="erp">ERP System</SelectItem>
                <SelectItem value="marketing">Marketing Platform</SelectItem>
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

