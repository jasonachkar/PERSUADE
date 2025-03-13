import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

interface TrainingSession {
  id: string
  userId: string
  scenario: {
    product: string
    difficulty: string
    emotion: string
  }
  startTime: number
  duration: number
  overallScore: number
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const sessionsKey = `user:${userId}:sessions`
    const sessions = await kv.lrange(sessionsKey, 0, -1) || []

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching training sessions:', error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await req.json()
    const { userId } = session

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const sessionWithId: TrainingSession = {
      ...session,
      id: nanoid()
    }

    const sessionsKey = `user:${userId}:sessions`
    await kv.lpush(sessionsKey, sessionWithId)
    // Keep only last 10 sessions
    await kv.ltrim(sessionsKey, 0, 9)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving training session:', error)
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 })
  }
}

