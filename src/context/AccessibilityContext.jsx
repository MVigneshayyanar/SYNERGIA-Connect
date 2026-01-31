import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [signLanguageEnabled, setSignLanguageEnabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        // Check localStorage for saved preferences
        const storedVoice = localStorage.getItem('voiceEnabled');
        const storedSign = localStorage.getItem('signLanguageEnabled');

        // Check sessionStorage to see if we already asked this session
        const sessionAsked = sessionStorage.getItem('accessibilityAsked');

        if (storedVoice !== null) {
            setVoiceEnabled(JSON.parse(storedVoice));
        }
        if (storedSign !== null) {
            setSignLanguageEnabled(JSON.parse(storedSign));
        }

        // Show popup each session if not already asked this session
        if (!sessionAsked) {
            setShowPopup(true);
        }
    }, []);

    const toggleVoice = (value) => {
        const newState = value !== undefined ? value : !voiceEnabled;
        setVoiceEnabled(newState);
        localStorage.setItem('voiceEnabled', JSON.stringify(newState));

        // If turning off, also stop listening
        if (!newState) {
            setIsListening(false);
        }
    };

    const toggleSignLanguage = (value) => {
        const newState = value !== undefined ? value : !signLanguageEnabled;
        setSignLanguageEnabled(newState);
        localStorage.setItem('signLanguageEnabled', JSON.stringify(newState));
    };

    const startListening = () => {
        if (voiceEnabled) {
            setIsListening(true);
        }
    };

    const stopListening = () => {
        setIsListening(false);
    };

    const closePopup = () => {
        setShowPopup(false);
        // Mark that we asked this session
        sessionStorage.setItem('accessibilityAsked', 'true');

        // Set defaults if not explicitly chosen
        if (localStorage.getItem('voiceEnabled') === null) {
            localStorage.setItem('voiceEnabled', 'false');
            setVoiceEnabled(false);
        }
        if (localStorage.getItem('signLanguageEnabled') === null) {
            localStorage.setItem('signLanguageEnabled', 'false');
            setSignLanguageEnabled(false);
        }
    };

    return (
        <AccessibilityContext.Provider value={{
            voiceEnabled,
            toggleVoice,
            signLanguageEnabled,
            toggleSignLanguage,
            showPopup,
            closePopup,
            isListening,
            startListening,
            stopListening
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
