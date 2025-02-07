import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { offerSdp, customerEmotion, callDifficulty } = await req.json();
    
    // Get ephemeral key from OpenAI
    const sessionResponse = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
      }),
    });
    const sessionData = await sessionResponse.json();
    const ephemeralKey = sessionData.client_secret.value;
  
    // Construct instructions
    const instructions = `You are an AI sales training simulator playing the role of a ${customerEmotion.toLowerCase()} customer. This is a ${callDifficulty.toLowerCase()} level conversation. Your responses should reflect the emotional state and difficulty level selected. Be natural and conversational, presenting realistic objections and concerns.`;
  
    // Send offer to OpenAI
    const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17&instructions=${encodeURIComponent(instructions)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp",
      },
      body: offerSdp,
    }
  )

  const answerSdp = await sdpResponse.text()
  return NextResponse.json({ answerSdp })
}
