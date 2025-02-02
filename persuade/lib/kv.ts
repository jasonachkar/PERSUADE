import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"

// Types
export interface TrainingSession {
  id: string
  userId: string
  startTime: number
  endTime: number
  duration: number
  overallScore: number
  detailedFeedback: {
    aspect: string
    score: number
    comment: string
  }[]
  scenario: {
    difficulty: string
    emotion: string
    product: string
  }
}

export interface UserStats {
  totalSimulations: number
  totalTrainingTime: number // in milliseconds
  lastSessionTime: number
}

export interface ScenarioOption {
  id: string
  category: string
  value: string
  label: string
}

export interface Product {
  id: string
  name: string
  imageUrl: string
  description: string
  createdAt: number
}

// Products
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await kv.hgetall("products") // Get all products from hash
    if (!products) return []

    return Object.values(products)
      .map((product) => (typeof product === "string" ? JSON.parse(product) : product))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error("Error fetching products from KV:", error)
    return []
  }
}

export async function createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const id = nanoid()
  const timestamp = Date.now()

  const newProduct = {
    ...product,
    id,
    createdAt: timestamp,
  }

  try {
    await kv.hset("products", {
      [id]: JSON.stringify(newProduct),
    })
    return newProduct
  } catch (error) {
    console.error("Error creating product in KV:", error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await kv.hdel("products", id)
  } catch (error) {
    console.error("Error deleting product from KV:", error)
    throw error
  }
}

// Training Sessions
export async function saveTrainingSession(session: TrainingSession) {
  const key = `training:${session.userId}:${session.id}`
  await kv.set(key, JSON.stringify(session))
  await kv.zadd(`training:${session.userId}:sessions`, {
    score: session.startTime,
    member: session.id,
  })

  // Update user stats
  await incrementTotalSimulations(session.userId)
  await updateTotalTrainingTime(session.userId, session.duration)
}

export async function getTrainingSessions(
  userId: string,
  limit = 10,
): Promise<{
  sessions: TrainingSession[]
  totalCount: number
}> {
  const sessionIds = await kv.zrange(`training:${userId}:sessions`, -limit, -1)
  const totalCount = await kv.zcard(`training:${userId}:sessions`)

  const sessions = await Promise.all(
    sessionIds.map(async (id) => {
      const session = await kv.get(`training:${userId}:${id}`)
      return session ? JSON.parse(session as string) : null
    }),
  )

  return {
    sessions: sessions.filter(Boolean),
    totalCount,
  }
}

// User Stats
export async function getUserStats(userId: string): Promise<UserStats> {
  const stats = await kv.get<UserStats>(`user:${userId}:stats`)
  return (
    stats || {
      totalSimulations: 0,
      totalTrainingTime: 0,
      lastSessionTime: 0,
    }
  )
}

export async function incrementTotalSimulations(userId: string): Promise<number> {
  const key = `user:${userId}:stats`
  const stats = await getUserStats(userId)

  const updatedStats = {
    ...stats,
    totalSimulations: (stats.totalSimulations || 0) + 1,
    lastSessionTime: Date.now(),
  }

  await kv.set(key, updatedStats)
  return updatedStats.totalSimulations
}

export async function updateTotalTrainingTime(userId: string, duration: number): Promise<number> {
  const key = `user:${userId}:stats`
  const stats = await getUserStats(userId)

  const updatedStats = {
    ...stats,
    totalTrainingTime: (stats.totalTrainingTime || 0) + duration,
  }

  await kv.set(key, updatedStats)
  return updatedStats.totalTrainingTime
}

export async function getAverageScore(userId: string): Promise<number | null> {
  const sessions = await getTrainingSessions(userId)
  if (sessions.sessions.length === 0) return null

  const total = sessions.sessions.reduce((sum, session) => sum + session.overallScore, 0)
  return total / sessions.sessions.length
}

export async function getTotalTrainingTime(userId: string): Promise<number> {
  const sessions = await getTrainingSessions(userId)
  return sessions.sessions.reduce((total, session) => total + session.duration, 0)
}

export async function getTotalSimulations(userId: string): Promise<number> {
  const stats = await getUserStats(userId)
  return stats.totalSimulations || 0
}

// Scenarios
export async function getScenarioOptions(): Promise<{
  difficulties: ScenarioOption[]
  emotions: ScenarioOption[]
  products: ScenarioOption[]
}> {
  const [difficulties, emotions, products] = await Promise.all([
    kv.get("scenarios:difficulties"),
    kv.get("scenarios:emotions"),
    kv.get("scenarios:products"),
  ])

  return {
    difficulties: (difficulties as ScenarioOption[]) || [],
    emotions: (emotions as ScenarioOption[]) || [],
    products: (products as ScenarioOption[]) || [],
  }
}

export async function initializeScenarioOptions() {
  const defaultOptions = {
    difficulties: [
      { id: "1", category: "difficulty", value: "beginner", label: "Beginner" },
      { id: "2", category: "difficulty", value: "intermediate", label: "Intermediate" },
      { id: "3", category: "difficulty", value: "advanced", label: "Advanced" },
      { id: "4", category: "difficulty", value: "veteran", label: "Veteran" },
    ],
    emotions: [
      { id: "1", category: "emotion", value: "happy", label: "Happy" },
      { id: "2", category: "emotion", value: "non-caring", label: "Non-caring" },
      { id: "3", category: "emotion", value: "angry", label: "Angry" },
      { id: "4", category: "emotion", value: "confused", label: "Confused" },
    ],
    products: [
      { id: "1", category: "product", value: "crm", label: "CRM Software" },
      { id: "2", category: "product", value: "erp", label: "ERP System" },
      { id: "3", category: "product", value: "marketing", label: "Marketing Platform" },
    ],
  }

  await Promise.all([
    kv.set("scenarios:difficulties", JSON.stringify(defaultOptions.difficulties)),
    kv.set("scenarios:emotions", JSON.stringify(defaultOptions.emotions)),
    kv.set("scenarios:products", JSON.stringify(defaultOptions.products)),
  ])
}

