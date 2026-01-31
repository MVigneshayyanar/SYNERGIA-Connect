import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

// Voice command mappings for navigation
const NAVIGATION_COMMANDS = {
    // Main modules
    'housing': '/housing',
    'go to housing': '/housing',
    'open housing': '/housing',
    'healthcare': '/healthcare',
    'go to healthcare': '/healthcare',
    'open healthcare': '/healthcare',
    'health': '/healthcare',
    'medical': '/healthcare',
    'education': '/education',
    'go to education': '/education',
    'open education': '/education',
    'learning': '/education',
    'transport': '/transport',
    'go to transport': '/transport',
    'open transport': '/transport',
    'transportation': '/transport',
    'travel': '/transport',

    // Dashboard
    'dashboard': '/',
    'go to dashboard': '/',
    'home': '/',
    'go home': '/',
    'main page': '/',

    // Profile
    'profile': '/profile',
    'go to profile': '/profile',
    'my profile': '/profile',
    'settings': '/profile',

    // Marketplace
    'marketplace': '/marketplace',
    'go to marketplace': '/marketplace',
    'properties': '/marketplace',
    'search properties': '/marketplace',
    'find property': '/marketplace',

    // Post Property
    'post property': '/post-property',
    'add property': '/post-property',
    'list property': '/post-property',

    // Property Management
    'tenant dashboard': '/property-management/tenant',
    'tenant': '/property-management/tenant',
    'landlord dashboard': '/property-management/landlord',
    'landlord': '/property-management/landlord',
    'payment portal': '/property-management/payment',
    'payments': '/property-management/payment',
    'pay rent': '/property-management/payment',
    'maintenance': '/property-management/maintenance',
    'maintenance requests': '/property-management/maintenance',
    'repairs': '/property-management/maintenance',

    // Home Services
    'home services': '/home-services',
    'services': '/home-services',
    'find services': '/home-services',
    'plumber': '/home-services',
    'electrician': '/home-services',

    // Healthcare Scanner
    'scanner': '/healthcare-scanner',
    'consent form': '/healthcare-scanner',
    'scan document': '/healthcare-scanner',

    // Auth pages
    'login': '/login',
    'go to login': '/login',
    'sign in page': '/login',
    'sign up': '/signup',
    'signup': '/signup',
    'go to signup': '/signup',
    'register': '/signup',
    'create account page': '/signup',
};

// Turn off commands
const TURN_OFF_COMMANDS = [
    'turn off voice assistant',
    'turn off voice',
    'stop voice assistant',
    'stop voice',
    'disable voice',
    'disable voice assistant',
    'voice off',
    'quiet',
    'silence',
];

