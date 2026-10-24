import { MESSAGES } from './messages.js';

const STORAGE_KEY = 'lavalandschaft_language';

export const LANGUAGES = Object.keys(MESSAGES);
export const DEFAULT_LANGUAGE = 'en';

// storage can be missing or blocked; the language then just isn't remembered
function loadSavedLanguage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
    } catch {
        return DEFAULT_LANGUAGE;
    }
}

function saveLanguage(language) {
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // not remembered across reloads
    }
}

const listeners = new Set();
let current_language = loadSavedLanguage();
document.documentElement.lang = current_language;

export function getLanguage() {
    return current_language;
}

export function setLanguage(language) {
    if (!LANGUAGES.includes(language) || language === current_language) return;
    current_language = language;
    saveLanguage(language);
    document.documentElement.lang = language;
    listeners.forEach(listener => listener(language));
}

export function onLanguageChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function translate(key, language = current_language) {
    return MESSAGES[language]?.[key] ?? MESSAGES[DEFAULT_LANGUAGE][key] ?? key;
}
