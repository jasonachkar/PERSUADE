"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Menu, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SimulationInterface() {
  // Default values in case there is no saved scenario.
  const [isCallActive, setIsCallActive] = useState(false);
  const [customerEmotion, setCustomerEmotion] = useState("Happy");
  const [callDifficulty, setCallDifficulty] = useState("Beginner");
  const [status, setStatus] = useState("Click to start speaking...");
  const audioEl = useRef<HTMLAudioElement | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  const router = useRouter();

  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  // Read scenario settings from localStorage on mount.
  useEffect(() => {
    const scenarioData = localStorage.getItem("currentScenario");
    if (scenarioData) {
      const { difficulty, emotion } = JSON.parse(scenarioData);
      // Update the states based on the saved scenario.
      if (difficulty) setCallDifficulty(difficulty);
      if (emotion) setCustomerEmotion(emotion);
    }
  }, []);

  useEffect(() => {
    // Create and attach an audio element for AI responses
    const audio = document.createElement("audio");
    audio.autoplay = true;
    document.body.appendChild(audio);
    audioEl.current = audio;
  }, []);

  const startVoiceSession = async () => {
    try {
      setStatus("Requesting ephemeral key...");
      // Fetch ephemeral key from our Next.js API route
      const response = await fetch("/api/session");
      const data = await response.json();

      if (!data.client_secret) {
        throw new Error("Failed to get ephemeral key");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      setStatus("Connecting to OpenAI Realtime API...");

      // Create WebRTC peer connection
      peerConnection.current = new RTCPeerConnection();

      // Play AI-generated responses
      peerConnection.current.ontrack = (event) => {
        if (audioEl.current) {
          audioEl.current.srcObject = event.streams[0];
        }
      };

      // Capture microphone input
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, mediaStream));

      // Create a data channel for sending/receiving messages
      dataChannel.current = peerConnection.current.createDataChannel("oai-events");
      dataChannel.current.onmessage = (event) => {
        const aiMessage = { role: "assistant", content: JSON.parse(event.data).text };
        setMessages(prev => [...prev, aiMessage]);
      };

      // Start WebRTC session with OpenAI
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      const instructions = encodeURIComponent(
        `You are an AI sales training simulator playing the role of a ${customerEmotion.toLowerCase()} customer. 
         This is a ${callDifficulty.toLowerCase()} level conversation.
         Your responses should reflect the emotional state and difficulty level selected.
         Be natural and conversational, presenting realistic objections and concerns.`
      );
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}&instructions=${instructions}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: await sdpResponse.text(),
      });

      await peerConnection.current.setRemoteDescription(answer);

      setStatus("Connected! Start speaking...");
      setIsCallActive(true);
    } catch (error) {
      console.error("Error setting up WebRTC:", error);
      setStatus("Error: ");
    }
  };

  const stopVoiceSession = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setIsCallActive(false);
    setStatus("Call ended.");
  };

  const handleEndCall = async () => {
    try {
      setStatus("Evaluating conversation...");
      
      // Get evaluation from API
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate conversation");
      }

      const evaluation = await response.json();
      
      // Store feedback in localStorage
      localStorage.setItem("lastCallFeedback", JSON.stringify(evaluation));
      
      // Save session duration
      const duration = Date.now() - sessionStartTime;
      localStorage.setItem("lastSessionDuration", duration.toString());
      
      // Save current scenario
      const scenarioData = {
        difficulty: callDifficulty,
        emotion: customerEmotion,
        product: "Demo Product", // Replace with actual product if available
      };
      localStorage.setItem("currentScenario", JSON.stringify(scenarioData));

      await stopVoiceSession();
      router.push("/feedback");
    } catch (error) {
      console.error("Error ending call:", error);
      setStatus("Error evaluating conversation");
    }
  };

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
        <p>{status}</p>
        <Button
          onClick={isCallActive ? handleEndCall : startVoiceSession}
          className={`w-20 h-20 rounded-full ${
            isCallActive ? "bg-red-600" : "bg-green-600"
          } text-white shadow-lg`}
        >
          <Mic className="h-10 w-10" />
        </Button>
        <Button
          onClick={handleEndCall}
          variant="destructive"
          className="mt-4"
          disabled={!isCallActive || messages.length === 0}
        >
          End Call & Get Feedback
        </Button>
        <audio ref={audioEl} className="hidden" />
      </main>
    </div>
  );
}