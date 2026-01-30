import { useState } from "react";
import { Wheelchair, Ear, Eye, HandWaving, Microphone } from "@phosphor-icons/react";

const DisabilitySupport = () => {
    const [isListening, setIsListening] = useState(false);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 1;
            utterance.rate = 1;
            utterance.pitch = 1;
            
            // Optional: Try to set a specific voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.lang === 'en-US');
            if (preferredVoice) utterance.voice = preferredVoice;

            console.log("Speaking:", text);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech Synthesis not supported");
        }
    };

    const toggleVoiceAssistant = () => {
        if (isListening) {
             window.speechSynthesis.cancel();
             setIsListening(false);
             return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            speak("Screen Reader Active. I am listening. How can I assist you?");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
            speak("I didn't catch that. Please try clicking again.");
        };

        recognition.start();
    };

    const handleVoiceCommand = (command) => {
        if (command.includes("hello") || command.includes("hi")) {
            speak("Hello! I am your accessibility assistant.");
        } else if (command.includes("read") || command.includes("page")) {
            speak("This is the Inclusive Learning page. We offer Screen Readers, High Contrast modes, Keyboard Navigation, and Sign Language support.");
        } else if (command.includes("high contrast")) {
            speak("High contrast mode improves visibility. You can enable it in settings.");
        } else if (command.includes("keyboard")) {
            speak("Keyboard navigation allows you to use this site without a mouse.");
        } else {
            speak("I heard " + command + ". I can explain the features on this page if you ask.");
        }
    };

    const features = [
        { 
            title: isListening ? "Listening..." : "Screen Reader", 
            icon: isListening ? Microphone : Ear, 
            desc: isListening ? "Say 'Read page' or ask a question." : "Click to activate Voice Assistant.", 
            color: isListening ? "text-red-600" : "text-indigo-600", 
            bg: isListening ? "bg-red-50" : "bg-indigo-50",
            action: toggleVoiceAssistant 
        },
        { title: "High Contrast", icon: Eye, desc: "Enhanced visibility for visual impairments.", color: "text-pink-600", bg: "bg-pink-50" },
        { title: "Keyboard Nav", icon: Wheelchair, desc: "Full keyboard interactivity support.", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Sign Language", icon: HandWaving, desc: "Video overlays with sign language.", color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">Inclusive Learning</h2>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Education limited by nothing. Experience a platform that adapts to your unique needs, ensuring everyone has equal access to knowledge.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={toggleVoiceAssistant} className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center">
                            {isListening ? <Microphone size={20} className="mr-2 animate-pulse text-red-600" /> : <Ear size={20} className="mr-2" />}
                            {isListening ? "Listening..." : "Enable Screen Reader"}
                        </button>
                        <button className="bg-indigo-500/30 backdrop-blur-md text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-medium hover:bg-indigo-500/40 transition-colors">
                            Configure Settings
                        </button>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={item.action ? item.action : undefined}
                        className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all group hover:-translate-y-1 cursor-pointer 
                        ${item.action ? 'hover:border-indigo-300 hover:shadow-indigo-100/50 active:scale-95' : 'hover:border-indigo-100 hover:shadow-xl'}
                        ${isListening && item.action ? 'border-red-400 ring-4 ring-red-50 shadow-lg' : ''}`}
                    >
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <item.icon size={32} weight="duotone" className={isListening && item.action ? "animate-pulse" : ""} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisabilitySupport;
