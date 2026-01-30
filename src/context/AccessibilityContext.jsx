import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [signLanguageEnabled, setSignLanguageEnabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Check local storage for preferences
        const storedVoice = localStorage.getItem('voiceEnabled');
        const storedSign = localStorage.getItem('signLanguageEnabled');

        // If no preference set, show popup
        if (storedVoice === null || storedSign === null) {
            setShowPopup(true);
        } else {
            setVoiceEnabled(JSON.parse(storedVoice));
            setSignLanguageEnabled(JSON.parse(storedSign));
        }
    }, []);

    const toggleVoice = (value) => {
        const newState = value !== undefined ? value : !voiceEnabled;
        setVoiceEnabled(newState);
        localStorage.setItem('voiceEnabled', JSON.stringify(newState));
    };

    const toggleSignLanguage = (value) => {
        const newState = value !== undefined ? value : !signLanguageEnabled;
        setSignLanguageEnabled(newState);
        localStorage.setItem('signLanguageEnabled', JSON.stringify(newState));
    };

    const closePopup = () => {
        setShowPopup(false);
        // Determine user preference if they just closed it without explicit "Yes"
        // Usually we save what they selected. If they dismissed, maybe leave as is or set defaults.
        // For now, we assume they made choices in the popup before closing, 
        // or if they just close, we set default false if null.
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
            closePopup
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
