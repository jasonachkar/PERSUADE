"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { TrainingSession } from "@/lib/kv"

interface ProcessedFeedback {
  score: number
  strengths: string[]
  improvements: string[]
  summary: string
}

export default function Feedback() {
  const [feedback, setFeedback] = useState<ProcessedFeedback | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const processFeedback = async () => {
      try {
        const lastCallFeedback = localStorage.getItem("lastCallFeedback")
        const currentScenario = localStorage.getItem("currentScenario")
        const sessionDuration = localStorage.getItem("lastSessionDuration")

        if (lastCallFeedback && currentScenario && sessionDuration) {
          const feedbackData = JSON.parse(lastCallFeedback)
          const scenarioData = JSON.parse(currentScenario)
          const duration = Number.parseInt(sessionDuration)

          // Convert 5-point scale to 100-point scale
          const normalizedScore = Math.round(feedbackData.overallScore * 20)

          // Process detailed feedback into strengths and improvements
          const strengths: string[] = []
          const improvements: string[] = []

          feedbackData.detailedFeedback.forEach((item: { aspect: string; score: number; comment: string }) => {
            const points = item.comment.split(". ").filter(Boolean)
            if (item.score >= 4) {
              strengths.push(...points)
            } else {
              improvements.push(...points)
            }
          })

          // In a real app, you'd get the actual user ID from authentication
          const userId = "demo-user"

          const session: Partial<TrainingSession> = {
            id: crypto.randomUUID(),
            userId,
            startTime: Date.now() - duration,
            endTime: Date.now(),
            duration,
            overallScore: feedbackData.overallScore,
            detailedFeedback: feedbackData.detailedFeedback,
            scenario: scenarioData,
          }

          const response = await fetch("/api/training", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(session),
          })

          if (!response.ok) {
            throw new Error("Failed to save training session")
          }

          // Clear the localStorage items after successful save
          localStorage.removeItem("lastCallFeedback")
          localStorage.removeItem("currentScenario")
          localStorage.removeItem("lastSessionDuration")

          setFeedback({
            score: normalizedScore,
            strengths,
            improvements,
            summary: feedbackData.summary,
          })
        }
      } catch (error) {
        console.error("Error processing feedback:", error)
      } finally {
        setIsLoading(false)
      }
    }

    processFeedback()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Analyzing your performance...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No feedback available.</p>
            <Link href="/" className="block mt-4">
              <Button className="w-full">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl">Call Performance Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-2xl font-bold">{feedback.score}/100</span>
              </div>
              <Progress value={feedback.score} className="h-3" />
            </div>

            {/* Summary Section */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{feedback.summary}</p>
            </div>

            {/* Strengths Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                Strengths
              </h2>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-orange-500" />
                Areas for Improvement
              </h2>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-500 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/scenario-selection" className="flex-1">
                <Button className="w-full" size="lg">
                  Try Another Call
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

