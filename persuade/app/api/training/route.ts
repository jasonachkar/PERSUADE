import { NextResponse } from "next/server"
import { saveTrainingSession, getTrainingSessions, getUserStats } from "@/lib/kv"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const session = await req.json()
    const sessionId = nanoid()

    await saveTrainingSession({
      id: sessionId,
      ...session,
      startTime: Date.now(),
    })

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error("Error saving training session:", error)
    return NextResponse.json({ error: "Failed to save training session" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    console.log("Received request for user:", userId)

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const [sessionsData, stats] = await Promise.all([getTrainingSessions(userId), getUserStats(userId)])
    console.log("Fetched sessions data:", sessionsData)
    console.log("Fetched user stats:", stats)

    const response = {
      sessions: sessionsData.sessions,
      totalSimulations: sessionsData.totalCount,
      totalTrainingTime: stats.totalTrainingTime,
      lastSessionTime: stats.lastSessionTime,
    }
    console.log("Sending response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching training data:", error)
    return NextResponse.json({ error: "Failed to fetch training data" }, { status: 500 })
  }
}

