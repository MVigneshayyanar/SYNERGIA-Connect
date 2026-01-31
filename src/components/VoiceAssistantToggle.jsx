import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Microphone, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

/**
 * Real-time Audio Visualizer Component
 * Shows actual microphone input frequency like a real voice assistant
 */
const VoiceAssistantToggle = () => {
    const { voiceEnabled, toggleVoice, isListening, isSpeaking } = useAccessibility();
    const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0, 0]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animationRef = useRef(null);

    // Initialize audio context and analyzer for real voice frequency
    useEffect(() => {
        if (!voiceEnabled || !isListening) {
            // Reset levels to 0 when not listening
            setAudioLevels([0, 0, 0, 0, 0]);

            // Cleanup audio resources
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
                audioContextRef.current = null;
            }
            return;
        }

        const initAudio = async () => {
            try {
                // Get microphone stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;

                // Create audio context
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContextRef.current = audioContext;

                // Create analyser
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 32; // Small for performance
                analyser.smoothingTimeConstant = 0.7;
                analyserRef.current = analyser;

                // Connect microphone to analyser
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                // Start animation loop
                const updateLevels = () => {
                    if (!analyserRef.current) return;

                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);

                    // Get 5 frequency bands
                    const numBars = 5;
                    const bandSize = Math.floor(dataArray.length / numBars);
                    const levels = [];

                    for (let i = 0; i < numBars; i++) {
                        let sum = 0;
                        for (let j = 0; j < bandSize; j++) {
                            sum += dataArray[i * bandSize + j];
                        }
                        const average = sum / bandSize;
                        // Normalize to 0-100 range
                        levels.push(Math.min(100, Math.max(5, (average / 255) * 100)));
                    }

                    setAudioLevels(levels);
                    animationRef.current = requestAnimationFrame(updateLevels);
                };

                updateLevels();
            } catch (err) {
                console.log('Microphone access denied or not available:', err);
                // Show static animation as fallback
                setAudioLevels([20, 40, 30, 50, 35]);
            }
        };

        initAudio();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
            }
        };
    }, [voiceEnabled, isListening]);

    // When speaking, show a pulsing animation instead of mic input
    useEffect(() => {
        if (isSpeaking && voiceEnabled) {
            const speakingAnimation = () => {
                setAudioLevels([
                    30 + Math.random() * 40,
                    50 + Math.random() * 40,
                    40 + Math.random() * 50,
                    60 + Math.random() * 30,
                    35 + Math.random() * 45
                ]);
            };

            const interval = setInterval(speakingAnimation, 100);
            return () => clearInterval(interval);
        }
    }, [isSpeaking, voiceEnabled]);

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => toggleVoice()}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300
                    ${voiceEnabled
                        ? 'bg-gradient-to-r from-[#FF6347] to-[#FF8C69] text-white shadow-lg shadow-[#FF6347]/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                `}
                title={voiceEnabled ? 'Voice Assistant On' : 'Voice Assistant Off'}
            >
                {voiceEnabled ? (
                    <>
                        {/* Real-time frequency bars */}
                        <div className="flex items-end gap-[2px] h-5 min-w-[22px]">
                            {audioLevels.map((level, i) => (
                                <span
                                    key={i}
                                    className="w-[3px] bg-white rounded-full transition-all duration-75"
                                    style={{
                                        height: `${Math.max(level, 5)}%`,
                                        opacity: level > 5 ? 1 : 0.4
                                    }}
                                />
                            ))}
                        </div>
                        <span className="hidden sm:inline whitespace-nowrap">
                            {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Voice On'}
                        </span>
                    </>
                ) : (
                    <>
                        <SpeakerSlash size={18} weight="fill" />
                        <span className="hidden sm:inline">Voice Off</span>
                    </>
                )}
            </button>

            {/* Active indicator pulse */}
            {voiceEnabled && isListening && audioLevels.some(l => l > 30) && (
                <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    <span className="absolute inset-0 bg-green-500 rounded-full" />
                </span>
            )}
        </div>
    );
};

export default VoiceAssistantToggle;
