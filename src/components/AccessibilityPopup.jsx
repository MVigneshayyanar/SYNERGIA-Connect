import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { X } from '@phosphor-icons/react';

const AccessibilityPopup = () => {
    const { showPopup, closePopup, toggleVoice, toggleSignLanguage } = useAccessibility();
    const { t } = useTranslation();

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative border border-gray-200 dark:border-gray-700">
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    {t('Welcome')}
                </h2>

                <div className="space-y-6">
                    {/* Voice Assistant Option */}
                    <div className="flex flex-col gap-3">
                        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                            {t('EnableVoice')}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => toggleVoice(true)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {t('Yes')}
                            </button>
                            <button
                                onClick={() => toggleVoice(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                {t('No')}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-700" />

                    {/* Sign Language Option */}
                    <div className="flex flex-col gap-3">
                        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                            {t('EnableSign')}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => toggleSignLanguage(true)}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                {t('Yes')}
                            </button>
                            <button
                                onClick={() => toggleSignLanguage(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                {t('No')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={closePopup}
                        className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                        {t('Close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityPopup;
