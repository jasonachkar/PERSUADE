import { useEffect, useState } from "react";

export default function VoiceChat() {
    const [status, setStatus] = useState("Click to start speaking...");
    const [audioEl, setAudioEl] = useState(null);

    useEffect(() => {
        // Create an <audio> element for AI responses
        const audio = document.createElement("audio");
        audio.autoplay = true;
        document.body.appendChild(audio); // Ensure it's added to the DOM
        setAudioEl(audio);
        console.log("Created audio element:", audio);
    }, []);

    const startSession = async () => {
        try {
            setStatus("Requesting ephemeral key...");

            // Fetch ephemeral key from our Next.js API route
            const tokenResponse = await fetch("/api/session");
            const data = await tokenResponse.json();

            if (!data.client_secret) {
                throw new Error("Failed to get ephemeral key");
            }

            const EPHEMERAL_KEY = data.client_secret.value;
            setStatus("Connecting to OpenAI Realtime API...");

            // Create WebRTC connection
            const pc = new RTCPeerConnection();

            // Play AI audio responses
            pc.ontrack = (event) => {
                console.log("Received AI Audio Track:", event.streams);
                audioEl.srcObject = event.streams[0];
            };

            // Capture microphone audio
            const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone Access Granted:", ms);
            pc.addTrack(ms.getTracks()[0]);

            // Set up data channel for communication
            const dc = pc.createDataChannel("oai-events");
            dc.addEventListener("message", (event) => {
                console.log("Realtime Event:", JSON.parse(event.data));
            });


            // Start WebRTC session with OpenAI
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const model = "gpt-4o-realtime-preview-2024-12-17";
            const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });

            const answer = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };
            await pc.setRemoteDescription(answer);

            setStatus("Connected! Start speaking...");

        } catch (error) {
            console.error("Error setting up WebRTC:", error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div>
            <h1>Realtime Voice Chat with GPT-4o</h1>
            <p>{status}</p>
            <button onClick={startSession}>🎤 Start Voice Chat</button>
        </div>
    );
}
