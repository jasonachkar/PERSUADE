import { NextResponse } from "next/server"
import { openai, evaluationPrompt } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a sales training evaluator. Analyze the conversation and provide detailed feedback.",
        },
        {
          role: "user",
          content: `${evaluationPrompt}\n\nConversation to evaluate:\n${messages
            .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
            .join("\n")}`,
        },
      ],
      temperature: 0.7,
    })

    const evaluation = JSON.parse(response.choices[0].message.content || "{}")
    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Error evaluating conversation:", error)
    return NextResponse.json({ error: "Error evaluating conversation" }, { status: 500 })
  }
}

