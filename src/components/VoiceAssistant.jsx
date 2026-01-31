import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

/**
 * Voice Assistant with Form Input Support
 */
const VoiceAssistant = () => {
    const { voiceEnabled, toggleVoice, startListening, setSpeaking } = useAccessibility();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const recognitionRef = useRef(null);
    const lastPathRef = useRef('');
    const isSpeakingRef = useRef(false);
    const elementsRef = useRef([]);
    const currentIndexRef = useRef(0);
    const isReadingPageRef = useRef(false);
    const waitingForInputRef = useRef(false);
    const timeoutRef = useRef(null);
    const currentInputRef = useRef(null);

    // ==================== SPEECH SYNTHESIS ====================

    const speak = useCallback((text, onEnd = null) => {
        if (!voiceEnabled || !text) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        // Stop recognition while speaking
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        window.speechSynthesis.cancel();
        isSpeakingRef.current = true;
        setSpeaking?.(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.75; // Slower for complete sentences
        utterance.pitch = 1.0;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.includes('en') && v.localService) ||
            voices.find(v => v.lang.includes('en'));
        if (voice) utterance.voice = voice;

        let ended = false;
        const handleEnd = () => {
            if (ended) return;
            ended = true;
            isSpeakingRef.current = false;
            setSpeaking?.(false);

            // Restart recognition
            if (voiceEnabled && recognitionRef.current) {
                setTimeout(() => {
                    try { recognitionRef.current.start(); } catch (e) { }
                }, 300);
            }

            if (onEnd) setTimeout(onEnd, 600);
        };

        utterance.onend = handleEnd;
        utterance.onerror = handleEnd;

        // Chrome workaround
        const interval = setInterval(() => {
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        }, 100);

        utterance.onend = () => {
            clearInterval(interval);
            handleEnd();
        };

        window.speechSynthesis.speak(utterance);

        // Safety timeout 
        const words = text.split(' ').length;
        setTimeout(() => {
            if (!ended) {
                clearInterval(interval);
                handleEnd();
            }
        }, Math.max(4000, words * 500));

    }, [voiceEnabled, i18n.language, setSpeaking]);

    // ==================== HELPERS ====================

    const getPageName = useCallback(() => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path === '/login') return 'Login';
        if (path === '/signup') return 'Sign Up';
        return path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'page';
    }, [location.pathname]);

    const describeElement = useCallback((el) => {
        const tag = el.tagName.toLowerCase();
        const text = el.textContent?.trim() || '';
        const placeholder = el.placeholder || '';
        const label = el.getAttribute('aria-label') || '';
        const type = el.type || '';

        if (tag === 'h1') return `Page title: ${text}`;
        if (tag === 'h2') return text;
        if (tag === 'p' && text.length > 0 && text.length < 200) return text;

        if (tag === 'input') {
            const name = label || placeholder || 'field';
            if (['text', 'email', 'tel'].includes(type)) return `${name}. Please speak your input.`;
            if (type === 'password') return `${name}. Type your password, then say next.`;
            if (type === 'submit') return `${el.value || 'Submit'} button. Say go to press.`;
        }

        if (tag === 'button') return `${text} button. Say go to press.`;
        if (tag === 'a') return `Link: ${text}`;

        return null;
    }, []);

    const collectElements = useCallback(() => {
        const items = [];
        const seen = new Set();

        let container = document.querySelector('main') ||
            document.querySelector('form')?.parentElement ||
            document.querySelector('.min-h-screen') ||
            document.body;

        const els = container.querySelectorAll('h1, h2, p, input:not([type="hidden"]), button, a[href]');

        els.forEach(el => {
            if (el.offsetParent === null && el.tagName !== 'INPUT') return;
            if (el.closest('nav, aside, header')) return;
            if (el.textContent?.toLowerCase().includes('voice')) return;

            const desc = describeElement(el);
            if (desc && !seen.has(desc)) {
                seen.add(desc);
                items.push({
                    element: el,
                    text: desc,
                    isInput: el.tagName === 'INPUT' && !['submit', 'checkbox'].includes(el.type),
                    isButton: el.tagName === 'BUTTON' || el.type === 'submit'
                });
            }
        });

        return items;
    }, [describeElement]);

    // ==================== READING ====================

    const readNextElement = useCallback(() => {
        if (!isReadingPageRef.current || !voiceEnabled) return;

        const elements = elementsRef.current;
        const index = currentIndexRef.current;

        if (index >= elements.length) {
            isReadingPageRef.current = false;
            speak('End of page. Say go to submit, or go to followed by a page name.');
            return;
        }

        const item = elements[index];

        // Highlight
        document.querySelectorAll('.voice-highlight').forEach(el => {
            el.classList.remove('voice-highlight');
            el.style.outline = '';
        });

        if (item.element) {
            item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            item.element.classList.add('voice-highlight');
            item.element.style.outline = '3px solid #3B82F6';
            item.element.focus();
        }

        speak(item.text, () => {
            if (item.isInput) {
                waitingForInputRef.current = true;
                currentInputRef.current = item.element;

                // 5 second reminder
                timeoutRef.current = setTimeout(() => {
                    if (waitingForInputRef.current) {
                        speak('Please speak your input, or say next to skip.');
                    }
                }, 5000);
            } else if (item.isButton) {
                // Wait for go command
            } else {
                currentIndexRef.current++;
                setTimeout(() => readNextElement(), 800);
            }
        });
    }, [speak, voiceEnabled]);

    const startReading = useCallback(() => {
        window.speechSynthesis.cancel();
        isReadingPageRef.current = true;
        waitingForInputRef.current = false;
        elementsRef.current = collectElements();
        currentIndexRef.current = 0;

        const page = getPageName();
        speak(`You are on ${page}. I will read the page.`, () => {
            setTimeout(() => readNextElement(), 500);
        });
    }, [collectElements, getPageName, speak, readNextElement]);

    // ==================== VOICE INPUT HANDLER ====================

    const handleVoice = useCallback((transcript) => {
        const input = transcript.toLowerCase().trim();
        console.log('Heard:', input);

        // Navigation
        if (input.includes('go to')) {
            const dest = input.replace('go to', '').trim();
            const routes = {
                'housing': '/housing', 'healthcare': '/healthcare',
                'education': '/education', 'transport': '/transport',
                'home': '/', 'dashboard': '/', 'profile': '/profile',
                'login': '/login', 'signup': '/signup'
            };
            for (const [key, path] of Object.entries(routes)) {
                if (dest.includes(key)) {
                    speak(`Going to ${key}`, () => navigate(path));
                    return;
                }
            }
        }

        // Submit
        if (input === 'go' || input === 'submit') {
            const btn = document.querySelector('button[type="submit"]');
            if (btn) {
                speak('Submitting', () => btn.click());
                return;
            }
        }

        // Next
        if (input === 'next' || input === 'skip') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            waitingForInputRef.current = false;
            currentIndexRef.current++;
            setTimeout(() => readNextElement(), 300);
            return;
        }

        // Back
        if (input === 'back') {
            navigate(-1);
            return;
        }

        // Stop
        if (input === 'stop') {
            window.speechSynthesis.cancel();
            isReadingPageRef.current = false;
            speak('Stopped.');
            return;
        }

        // Turn off
        if (input.includes('turn off')) {
            speak('Turning off voice assistant', () => toggleVoice(false));
            return;
        }

        // Fill input
        if (waitingForInputRef.current && currentInputRef.current) {
            if (currentInputRef.current.type === 'password') {
                speak('Please type your password, then say next.');
                return;
            }

            currentInputRef.current.value = transcript;
            currentInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            waitingForInputRef.current = false;

            speak(`Entered ${transcript}.`, () => {
                currentIndexRef.current++;
                setTimeout(() => readNextElement(), 500);
            });
            return;
        }

        speak(`I heard ${transcript}. Say go to navigate or next to continue.`);
    }, [speak, navigate, toggleVoice, readNextElement]);

    // ==================== RECOGNITION SETUP ====================

    useEffect(() => {
        if (!voiceEnabled) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) { }
            }
            return;
        }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;

        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => startListening();

        recognition.onresult = (e) => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    const text = e.results[i][0].transcript.trim();
                    if (text) handleVoice(text);
                }
            }
        };

        recognition.onerror = (e) => {
            console.log('Error:', e.error);
            if (voiceEnabled && e.error !== 'not-allowed') {
                setTimeout(() => {
                    try { recognition.start(); } catch (err) { }
                }, 500);
            }
        };

        recognition.onend = () => {
            if (voiceEnabled && !isSpeakingRef.current) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 200);
            }
        };

        recognitionRef.current = recognition;
        setTimeout(() => {
            try { recognition.start(); } catch (e) { }
        }, 500);

        return () => {
            try { recognition.stop(); } catch (e) { }
        };
    }, [voiceEnabled, handleVoice, startListening]);

    // ==================== PAGE CHANGES ====================

    useEffect(() => {
        if (voiceEnabled && location.pathname !== lastPathRef.current) {
            lastPathRef.current = location.pathname;
            setTimeout(() => startReading(), 1500);
        }
    }, [location.pathname, voiceEnabled, startReading]);

    // Initial greeting
    useEffect(() => {
        if (voiceEnabled) {
            const greet = () => {
                speak(`Voice assistant ready. Welcome to ${getPageName()}.`, () => {
                    setTimeout(() => startReading(), 800);
                });
            };

            if (window.speechSynthesis.getVoices().length > 0) {
                setTimeout(greet, 1200);
            } else {
                window.speechSynthesis.onvoiceschanged = () => setTimeout(greet, 1200);
            }
        }

        return () => {
            window.speechSynthesis.cancel();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [voiceEnabled]); // eslint-disable-line

    return null;
};

export default VoiceAssistant;
