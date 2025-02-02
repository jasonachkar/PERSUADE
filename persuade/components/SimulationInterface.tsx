"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChat } from "ai/react"

export default function SimulationInterface() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [animationLevel, setAnimationLevel] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const router = useRouter()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioElementRef = useRef<HTMLAudioElement>(null)

  const { messages, append } = useChat({
    api: "/api/conversation",
  })

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        audioChunksRef.current = []

        // Create form data with the audio
        const formData = new FormData()
        formData.append("audio", audioBlob)

        // Get transcription
        const transcriptionResponse = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        if (transcriptionResponse.ok) {
          const { text } = await transcriptionResponse.json()

          // Add transcription to chat and get AI response
          const result = await append({
            role: "user",
            content: text,
          })

          // Convert AI response to speech
          if (result?.role === "assistant" && result.content) {
            const speechResponse = await fetch("/api/speech", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: result.content }),
            })

            if (speechResponse.ok) {
              const audioBlob = await speechResponse.blob()
              const audioUrl = URL.createObjectURL(audioBlob)

              if (audioElementRef.current) {
                audioElementRef.current.src = audioUrl
                audioElementRef.current.play()
                setIsSpeaking(true)
              }
            }
          }
        }

        // Start recording again for continuous conversation
        mediaRecorder.start()
      }

      // Start recording in chunks
      mediaRecorder.start(3000) // Record in 3-second chunks
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const startCall = async () => {
    setIsCallActive(true)
    await startAudioAnalysis()
  }

  const endCall = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close()
    }

    setIsCallActive(false)

    // Get evaluation of the conversation
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      })

      if (response.ok) {
        const evaluation = await response.json()
        localStorage.setItem("lastCallFeedback", JSON.stringify(evaluation))
        router.push("/feedback")
      }
    } catch (error) {
      console.error("Error getting evaluation:", error)
    }
  }

  useEffect(() => {
    let animationFrame: number

    const updateAnimationLevel = () => {
      if (analyserRef.current && isRecording && !isSpeaking) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
        const normalizedLevel = average / 255 // Normalize to 0-1 range
        setAnimationLevel(normalizedLevel)
      }
      animationFrame = requestAnimationFrame(updateAnimationLevel)
    }

    if (isCallActive) {
      updateAnimationLevel()
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isCallActive, isRecording, isSpeaking])

  // Handle audio playback events
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.onplay = () => setIsSpeaking(true)
      audioElementRef.current.onended = () => setIsSpeaking(false)
      audioElementRef.current.onpause = () => setIsSpeaking(false)
    }
  }, [])

  return (
    <Card className="neomorphic-flat max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Live Call Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCallActive ? (
          <Button
            onClick={startCall}
            className="w-full py-8 text-xl neomorphic-flat hover:neomorphic-pressed transition-all duration-300"
          >
            Start Call
          </Button>
        ) : (
          <>
            <div className="h-96 flex items-center justify-center neomorphic-pressed rounded-lg relative overflow-hidden">
              <div
                className={`w-48 h-48 rounded-full absolute transition-all duration-75 ease-in-out ${
                  isSpeaking ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{
                  transform: `scale(${0.5 + animationLevel * 0.5})`,
                  boxShadow: `0 0 ${20 + animationLevel * 40}px ${10 + animationLevel * 20}px ${
                    isSpeaking ? "rgba(34, 197, 94, 0.5)" : "rgba(59, 130, 246, 0.5)"
                  }`,
                }}
              />
              <div
                className="z-10 text-white font-bold text-2xl transition-all duration-75 ease-in-out"
                style={{
                  transform: `scale(${1 + animationLevel * 0.2})`,
                }}
              >
                {isSpeaking ? "AI Speaking..." : "AI Listening..."}
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === "user" ? "text-blue-600" : "text-gray-800"}`}>
                  <strong>{message.role === "user" ? "You" : "AI"}:</strong> {message.content}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                onClick={endCall}
                className="neomorphic-flat hover:neomorphic-pressed transition-all duration-300 bg-red-500 text-white"
              >
                <PhoneOff className="mr-2" />
                End Call
              </Button>
            </div>
            <audio ref={audioElementRef} className="hidden" />
          </>
        )}
      </CardContent>
    </Card>
  )
}

