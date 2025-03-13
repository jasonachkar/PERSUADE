import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

interface UserMetrics {
    totalSimulations: number
    totalTrainingTime: number
    lastSessionTime: number | null
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const metricsKey = `user:${userId}:metrics`
        const metrics = (await kv.get(metricsKey)) || {
            totalSimulations: 0,
            totalTrainingTime: 0,
            lastSessionTime: null
        }

        return NextResponse.json(metrics)
    } catch (error) {
        console.error('Error fetching metrics:', error)
        return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId, type, value } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const metricsKey = `user:${userId}:metrics`
        const currentMetrics = (await kv.get(metricsKey) || {
            totalSimulations: 0,
            totalTrainingTime: 0,
            lastSessionTime: null
        }) as UserMetrics

        switch (type) {
            case 'simulation_start':
                currentMetrics.totalSimulations += 1
                currentMetrics.lastSessionTime = Date.now()
                break
            case 'training_time':
                currentMetrics.totalTrainingTime += value
                break
            default:
                return NextResponse.json({ error: "Invalid metric type" }, { status: 400 })
        }

        await kv.set(metricsKey, currentMetrics)
        return NextResponse.json(currentMetrics)
    } catch (error) {
        console.error('Error updating metrics:', error)
        return NextResponse.json({ error: "Failed to update metrics" }, { status: 500 })
    }
} 