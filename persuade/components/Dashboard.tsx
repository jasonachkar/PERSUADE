"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, BarChart2, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { TrainingSession } from "@/lib/kv"
import ProductsSection from "@/components/ProductsSection"
import { useAuth, SignInButton, SignIn } from "@clerk/nextjs"

interface DashboardData {
  sessions: TrainingSession[]
  totalSimulations: number
  totalTrainingTime: number
  lastSessionTime: number
}

export default function Dashboard() {
  const { userId } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [activeUsers, setActiveUsers] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data (simulation count and training time)
  useEffect(() => {
    if (!userId) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const [trainingResponse, metricsResponse] = await Promise.all([
          fetch(`/api/training?userId=${userId}`, { cache: "no-store" }),
          fetch(`/api/metrics?userId=${userId}`, { cache: "no-store" })
        ])

        if (!trainingResponse.ok || !metricsResponse.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const trainingData = await trainingResponse.json()
        const metricsData = await metricsResponse.json()

        setData({
          sessions: trainingData.sessions || [],
          totalSimulations: metricsData.totalSimulations || 0,
          totalTrainingTime: metricsData.totalTrainingTime || 0,
          lastSessionTime: metricsData.lastSessionTime || 0
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const intervalId = setInterval(fetchData, 30000)
    return () => clearInterval(intervalId)
  }, [userId])

  // Fetch active users count from /api/user-count.js
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch("/api/user-count.js", { cache: "no-store" })
        if (!response.ok) {
          throw new Error("Failed to fetch active users")
        }
        const result = await response.json()
        setActiveUsers(result.count)
      } catch (error) {
        console.error("Error fetching active users:", error)
        setActiveUsers(null)
      }
    }
    fetchActiveUsers()
  }, [])

  // Refetch dashboard data when window regains focus.
  useEffect(() => {
    const handleFocus = () => {
      if (!userId) return
      const fetchData = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/training?userId=${userId}`, {
            cache: "no-store",
          })
          if (!response.ok) {
            throw new Error("Failed to fetch dashboard data")
          }
          const result = await response.json()
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
  }, [userId])

  // If user is not logged in, render the SignIn component using hash-based routing.
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SignIn routing="hash" />
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary font-medium">Loading...</div>
      </div>
    )
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">PERSUADE</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered training platform for professional development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Simulations */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Simulations</CardTitle>
                <PhoneCall className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{data.totalSimulations}</div>
                <p className="text-xs text-muted-foreground">
                  {data.totalSimulations > 0 ? "+1 from last simulation" : "No simulations yet"}
                </p>
              </CardContent>
            </Card>

            {/* Average Score computed from simulation sessions */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {data.sessions.length
                    ? `${(
                      data.sessions.reduce((sum, session) => sum + (session.overallScore || 0), 0) /
                      data.sessions.length
                    ).toFixed(1)} / 5`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Based on all simulations</p>
              </CardContent>
            </Card>

            {/* Total Training Time */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Training Time</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatDuration(data.totalTrainingTime)}</div>
                <p className="text-xs text-muted-foreground">Time spent in simulation</p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{activeUsers !== null ? activeUsers : "N/A"}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            {userId ? (
              <Link href="/scenario-selection">
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                  Start New Simulation
                </Button>
              </Link>
            ) : (
              <SignInButton>
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                  Sign In to Start New Simulation
                </Button>
              </SignInButton>
            )}
          </div>

          <div className="space-y-8">
            <ProductsSection />

            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Recent Training Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.sessions.slice(-3).map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">
                            {session.scenario.product} - {session.scenario.difficulty}
                          </h3>
                          <p className="text-sm text-muted-foreground">Customer Emotion: {session.scenario.emotion}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">Score: {session.overallScore}/5</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.startTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