const VoiceAssistant = () => {
    const { voiceEnabled, toggleVoice, isListening, startListening, stopListening } = useAccessibility();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const recognitionRef = useRef(null);
    const lastPathRef = useRef('');
    const currentIndexRef = useRef(0);
    const elementsRef = useRef([]);
    const isSpeakingRef = useRef(false);
    const [currentFocusedElement, setCurrentFocusedElement] = useState(null);

    // Speak text using Speech Synthesis
    const speak = useCallback((text, onEnd = null) => {
        if (!voiceEnabled || !text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();
        isSpeakingRef.current = true;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Select voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            isSpeakingRef.current = false;
            if (onEnd) onEnd();
        };

        utterance.onerror = () => {
            isSpeakingRef.current = false;
            if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled, i18n.language]);

    // Get description for an element
    const describeElement = useCallback((el) => {
        const tag = el.tagName.toLowerCase();
        const type = el.type?.toLowerCase() || '';
        const text = el.textContent?.trim() || '';
        const placeholder = el.placeholder || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const value = el.value || '';

        // Get label
        let label = '';
        if (el.id) {
            const labelEl = document.querySelector(`label[for="${el.id}"]`);
            if (labelEl) label = labelEl.textContent?.trim() || '';
        }
        if (!label && el.previousElementSibling?.tagName === 'LABEL') {
            label = el.previousElementSibling.textContent?.trim() || '';
        }

        // Describe based on element type
        if (tag === 'h1') return `Page title: ${text}`;
        if (tag === 'h2') return `Section: ${text}`;
        if (tag === 'h3') return `Subsection: ${text}`;
        if (tag === 'p' && text.length > 0 && text.length < 300) return text;
        if (tag === 'span' && text.length > 0 && text.length < 100) return text;

        if (tag === 'input') {
            const fieldName = label || ariaLabel || placeholder || 'field';
            if (type === 'text' || type === 'email' || type === 'tel' || type === 'number') {
                return `${fieldName} input field. ${value ? `Current value is ${value}.` : ''} Say your input or say next.`;
            }
            if (type === 'password') {
                return `${fieldName}. Type your password then say next.`;
            }
            if (type === 'checkbox') {
                return `${fieldName} checkbox, ${el.checked ? 'checked' : 'not checked'}. Say check to toggle.`;
            }
            if (type === 'date') {
                return `${fieldName} date field. ${value ? `Set to ${value}.` : ''} Say next to continue.`;
            }
            if (type === 'submit') {
                return `${value || 'Submit'} button. Say click to press.`;
            }
        }

        if (tag === 'textarea') {
            return `${label || ariaLabel || placeholder || 'Text area'}. Say your input.`;
        }

        if (tag === 'select') {
            const selected = el.options[el.selectedIndex]?.text || 'none';
            return `${label || ariaLabel || 'Dropdown'}. Currently ${selected}. Say select to change.`;
        }

        if (tag === 'button') {
            return `${text || ariaLabel || 'Button'}. Say click to press.`;
        }

        if (tag === 'a') {
            return `Link: ${text || ariaLabel}. Say click to open.`;
        }

        if (tag === 'label') {
            return text;
        }

        if (tag === 'div' || tag === 'li') {
            // Only read divs/lis with short direct text (not nested)
            const directText = Array.from(el.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent?.trim())
                .join(' ')
                .trim();
            if (directText && directText.length > 5 && directText.length < 150) {
                return directText;
            }
        }

        return null;
    }, []);

    // Collect all readable elements from the page
    const collectPageElements = useCallback(() => {
        const items = [];
        const seen = new Set();

        // Get the main content area (exclude sidebar/nav)
        const mainContent = document.querySelector('main') || document.body;

        // Select elements that contain content
        const selector = 'h1, h2, h3, p, label, input:not([type="hidden"]), textarea, select, button:not([aria-hidden="true"]), a[href]:not([aria-hidden="true"]), span.text-lg, span.text-xl, div.card-title, li';
        const elements = mainContent.querySelectorAll(selector);

        elements.forEach(el => {
            // Skip hidden elements
            if (el.offsetParent === null && !['INPUT', 'SELECT'].includes(el.tagName)) return;
            // Skip elements in nav/sidebar/hidden areas
            if (el.closest('nav, aside, [aria-hidden="true"], .sidebar')) return;
            // Skip tiny elements
            if (el.offsetWidth < 10 && el.offsetHeight < 10) return;

            const desc = describeElement(el);
            if (desc && desc.length > 2 && !seen.has(desc)) {
                seen.add(desc);
                items.push({
                    element: el,
                    text: desc,
                    isInteractive: ['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA'].includes(el.tagName)
                });
            }
        });

        return items;
    }, [describeElement]);

    // Read the current element
    const readCurrentElement = useCallback(() => {
        const elements = elementsRef.current;
        const index = currentIndexRef.current;

        if (index >= elements.length) {
            speak('End of page. Say read page to start over, or give a command like go to housing.', () => {
                startListening();
            });
            return;
        }

        const item = elements[index];

        // Highlight and focus
        if (currentFocusedElement) {
            currentFocusedElement.style.outline = '';
            currentFocusedElement.style.boxShadow = '';
        }

        if (item.element) {
            item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (item.isInteractive) {
                item.element.focus();
            }
            item.element.style.outline = '3px solid #3B82F6';
            item.element.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
            setCurrentFocusedElement(item.element);
        }

        speak(item.text, () => {
            if (item.isInteractive) {
                // Wait for user input on interactive elements
                startListening();
            } else {
                // Auto-continue for non-interactive elements
                currentIndexRef.current++;
                setTimeout(() => readCurrentElement(), 400);
            }
        });
    }, [speak, startListening, currentFocusedElement]);

    // Start reading the page
    const readPage = useCallback(() => {
        if (!voiceEnabled) return;

        window.speechSynthesis.cancel();

        // Wait for page to fully render
        setTimeout(() => {
            elementsRef.current = collectPageElements();
            currentIndexRef.current = 0;

            if (elementsRef.current.length === 0) {
                speak('No content found on this page. Try navigating to another page.');
                return;
            }

            // Announce page name first
            const pageName = location.pathname === '/' ? 'Dashboard' :
                location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'page';

            speak(`You are on the ${pageName}. Reading page content.`, () => {
                setTimeout(() => readCurrentElement(), 300);
            });
        }, 800);
    }, [voiceEnabled, collectPageElements, location.pathname, speak, readCurrentElement]);

    // Move to next element
    const nextElement = useCallback(() => {
        if (currentFocusedElement) {
            currentFocusedElement.style.outline = '';
            currentFocusedElement.style.boxShadow = '';
        }
        currentIndexRef.current++;
        readCurrentElement();
    }, [readCurrentElement, currentFocusedElement]);

    // Click the current element
    const clickCurrent = useCallback(() => {
        const elements = elementsRef.current;
        const index = currentIndexRef.current;

        if (index < elements.length && elements[index].element) {
            const el = elements[index].element;
            speak('Clicking', () => {
                el.click();
                // Move to next after click
                setTimeout(() => {
                    currentIndexRef.current++;
                    readCurrentElement();
                }, 500);
            });
        }
    }, [speak, readCurrentElement]);

    // Handle voice input for text fields
    const enterText = useCallback((text) => {
        const elements = elementsRef.current;
        const index = currentIndexRef.current;

        if (index < elements.length) {
            const el = elements[index].element;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                const inputType = el.type?.toLowerCase();
                if (inputType !== 'password' && inputType !== 'submit') {
                    el.value = text;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    speak(`Entered ${text}. Say next to continue.`, () => {
                        startListening();
                    });
                    return true;
                }
            }
        }
        return false;
    }, [speak, startListening]);

    // Process voice command
    const processCommand = useCallback((command) => {
        const cmd = command.toLowerCase().trim();
        console.log('Voice command:', cmd);

        // Turn off commands
        if (TURN_OFF_COMMANDS.some(c => cmd.includes(c))) {
            speak('Turning off voice assistant. Goodbye!');
            setTimeout(() => toggleVoice(false), 1500);
            return;
        }

        // Navigation commands
        for (const [phrase, path] of Object.entries(NAVIGATION_COMMANDS)) {
            if (cmd.includes(phrase)) {
                const pageName = phrase.replace(/go to |open /g, '');
                speak(`Going to ${pageName}`, () => {
                    navigate(path);
                });
                return;
            }
        }

        // Control commands
        if (cmd === 'next' || cmd === 'skip' || cmd === 'continue') {
            nextElement();
            return;
        }

        if (cmd === 'click' || cmd === 'press' || cmd === 'enter' || cmd === 'submit') {
            clickCurrent();
            return;
        }

        if (cmd === 'sign in' || cmd === 'login' || cmd === 'sign up' || cmd === 'create account') {
            // Find and click the relevant button
            const buttons = document.querySelectorAll('button[type="submit"], button');
            for (const btn of buttons) {
                const btnText = btn.textContent?.toLowerCase() || '';
                if (btnText.includes('sign') || btnText.includes('login') || btnText.includes('create')) {
                    btn.click();
                    speak('Submitting');
                    return;
                }
            }
        }

        if (cmd === 'back' || cmd === 'go back' || cmd === 'previous') {
            speak('Going back');
            navigate(-1);
            return;
        }

        if (cmd === 'read' || cmd === 'read page' || cmd === 'read again' || cmd === 'start over') {
            readPage();
            return;
        }

        if (cmd === 'check' || cmd === 'toggle') {
            const elements = elementsRef.current;
            const index = currentIndexRef.current;
            if (index < elements.length) {
                const el = elements[index].element;
                if (el && el.type === 'checkbox') {
                    el.checked = !el.checked;
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    speak(el.checked ? 'Checked' : 'Unchecked', () => startListening());
                    return;
                }
            }
        }

        if (cmd.includes('stop') && !cmd.includes('voice')) {
            window.speechSynthesis.cancel();
            speak('Stopped. Say read to continue or give a command.');
            startListening();
            return;
        }

        // Try to enter as text input
        if (enterText(command)) {
            return;
        }

        // Unknown command
        speak(`I heard ${command}. Say next to continue, or try a command like go to housing.`, () => {
            startListening();
        });
    }, [speak, toggleVoice, navigate, nextElement, clickCurrent, readPage, enterText, startListening]);

    // Initialize speech recognition
    useEffect(() => {
        if (!voiceEnabled) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) { }
            }
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.log('Recognition error:', event.error);
            if (event.error === 'no-speech' && voiceEnabled && isListening) {
                // Restart on no speech
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 100);
            }
        };

        recognition.onend = () => {
            if (voiceEnabled && isListening && !isSpeakingRef.current) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 100);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            try { recognitionRef.current?.stop(); } catch (e) { }
        };
    }, [voiceEnabled, i18n.language, processCommand, isListening]);

    // Handle listening state
    useEffect(() => {
        if (!recognitionRef.current) return;

        if (isListening && voiceEnabled && !isSpeakingRef.current) {
            try { recognitionRef.current.start(); } catch (e) { }
        } else {
            try { recognitionRef.current.stop(); } catch (e) { }
        }
    }, [isListening, voiceEnabled]);

    // Read page on route change
    useEffect(() => {
        if (voiceEnabled && location.pathname !== lastPathRef.current) {
            lastPathRef.current = location.pathname;
            setTimeout(() => readPage(), 1200);
        }
    }, [location.pathname, voiceEnabled, readPage]);

    // Initial welcome when voice is first enabled
    useEffect(() => {
        if (voiceEnabled) {
            const initVoice = () => {
                speak('Voice assistant activated. I will read the page for you.', () => {
                    setTimeout(() => readPage(), 500);
                });
            };

            // Wait for voices to load
            if (window.speechSynthesis.getVoices().length > 0) {
                setTimeout(initVoice, 600);
            } else {
                window.speechSynthesis.onvoiceschanged = () => setTimeout(initVoice, 600);
            }
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [voiceEnabled]); // eslint-disable-line

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (currentFocusedElement) {
                currentFocusedElement.style.outline = '';
                currentFocusedElement.style.boxShadow = '';
            }
            try { recognitionRef.current?.stop(); } catch (e) { }
        };
    }, []); // eslint-disable-line

    return null;
};

export default VoiceAssistant;
