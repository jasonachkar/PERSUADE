"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, BarChart2, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [averageScore, setAverageScore] = useState<number | null>(null)

  useEffect(() => {
    // In a real app, this would come from a backend API
    const lastCallFeedback = localStorage.getItem("lastCallFeedback")
    if (lastCallFeedback) {
      const { overallScore } = JSON.parse(lastCallFeedback)
      setAverageScore(overallScore)
    }
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Sales Training Simulator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Simulations</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore ? `${averageScore.toFixed(1)} / 5` : "N/A"}</div>
            <p className="text-xs text-muted-foreground">Based on your last simulation</p>
          </CardContent>
        </Card>
        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Training Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45h 32m</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/scenario-selection">
          <Button className="neomorphic-flat hover:neomorphic-pressed transition-all duration-300 text-lg px-8 py-4 rounded-full">
            Start New Simulation
          </Button>
        </Link>
      </div>

      <Card className="neomorphic-flat mt-8">
        <CardHeader>
          <CardTitle>Recent Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[1, 2, 3].map((session) => (
              <li key={session} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <h3 className="font-semibold">Session #{session}</h3>
                  <p className="text-sm text-muted-foreground">Product: CRM Software</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Score: 8/10</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

