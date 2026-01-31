import React from 'react';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

const VoiceAssistantToggle = () => {
    const { voiceEnabled, toggleVoice, isListening } = useAccessibility();
    const { t } = useTranslation();

    return (
        <button
            onClick={() => toggleVoice()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${voiceEnabled
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                } ${isListening ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
            title={t('VoiceAssistant')}
        >
            {voiceEnabled ? (
                <>
                    <SpeakerHigh size={16} weight="bold" className={isListening ? 'animate-pulse' : ''} />
                    <span className="hidden sm:inline">Voice On</span>
                </>
            ) : (
                <>
                    <SpeakerSlash size={16} />
                    <span className="hidden sm:inline">Voice Off</span>
                </>
            )}
        </button>
    );
};

export default VoiceAssistantToggle;
