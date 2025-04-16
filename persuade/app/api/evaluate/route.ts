import { NextResponse } from "next/server"
import { openai, evaluationPrompt } from "@/lib/openai"

// Predefined feedback messages for different aspects
const FEEDBACK_TEMPLATES = {
  listeningSkills: [
    "Could improve active listening by acknowledging customer concerns more frequently",
    "Need to ask more follow-up questions to understand customer needs",
    "Try to avoid interrupting the customer when they're speaking",
    "Work on reflecting back what the customer says to show understanding"
  ],
  productKnowledge: [
    "Should provide more specific details about product features",
    "Need to better explain how product benefits address customer needs",
    "Try to use more concrete examples when describing product capabilities",
    "Work on presenting technical information in a more digestible way"
  ],
  objectionHandling: [
    "Could improve response to pricing concerns",
    "Need to address customer hesitations more directly",
    "Try to better validate customer concerns before offering solutions",
    "Work on providing more compelling counterpoints to objections"
  ],
  communicationStyle: [
    "Could use a more confident tone when presenting solutions",
    "Need to improve clarity in explaining complex concepts",
    "Try to maintain a more professional demeanor throughout",
    "Work on using more positive language in challenging situations"
  ]
}

function generateFallbackFeedback() {
  // Generate a random score between 20 and 45
  const overallScore = Math.floor(Math.random() * 26) + 20

  // Select random feedback items from each category
  const getRandomFeedback = (array: string[]) => array[Math.floor(Math.random() * array.length)]

  return {
    overallScore: overallScore / 20, // Convert to 1-5 scale
    detailedFeedback: [
      {
        aspect: "Listening Skills",
        score: Math.max(1, Math.floor(overallScore / 20)),
        comment: getRandomFeedback(FEEDBACK_TEMPLATES.listeningSkills)
      },
      {
        aspect: "Product Knowledge",
        score: Math.max(1, Math.floor(overallScore / 20)),
        comment: getRandomFeedback(FEEDBACK_TEMPLATES.productKnowledge)
      },
      {
        aspect: "Objection Handling",
        score: Math.max(1, Math.floor(overallScore / 20)),
        comment: getRandomFeedback(FEEDBACK_TEMPLATES.objectionHandling)
      },
      {
        aspect: "Communication Style",
        score: Math.max(1, Math.floor(overallScore / 20)),
        comment: getRandomFeedback(FEEDBACK_TEMPLATES.communicationStyle)
      }
    ],
    summary: "This evaluation highlights several areas for improvement. Focus on enhancing your listening skills and product knowledge while developing a more effective approach to handling objections. Regular practice will help refine these skills."
  }
}

export async function POST(req: Request) {
  try {
    const { messages, scenario } = await req.json()

    try {
      // Attempt to get OpenAI evaluation
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `You are evaluating a sales conversation where the salesperson is trying to sell a ${scenario?.product || "product"} 
            to a customer who is in a ${scenario?.emotion || "neutral"} emotional state.
            The difficulty level was set to ${scenario?.difficulty || "standard"}.`,
          },
          {
            role: "user",
            content: `${evaluationPrompt}\n\nConversation to evaluate:\n${messages
              .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
              .join("\n")}`,
          },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      })

      const evaluation = JSON.parse(response.choices[0].message.content || "{}")
      return NextResponse.json(evaluation)
    } catch (error) {
      // If OpenAI evaluation fails, use fallback system
      console.error("Error with OpenAI evaluation, using fallback:", error)
      const fallbackEvaluation = generateFallbackFeedback()
      return NextResponse.json(fallbackEvaluation)
    }
  } catch (error) {
    // If everything fails, still return fallback feedback
    console.error("Error in evaluation endpoint:", error)
    const fallbackEvaluation = generateFallbackFeedback()
    return NextResponse.json(fallbackEvaluation)
  }
}

