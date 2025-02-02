"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, BarChart2, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { TrainingSession } from "@/lib/kv"
import ProductsSection from "@/components/ProductsSection"

interface DashboardData {
  sessions: TrainingSession[]
  totalSimulations: number
  totalTrainingTime: number
  lastSessionTime: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "demo-user"
        console.log("Fetching data for user:", userId)
        const response = await fetch(`/api/training?userId=${userId}`, {
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const result = await response.json()
        console.log("Fetched data:", result)
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Add event listener for focus to refresh data
  useEffect(() => {
    const handleFocus = () => {
      const fetchData = async () => {
        try {
          const userId = "demo-user"
          console.log("Fetching data for user:", userId)
          const response = await fetch(`/api/training?userId=${userId}`, {
            cache: "no-store",
          })
          if (!response.ok) {
            throw new Error("Failed to fetch dashboard data")
          }
          const result = await response.json()
          console.log("Fetched data:", result)
          setData(result)
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getLastSessionText = () => {
    if (!data?.lastSessionTime) return "No sessions yet"
    const now = Date.now()
    const diff = now - data.lastSessionTime
    if (diff < 1000 * 60 * 60) {
      // Less than 1 hour
      return "+1 from last session"
    }
    return "No recent sessions"
  }

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
            <div className="text-2xl font-bold">{data?.totalSimulations ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.totalSimulations ? "+1 from last session" : "No sessions yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.sessions.length
                ? `${(data.sessions.reduce((sum, session) => sum + session.overallScore, 0) / data.sessions.length).toFixed(1)} / 5`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Based on all simulations</p>
          </CardContent>
        </Card>

        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Training Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(data?.totalTrainingTime || 0)}</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card className="neomorphic-flat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Current session</p>
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

      <ProductsSection />

      <Card className="neomorphic-flat mt-8">
        <CardHeader>
          <CardTitle>Recent Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data?.sessions.slice(-3).map((session) => (
              <li key={session.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <h3 className="font-semibold">
                    {session.scenario.product} - {session.scenario.difficulty}
                  </h3>
                  <p className="text-sm text-muted-foreground">Customer Emotion: {session.scenario.emotion}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Score: {session.overallScore}/5</p>
                  <p className="text-sm text-muted-foreground">{new Date(session.startTime).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

