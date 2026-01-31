import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { X, Microphone, SpeakerHigh } from '@phosphor-icons/react';

const AccessibilityPopup = () => {
    const { showPopup, closePopup, toggleVoice } = useAccessibility();
    const { t } = useTranslation();

    if (!showPopup) return null;

    const handleEnableVoice = () => {
        toggleVoice(true);
    };

    const handleDisableVoice = () => {
        toggleVoice(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6347] to-[#FF8C69] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6347]/20">
                            <SpeakerHigh size={22} weight="fill" className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Voice Assistant</h2>
                            <p className="text-xs text-slate-500">Accessibility Feature</p>
                        </div>
                    </div>
                    <button
                        onClick={closePopup}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Enable voice assistant to navigate the website using voice commands.
                        I'll read page content and guide you through the application.
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                        <Microphone size={14} className="text-[#FF6347]" />
                        <span>Requires microphone access</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDisableVoice}
                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                        No, Thanks
                    </button>
                    <button
                        onClick={handleEnableVoice}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6347] to-[#FF8C69] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#FF6347]/25 flex items-center justify-center gap-2"
                    >
                        <Microphone size={18} weight="fill" />
                        Enable Voice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityPopup;
