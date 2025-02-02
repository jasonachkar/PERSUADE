import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const initialSystemMessage = {
  role: "system",
  content: `You are an AI sales training simulator. You play the role of a potential customer interested in various products/services. 
  Be natural, conversational, and reflect realistic customer behaviors. Present common objections and concerns.
  Maintain consistent character traits and preferences throughout the conversation.
  Your responses should be concise and conversational, as they will be converted to speech.`,
}

export const evaluationPrompt = `Analyze the sales conversation and provide a detailed evaluation with scores in the following format:

{
  "overallScore": (1-5),
  "detailedFeedback": [
    {
      "aspect": "Listening Skills",
      "score": (1-5),
      "comment": "Detailed feedback on how well they listened and responded to customer needs"
    },
    {
      "aspect": "Product Knowledge",
      "score": (1-5),
      "comment": "Evaluation of their product knowledge and ability to explain benefits"
    },
    {
      "aspect": "Objection Handling",
      "score": (1-5),
      "comment": "Assessment of how well they addressed customer concerns"
    },
    {
      "aspect": "Communication Style",
      "score": (1-5),
      "comment": "Feedback on clarity, tone, and professionalism"
    }
  ],
  "summary": "Overall evaluation summary and key improvement areas"
}`

