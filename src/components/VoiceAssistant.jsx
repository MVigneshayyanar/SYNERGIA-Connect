import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const VoiceAssistant = () => {
    const { voiceEnabled, toggleVoice } = useAccessibility();
    const location = useLocation();
    const { t } = useTranslation();

    // Function to speak text
    const speak = (text) => {
        if (!voiceEnabled) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Attempt to select a voice that matches the current language
        // This logic can be refined to be more robust
        const voices = window.speechSynthesis.getVoices();
        // Just a simple heuristic for now
        // utterance.lang = i18n.language; 

        window.speechSynthesis.speak(utterance);
    };

    // Speak on route change
    useEffect(() => {
        if (voiceEnabled) {
            // Determine what to say based on path
            let textToSpeak = "";
            if (location.pathname === '/') textToSpeak = t('Dashboard');
            else if (location.pathname === '/login') textToSpeak = t('Login');
            else if (location.pathname === '/education') textToSpeak = t('Education');
            else if (location.pathname === '/healthcare') textToSpeak = t('Healthcare');
            else if (location.pathname === '/transport') textToSpeak = t('Transport');
            else if (location.pathname === '/housing') textToSpeak = t('Housing');
            else textToSpeak = "Navigated to " + location.pathname.replace('/', '');

            // Delay slightly to allow page load/transition
            setTimeout(() => speak(textToSpeak), 500);
        }
    }, [location.pathname, voiceEnabled, t]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // If not enabled, we still might want to show a toggle button somewhere, 
    // or maybe only show this floating button if enabled?
    // Let's show a small floating button if enabled, or maybe always visible to toggle?
    // For now, let's keep it visible so user can toggle it easily.

    return (
        <button
            onClick={() => toggleVoice()}
            className={`fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-lg transition-all ${voiceEnabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500'
                }`}
            title={t('VoiceAssistant')}
        >
            {voiceEnabled ? <SpeakerHigh size={24} /> : <SpeakerSlash size={24} />}
        </button>
    );
};

export default VoiceAssistant;
