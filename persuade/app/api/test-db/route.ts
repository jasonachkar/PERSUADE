import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export const dynamic = "force-dynamic"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function GET() {
  try {
    await redis.set("test", "Upstash works!")
    const result = await redis.get("test")
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Database connection failed:", error)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
}

