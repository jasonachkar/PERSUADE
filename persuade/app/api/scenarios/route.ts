import { NextResponse } from "next/server"
import { getScenarioOptions, initializeScenarioOptions } from "@/lib/kv"

export async function GET() {
  try {
    let options = await getScenarioOptions()

    // Initialize default options if none exist
    if (!options.difficulties.length || !options.emotions.length || !options.products.length) {
      await initializeScenarioOptions()
      options = await getScenarioOptions()
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error("Error fetching scenario options:", error)
    return NextResponse.json({ error: "Failed to fetch scenario options" }, { status: 500 })
  }
}

