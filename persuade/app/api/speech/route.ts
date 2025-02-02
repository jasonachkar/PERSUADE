import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    })

    // Convert the raw response to a ReadableStream
    const stream = mp3.body as ReadableStream

    // Return the audio stream
    return new Response(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Error generating speech" }, { status: 500 })
  }
}

