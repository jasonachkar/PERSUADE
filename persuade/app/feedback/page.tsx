"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Feedback() {
  const [feedback, setFeedback] = useState<any>(null)

  useEffect(() => {
    const lastCallFeedback = localStorage.getItem("lastCallFeedback")
    if (lastCallFeedback) {
      setFeedback(JSON.parse(lastCallFeedback))
    }
  }, [])

  if (!feedback) return <div>Loading...</div>

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Call Feedback</h1>
      <Card className="neomorphic-flat max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Overall Score: {feedback.overallScore}/5</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Detailed Feedback</h2>
          {feedback.detailedFeedback.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-medium">
                {item.aspect}: {item.score}/5
              </h3>
              <p>{item.comment}</p>
            </div>
          ))}
          <Link href="/">
            <Button className="mt-4 neomorphic-flat hover:neomorphic-pressed transition-all duration-300">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

