import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { HandWaving } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const SignLanguageWidget = () => {
    const { signLanguageEnabled } = useAccessibility();
    const { t } = useTranslation();

    if (!signLanguageEnabled) return null;

    return (
        <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-64">
            <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                <HandWaving size={24} weight="fill" />
                <h3 className="font-semibold">{t('SignLanguage')}</h3>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 h-32 rounded-lg flex items-center justify-center text-center p-2">
                {/* 
                  This is a placeholder. 
                  Real implementation would involve a video stream or an avatar 
                  overlay from a sign language API. 
                */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('SignLanguageUnavailable')}
                </p>
            </div>
        </div>
    );
};

export default SignLanguageWidget;
