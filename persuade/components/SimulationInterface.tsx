"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Settings, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function SimulationInterface() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [customerEmotion, setCustomerEmotion] = useState("Happy")
  const [callDifficulty, setCallDifficulty] = useState("Beginner")
  const [product, setProduct] = useState("Demo Product")
  const [status, setStatus] = useState("Click to start speaking...")
  const audioEl = useRef<HTMLAudioElement | null>(null)

  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const dataChannel = useRef<RTCDataChannel | null>(null)

  const router = useRouter()

  const [sessionStartTime, setSessionStartTime] = useState<number>(0)

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])

  useEffect(() => {
    const scenarioData = localStorage.getItem("currentScenario")
    if (scenarioData) {
      const { difficulty, emotion, product } = JSON.parse(scenarioData)
      if (difficulty) setCallDifficulty(difficulty)
      if (emotion) setCustomerEmotion(emotion)
      if (product) setProduct(product)
    }
  }, [])

  useEffect(() => {
    const audio = document.createElement("audio")
    audio.autoplay = true
    document.body.appendChild(audio)
    audioEl.current = audio
  }, [])

  const startVoiceSession = async () => {
    try {
      setStatus("Requesting ephemeral key...")
      const ephemeralResponse = await fetch("/api/session")
      const ephemeralData = await ephemeralResponse.json()

      if (!ephemeralData.client_secret) {
        throw new Error("Failed to get ephemeral key")
      }

      const EPHEMERAL_KEY = ephemeralData.client_secret.value
      setStatus("Connecting to OpenAI Realtime API...")

      peerConnection.current = new RTCPeerConnection()

      peerConnection.current.ontrack = (event) => {
        if (audioEl.current) {
          audioEl.current.srcObject = event.streams[0]
        }
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, mediaStream))

      dataChannel.current = peerConnection.current.createDataChannel("oai-events")
      dataChannel.current.onmessage = (event) => {
        const aiMessage = { role: "assistant", content: JSON.parse(event.data).text }
        setMessages((prev) => [...prev, aiMessage])
      }

      const offer = await peerConnection.current.createOffer()
      await peerConnection.current.setLocalDescription(offer)

      const sessionResponse = await fetch("/api/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerSdp: offer.sdp,
          customerEmotion,
          callDifficulty,
          product,
        }),
      })

      const sessionData = await sessionResponse.json()
      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: sessionData.answerSdp,
      })

      await peerConnection.current.setRemoteDescription(answer)

      setStatus("Connected! Start speaking...")
      setIsCallActive(true)
      setSessionStartTime(Date.now())
    } catch (error) {
      console.error("Error setting up WebRTC:", error)
      setStatus("Error: Failed to start session")
    }
  }

  const stopVoiceSession = async () => {
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    setIsCallActive(false)
    setStatus("Call ended.")
  }

  const handleEndCall = async () => {
    try {
      setStatus("Evaluating conversation...")

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error("Failed to evaluate conversation")
      }

      const evaluation = await response.json()

      localStorage.setItem("lastCallFeedback", JSON.stringify(evaluation))

      const duration = Date.now() - sessionStartTime
      localStorage.setItem("lastSessionDuration", duration.toString())

      const scenarioData = {
        difficulty: callDifficulty,
        emotion: customerEmotion,
        product: product,
      }
      localStorage.setItem("currentScenario", JSON.stringify(scenarioData))

      await stopVoiceSession()
      router.push("/feedback")
    } catch (error) {
      console.error("Error ending call:", error)
      setStatus("Error evaluating conversation")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Simulation Interface</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
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
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg font-medium text-gray-900 mb-4">{status}</p>
            <Button
              onClick={isCallActive ? handleEndCall : startVoiceSession}
              className={`w-20 h-20 rounded-full ${isCallActive ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
                } text-white shadow-lg transition-colors duration-200`}
            >
              {isCallActive ? <X className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
            </Button>
            <p className="mt-2 text-sm text-gray-500">{isCallActive ? "Click to end call" : "Click to start call"}</p>
          </div>
        </div>
      </main>

      <audio ref={audioEl} className="hidden" />
    </div>
  )
}

