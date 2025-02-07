import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Add type definition for webkitAudioContext
declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

export interface RobotFaceProps {
    audioEl?: HTMLAudioElement | null;
    emotion?: "neutral" | "listening" | "talking" | "happy" | "angry" | "sad";
}

const RobotFace: React.FC<RobotFaceProps> = ({ audioEl, emotion = "neutral" }) => {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if (audioEl) {
            // Use type-safe browser prefix handling
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.error("AudioContext is not supported in this browser");
                return;
            }

            const audioContext = new AudioContext();
            let source: MediaElementAudioSourceNode | null = null;
            let analyser: AnalyserNode | null = null;

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            try {
                source = audioContext.createMediaElementSource(audioEl);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyser.connect(audioContext.destination);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const updateVolume = () => {
                    analyser!.getByteTimeDomainData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const value = dataArray[i] - 128;
                        sum += Math.abs(value);
                    }
                    const avg = sum / dataArray.length;
                    const normalizedVolume = Math.min(avg / 128, 1);
                    setVolume(normalizedVolume);
                    requestAnimationFrame(updateVolume);
                };

                updateVolume();
            } catch (error) {
                console.error("Audio analysis error:", error);
            }

            return () => {
                try {
                    source?.disconnect();
                    analyser?.disconnect();
                    if (audioContext.state !== "closed") {
                        audioContext.close();
                    }
                } catch (error) {
                    console.error("Cleanup error:", error);
                }
            };
        }
    }, [audioEl]);

    const emotionLower = (emotion || "neutral").toLowerCase() as RobotFaceProps["emotion"];

    let eyebrowOffset = 0;
    let eyeScale = 1;
    let mouthCy = 130;
    switch (emotionLower) {
        case "happy":
            eyebrowOffset = -2;
            eyeScale = 1.1;
            mouthCy = 125;
            break;
        case "angry":
            eyebrowOffset = -8;
            eyeScale = 0.9;
            mouthCy = 135;
            break;
        case "sad":
            eyebrowOffset = 2;
            eyeScale = 0.95;
            mouthCy = 140;
            break;
        default:
            eyebrowOffset = 0;
            eyeScale = 1;
            mouthCy = 130;
    }

    const mouthRx = 30;
    const baseMouthRy = 2;
    const mouthExtraRy = volume * 10;
    const mouthRy = baseMouthRy + mouthExtraRy;

    return (
        <div style={{ width: 200, height: 200, margin: "0 auto" }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="#FAD7A0" stroke="#000" strokeWidth="2" />
                <motion.circle
                    cx="70"
                    cy="80"
                    r="10"
                    fill="#000"
                    animate={{ scale: eyeScale }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.circle
                    cx="130"
                    cy="80"
                    r="10"
                    fill="#000"
                    animate={{ scale: eyeScale }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.line
                    x1="55"
                    y1={60 + eyebrowOffset}
                    x2="85"
                    y2={60 + eyebrowOffset}
                    stroke="#000"
                    strokeWidth="2"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.line
                    x1="115"
                    y1={60 + eyebrowOffset}
                    x2="145"
                    y2={60 + eyebrowOffset}
                    stroke="#000"
                    strokeWidth="2"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.ellipse
                    cx="100"
                    cy={mouthCy}
                    rx={mouthRx}
                    ry={mouthRy}
                    fill="transparent"
                    stroke="#000"
                    strokeWidth="3"
                    animate={{ ry: mouthRy, cy: mouthCy }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </svg>
        </div>
    );
};

export default RobotFace;