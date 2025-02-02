import { NextResponse } from "next/server"
import { openai, initialSystemMessage } from "@/lib/openai"
import { StreamingTextResponse, OpenAIStream } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, audioTranscript } = await req.json()

    // Combine previous messages with the new transcript
    const conversationMessages = [initialSystemMessage, ...messages, { role: "user", content: audioTranscript }]

    // Get AI response
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationMessages,
      temperature: 0.7,
      stream: true,
    })

    // Create a stream for the text response
    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in conversation:", error)
    return NextResponse.json({ error: "Error processing conversation" }, { status: 500 })
  }
}

