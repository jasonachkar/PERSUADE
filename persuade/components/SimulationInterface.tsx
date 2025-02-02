"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Menu, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChat } from "ai/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SimulationInterface() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [animationLevel, setAnimationLevel] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [customerEmotion, setCustomerEmotion] = useState("Happy")
  const [callDifficulty, setCallDifficulty] = useState("Beginner")
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const router = useRouter()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioElementRef = useRef<HTMLAudioElement>(null)

  const { append } = useChat({
    api: "/api/conversation",
  })

  const startAudioAnalysis = async () => {
    try {
      setSessionStartTime(Date.now()) // Record start time
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

        const formData = new FormData()
        formData.append("audio", audioBlob)
        formData.append("customerEmotion", customerEmotion)
        formData.append("callDifficulty", callDifficulty)

        const transcriptionResponse = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        if (transcriptionResponse.ok) {
          const { text } = await transcriptionResponse.json()

          const result = await append({
            role: "user",
            content: text,
          })

          if (result?.role === "assistant" && result.content) {
            const speechResponse = await fetch("/api/speech", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: result.content,
                customerEmotion,
                callDifficulty,
              }),
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

        mediaRecorder.start()
      }

      mediaRecorder.start(3000)
      setIsRecording(true)
      setIsCallActive(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      if (audioContextRef.current) {
        await audioContextRef.current.close()
      }

      // Calculate session duration
      if (sessionStartTime) {
        const endTime = Date.now()
        const duration = endTime - sessionStartTime

        // Save session duration to localStorage for feedback page
        localStorage.setItem("lastSessionDuration", duration.toString())
      }

      setIsRecording(false)
      setIsCallActive(false)
      router.push("/feedback")
    } else {
      await startAudioAnalysis()
    }
  }

  useEffect(() => {
    let animationFrame: number

    const updateAnimationLevel = () => {
      if (analyserRef.current && isRecording && !isSpeaking) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
        const normalizedLevel = average / 255
        setAnimationLevel(normalizedLevel)
      } else {
        setAnimationLevel(0)
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

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.onplay = () => setIsSpeaking(true)
      audioElementRef.current.onended = () => setIsSpeaking(false)
      audioElementRef.current.onpause = () => setIsSpeaking(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#161616]">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="text-[#161616]">
          <Menu className="h-6 w-6" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#161616]">
              <Settings className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Simulation Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerEmotion" className="text-right">
                  Customer Emotion
                </Label>
                <Select value={customerEmotion} onValueChange={setCustomerEmotion}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select customer emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Happy">Happy</SelectItem>
                    <SelectItem value="Non-caring">Non-caring</SelectItem>
                    <SelectItem value="Angry">Angry</SelectItem>
                    <SelectItem value="Confused">Confused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="callDifficulty" className="text-right">
                  Call Difficulty
                </Label>
                <Select value={callDifficulty} onValueChange={setCallDifficulty}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select call difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Veteran">Veteran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        {/* AI Character */}
        <div className="relative w-64 h-64">
          <div
            className="absolute inset-0 bg-[#ffffff] rounded-full shadow-lg transform-gpu transition-all duration-300 ease-in-out"
            style={{
              transform: `scale(${1 + animationLevel * 0.2})`,
              boxShadow: `0 0 ${20 + animationLevel * 40}px ${10 + animationLevel * 20}px rgba(122, 91, 254, 0.5)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-[#000000] rounded-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8 w-32">
                    <div
                      className="w-10 h-10 rounded-full bg-[#95f9ff] transition-all duration-300 ease-in-out"
                      style={{
                        transform: `scale(${1 + animationLevel * 0.5})`,
                        opacity: 0.7 + animationLevel * 0.3,
                      }}
                    />
                    <div
                      className="w-10 h-10 rounded-full bg-[#95f9ff] transition-all duration-300 ease-in-out"
                      style={{
                        transform: `scale(${1 + animationLevel * 0.5})`,
                        opacity: 0.7 + animationLevel * 0.3,
                      }}
                    />
                  </div>
                </div>
                <div
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-50%) scale(${1 + animationLevel * 0.3})`,
                  }}
                >
                  <div className="text-[#95f9ff] text-4xl">{isSpeaking ? "ω" : "ᵕ◡ᵕ"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-16">
          <Button
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full ${
              isRecording ? "bg-[#ff0000] hover:bg-[#cc0000]" : "bg-[#7a5bfe] hover:bg-[#6a4bfe]"
            } text-[#ffffff] shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110`}
          >
            <Mic className={`h-10 w-10 ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
        </div>

        <audio ref={audioElementRef} className="hidden" />
      </main>
    </div>
  )
}

