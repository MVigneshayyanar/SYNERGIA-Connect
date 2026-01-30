import React from 'react';
import { useTranslation } from 'react-i18next';
import { Translate } from '@phosphor-icons/react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors"
            title="Switch Language"
        >
            <Translate size={16} />
            <span>{i18n.language.toUpperCase()}</span>
        </button>
    );
};

export default LanguageSwitcher;
