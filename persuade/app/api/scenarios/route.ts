import { NextResponse } from "next/server"
import { getScenarioOptions, createScenarioOption, initializeScenarioOptions } from "@/lib/kv"

export async function POST(req: Request) {
  try {
    const option = await req.json()
    if (!option.category || !option.value || !option.label) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const newOption = await createScenarioOption(option)
    return NextResponse.json(newOption)
  } catch (error) {
    console.error("Error creating scenario option:", error)
    return NextResponse.json({ error: "Failed to create scenario option" }, { status: 500 })
  }
}

export async function GET() {
  try {
    let options = await getScenarioOptions()

    // Initialize default options if none exist
    if (!options.difficulties.length || !options.emotions.length) {
      await initializeScenarioOptions()
      options = await getScenarioOptions()
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error("Error fetching scenario options:", error)
    return NextResponse.json({ error: "Failed to fetch scenario options" }, { status: 500 })
  }
}

