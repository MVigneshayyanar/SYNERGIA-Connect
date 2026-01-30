import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to SYNERGIA Connect",
            "Dashboard": "Dashboard",
            "Education": "Education",
            "Healthcare": "Healthcare",
            "Transport": "Transport",
            "Housing": "Housing",
            "Login": "Login",
            "Logout": "Logout",
            "VoiceAssistant": "Voice Assistant",
            "SignLanguage": "Sign Language",
            "EnableVoice": "Do you need Voice Assistant support?",
            "EnableSign": "Enable Sign Language support?",
            "Yes": "Yes",
            "No": "No",
            "Close": "Close",
            "SignLanguageUnavailable": "Sign Language Interpreter Unavailable"
        }
    },
    hi: {
        translation: {
            "Welcome": "SYNERGIA Connect में आपका स्वागत है",
            "Dashboard": "डैशबोर्ड",
            "Education": "शिक्षा",
            "Healthcare": "स्वास्थ्य सेवा",
            "Transport": "परिवहन",
            "Housing": "आवास",
            "Login": "लॉग इन करें",
            "Logout": "लॉग आउट",
            "VoiceAssistant": "वॉयस असिस्टेंट",
            "SignLanguage": "सांकेतिक भाषा",
            "EnableVoice": "क्या आपको वॉयस असिस्टेंट सहायता की आवश्यकता है?",
            "EnableSign": "सांकेतिक भाषा समर्थन सक्षम करें?",
            "Yes": "हाँ",
            "No": "नहीं",
            "Close": "बंद करें",
            "SignLanguageUnavailable": "सांकेतिक भाषा दुभाषिया अनुपलब्ध"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
