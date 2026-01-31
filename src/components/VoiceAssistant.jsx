import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';

/**
 * Voice Assistant with Form Input Support
 * Features:
 * - Waits for voice input on form fields
 * - Converts speech to text and fills inputs
 * - 5-second timeout reminder if no input
 * - "go" command for navigation
 * - Step-by-step form guidance
 */

const VoiceAssistant = () => {
    const { voiceEnabled, toggleVoice, startListening, stopListening, isListening, setSpeaking } = useAccessibility();
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
    const inputTimeoutRef = useRef(null);
    const currentInputElementRef = useRef(null);
    const speechQueueRef = useRef([]);
    const isProcessingQueueRef = useRef(false);

    // ==================== SPEECH SYNTHESIS ====================

    // Process speech queue one at a time
    const processQueue = useCallback(() => {
        if (isProcessingQueueRef.current || speechQueueRef.current.length === 0) {
            return;
        }

        isProcessingQueueRef.current = true;
        const { text, onEnd } = speechQueueRef.current.shift();

        // Stop recognition while speaking
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        isSpeakingRef.current = true;
        setSpeaking?.(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8; // Slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1;

        // Get a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.lang.includes(i18n.language === 'hi' ? 'hi' : 'en') &&
            (v.name.includes('Microsoft') || v.name.includes('Google') || v.localService)
        ) || voices.find(v => v.lang.includes(i18n.language === 'hi' ? 'hi' : 'en'));

        if (preferredVoice) utterance.voice = preferredVoice;

        let hasEnded = false;

        const handleEnd = () => {
            if (hasEnded) return;
            hasEnded = true;

            isSpeakingRef.current = false;
            setSpeaking?.(false);
            isProcessingQueueRef.current = false;

            // Restart recognition after speech
            if (voiceEnabled && recognitionRef.current) {
                setTimeout(() => {
                    try { recognitionRef.current.start(); } catch (e) { }
                }, 300);
            }

            // Call the callback
            if (onEnd) {
                setTimeout(onEnd, 500);
            }

            // Process next item in queue
            setTimeout(() => processQueue(), 300);
        };

        utterance.onend = handleEnd;
        utterance.onerror = (e) => {
            console.log('Speech error:', e);
            handleEnd();
        };

        // Chrome bug workaround - keep speech alive
        const keepAlive = setInterval(() => {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        }, 100);

        utterance.onend = () => {
            clearInterval(keepAlive);
            handleEnd();
        };

        window.speechSynthesis.speak(utterance);

        // Safety timeout based on text length (150 words per minute at 0.8 rate)
        const wordCount = text.split(' ').length;
        const safetyTimeout = Math.max(3000, (wordCount / 1.5) * 1000);

        setTimeout(() => {
            if (!hasEnded) {
                console.log('Safety timeout triggered');
                clearInterval(keepAlive);
                handleEnd();
            }
        }, safetyTimeout);

    }, [voiceEnabled, i18n.language, setSpeaking]);

    const speak = useCallback((text, onEnd = null) => {
        if (!voiceEnabled || !text) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        console.log('Queueing speech:', text.substring(0, 50) + '...');
        speechQueueRef.current.push({ text, onEnd });
        processQueue();
    }, [voiceEnabled, processQueue]);

    // ==================== PAGE CONTENT COLLECTION ====================

    const getPageName = useCallback(() => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path === '/login') return 'Login';
        if (path === '/signup') return 'Sign Up';
        return path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'page';
    }, [location.pathname]);

    const collectElements = useCallback(() => {
        const items = [];
        const seen = new Set();

        let main = document.querySelector('main');
        if (!main) {
            main = document.querySelector('form')?.closest('div') ||
                document.querySelector('.min-h-screen') ||
                document.body;
        }

        const selectors = [
            'h1', 'h2',
            'p:not(:empty)',
            'label:not(:empty)',
            'input:not([type="hidden"])',
            'textarea',
            'select',
            'button[type="submit"]',
            'a[href]:not([aria-hidden="true"])',
        ];

        const elements = main.querySelectorAll(selectors.join(', '));

        elements.forEach(el => {
            if (el.offsetParent === null && !['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return;
            if (el.closest('nav, aside, [aria-hidden="true"], .sidebar')) return;
            if (el.textContent?.toLowerCase().includes('voice')) return;

            const desc = describeElement(el);
            if (desc && desc.length > 2 && !seen.has(desc)) {
                seen.add(desc);
                items.push({
                    element: el,
                    text: desc,
                    isInput: ['INPUT', 'TEXTAREA'].includes(el.tagName) && el.type !== 'submit' && el.type !== 'checkbox',
                    isButton: el.tagName === 'BUTTON' || el.type === 'submit',
                    isCheckbox: el.type === 'checkbox',
                    isLink: el.tagName === 'A',
                    tag: el.tagName
                });
            }
        });

        return items;
    }, []);

    const describeElement = (el) => {
        const tag = el.tagName.toLowerCase();
        const text = el.textContent?.trim() || '';
        const placeholder = el.placeholder || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const type = el.type?.toLowerCase() || '';

        let label = '';
        if (el.id) {
            const labelEl = document.querySelector(`label[for="${el.id}"]`);
            if (labelEl) label = labelEl.textContent?.trim() || '';
        }
        if (!label && el.previousElementSibling?.tagName === 'LABEL') {
            label = el.previousElementSibling.textContent?.trim() || '';
        }

        if (tag === 'h1') return `Page title: ${text}`;
        if (tag === 'h2') return `${text}`;
        if (tag === 'p' && text.length > 0 && text.length < 200) return text;

        if (tag === 'input') {
            const fieldName = label || ariaLabel || placeholder || 'field';
            if (['text', 'email', 'tel', 'number', 'search'].includes(type)) {
                return `${fieldName}. Please tell me what to enter.`;
            }
            if (type === 'password') return `${fieldName}. Please type your password manually, then say next.`;
            if (type === 'checkbox') return `${fieldName} checkbox. Say check or uncheck.`;
            if (type === 'submit') return `${el.value || 'Submit'} button. Say submit to press.`;
        }

        if (tag === 'textarea') return `${label || placeholder || 'Text area'}. Please tell me what to enter.`;
        if (tag === 'select') return `${label || ariaLabel || 'Dropdown'}. Say next to continue.`;
        if (tag === 'button') return `${text || 'Button'}. Say submit to press.`;
        if (tag === 'a') return `Link to ${text}. Say go to follow.`;
        if (tag === 'label') return '';

        return null;
    };

    // ==================== FORM INPUT HANDLING ====================

    const startInputTimeout = useCallback(() => {
        // Clear any existing timeout
        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
        }

        // Set 5-second timeout to remind user
        inputTimeoutRef.current = setTimeout(() => {
            if (waitingForInputRef.current && currentInputElementRef.current) {
                const fieldName = currentInputElementRef.current.placeholder ||
                    currentInputElementRef.current.getAttribute('aria-label') ||
                    'this field';
                speak(`I'm waiting for your input for ${fieldName}. Please speak now, or say next to skip.`, () => {
                    // Restart timeout
                    startInputTimeout();
                });
            }
        }, 5000);
    }, [speak]);

    const handleVoiceInput = useCallback((transcript) => {
        const input = transcript.toLowerCase().trim();

        // Navigation commands - "go" followed by destination
        if (input.startsWith('go to ') || input.startsWith('goto ')) {
            const destination = input.replace(/^go ?to\s+/, '');
            const routes = {
                'housing': '/housing',
                'healthcare': '/healthcare',
                'health': '/healthcare',
                'education': '/education',
                'transport': '/transport',
                'dashboard': '/',
                'home': '/',
                'profile': '/profile',
                'signup': '/signup',
                'sign up': '/signup',
                'login': '/login',
                'marketplace': '/marketplace',
            };

            for (const [key, path] of Object.entries(routes)) {
                if (destination.includes(key)) {
                    speak(`Going to ${key}`, () => {
                        navigate(path);
                    });
                    return true;
                }
            }
        }

        // Single word "go" means submit or proceed
        if (input === 'go' || input === 'submit' || input === 'sign in' || input === 'login') {
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) {
                speak('Submitting the form', () => {
                    submitBtn.click();
                });
                return true;
            }
        }

        // Navigation control commands
        if (input === 'next' || input === 'skip') {
            waitingForInputRef.current = false;
            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
            currentIndexRef.current++;
            setTimeout(() => readNextElement(), 500);
            return true;
        }

        if (input === 'back' || input === 'previous') {
            navigate(-1);
            return true;
        }

        if (input === 'stop' || input === 'pause') {
            window.speechSynthesis.cancel();
            isReadingPageRef.current = false;
            waitingForInputRef.current = false;
            speak('Stopped. Say read to continue or go to navigate.');
            return true;
        }

        if (input === 'read' || input === 'start') {
            startReadingPage();
            return true;
        }

        if (input.includes('turn off') || input.includes('disable voice')) {
            speak('Turning off voice assistant', () => {
                toggleVoice(false);
            });
            return true;
        }

        // Checkbox handling
        if (input === 'check' || input === 'uncheck' || input === 'toggle') {
            const elements = elementsRef.current;
            const index = currentIndexRef.current;
            if (index < elements.length && elements[index].isCheckbox) {
                const el = elements[index].element;
                el.checked = !el.checked;
                el.dispatchEvent(new Event('change', { bubbles: true }));
                speak(el.checked ? 'Checked' : 'Unchecked', () => {
                    currentIndexRef.current++;
                    setTimeout(() => readNextElement(), 500);
                });
                return true;
            }
        }

        // If waiting for input on a form field, enter the text
        if (waitingForInputRef.current && currentInputElementRef.current) {
            const el = currentInputElementRef.current;

            // Don't fill password fields with voice
            if (el.type === 'password') {
                speak('Please type your password manually, then say next to continue.');
                return true;
            }

            // Fill the input with the spoken text
            el.value = transcript; // Use original case
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));

            // Clear timeout and move to next
            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
            waitingForInputRef.current = false;
            currentInputElementRef.current = null;

            speak(`Entered ${transcript}. Moving to next field.`, () => {
                currentIndexRef.current++;
                setTimeout(() => readNextElement(), 500);
            });
            return true;
        }

        // Unknown command
        speak(`I heard "${transcript}". Say go to navigate, next to continue, or speak your input for form fields.`);
        return true;
    }, [speak, navigate, toggleVoice]);

    // ==================== READING FUNCTIONS ====================

    const startReadingPage = useCallback(() => {
        window.speechSynthesis.cancel();
        isReadingPageRef.current = true;
        waitingForInputRef.current = false;
        elementsRef.current = collectElements();
        currentIndexRef.current = 0;

        const pageName = getPageName();
        const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

        let intro = `You are on the ${pageName} page.`;
        if (isAuthPage) {
            intro += ` I will guide you through each field. Speak your answers and I will fill them in. Say go when done to submit.`;
        }

        speak(intro, () => {
            setTimeout(() => readNextElement(), 800);
        });
    }, [collectElements, getPageName, location.pathname, speak]);

    const readNextElement = useCallback(() => {
        if (!isReadingPageRef.current) return;

        const elements = elementsRef.current;
        const index = currentIndexRef.current;

        if (index >= elements.length) {
            isReadingPageRef.current = false;
            speak('End of form. Say go or submit to continue, or go to followed by a page name to navigate.');
            return;
        }

        const item = elements[index];

        // Highlight element
        document.querySelectorAll('.voice-highlight').forEach(el => {
            el.classList.remove('voice-highlight');
            el.style.outline = '';
            el.style.boxShadow = '';
        });

        if (item.element) {
            item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            item.element.classList.add('voice-highlight');
            item.element.style.outline = '3px solid #3B82F6';
            item.element.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
            item.element.focus();
        }

        speak(item.text, () => {
            if (item.isInput) {
                // This is an input field - wait for voice input
                waitingForInputRef.current = true;
                currentInputElementRef.current = item.element;
                startInputTimeout();
            } else if (item.isButton) {
                // Button - just announce and wait for command
                speak('Say go or submit to press this button, or next to skip.');
            } else if (item.isCheckbox) {
                // Checkbox - wait for check/uncheck command
                speak('Say check or uncheck, or next to skip.');
            } else {
                // Non-interactive - auto continue
                currentIndexRef.current++;
                setTimeout(() => readNextElement(), 1000);
            }
        });
    }, [speak, startInputTimeout]);

    // ==================== SPEECH RECOGNITION ====================

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
        recognition.continuous = true;
        recognition.interimResults = true; // Enable interim results for faster detection
        recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.maxAlternatives = 3; // More alternatives for better accuracy

        recognition.onstart = () => {
            console.log('Speech recognition started');
            startListening();
        };

        recognition.onresult = (event) => {
            // Get the latest result
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    // Only process final results
                    const transcript = result[0].transcript.trim();
                    const confidence = result[0].confidence;
                    console.log('Voice detected:', transcript, 'Confidence:', (confidence * 100).toFixed(1) + '%');

                    if (transcript && transcript.length > 0) {
                        handleVoiceInput(transcript);
                    }
                } else {
                    // Log interim results for debugging
                    console.log('Hearing:', result[0].transcript);
                }
            }
        };

        recognition.onerror = (event) => {
            console.log('Recognition error:', event.error);
            if (event.error === 'not-allowed') {
                speak('Please allow microphone access. Go to browser settings and enable microphone for this site.');
            } else if (event.error === 'no-speech') {
                // No speech detected - restart silently
                console.log('No speech detected, restarting...');
            } else if (event.error === 'audio-capture') {
                speak('Microphone not found. Please check your microphone connection.');
            } else if (event.error === 'network') {
                speak('Network error. Please check your internet connection.');
            }

            // Auto-restart on most errors
            if (voiceEnabled && event.error !== 'not-allowed' && event.error !== 'audio-capture') {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 500);
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            // Always restart if voice is still enabled
            if (voiceEnabled && !isSpeakingRef.current) {
                setTimeout(() => {
                    try {
                        recognition.start();
                        console.log('Speech recognition restarted');
                    } catch (e) {
                        console.log('Could not restart:', e);
                    }
                }, 200);
            }
        };

        recognition.onsoundstart = () => {
            console.log('Sound detected');
        };

        recognition.onspeechstart = () => {
            console.log('Speech started');
        };

        recognitionRef.current = recognition;

        // Start recognition
        setTimeout(() => {
            try {
                recognition.start();
                console.log('Initial speech recognition start');
            } catch (e) {
                console.log('Could not start recognition:', e);
            }
        }, 500);

        return () => {
            try { recognitionRef.current?.stop(); } catch (e) { }
        };
    }, [voiceEnabled, i18n.language, handleVoiceInput, speak, startListening]);

    // ==================== PAGE CHANGE HANDLING ====================

    useEffect(() => {
        if (voiceEnabled && location.pathname !== lastPathRef.current) {
            lastPathRef.current = location.pathname;
            isReadingPageRef.current = false;
            waitingForInputRef.current = false;
            currentIndexRef.current = 0;

            setTimeout(() => {
                startReadingPage();
            }, 1500);
        }
    }, [location.pathname, voiceEnabled, startReadingPage]);

    // Initial greeting
    useEffect(() => {
        if (voiceEnabled) {
            const greet = () => {
                const pageName = getPageName();
                speak(`Voice assistant ready. Welcome to ${pageName}. I will guide you through this page.`, () => {
                    setTimeout(() => startReadingPage(), 800);
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
            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
            document.querySelectorAll('.voice-highlight').forEach(el => {
                el.classList.remove('voice-highlight');
                el.style.outline = '';
                el.style.boxShadow = '';
            });
        };
    }, [voiceEnabled]); // eslint-disable-line

    // Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
            try { recognitionRef.current?.stop(); } catch (e) { }
        };
    }, []);

    return null;
};

export default VoiceAssistant;
