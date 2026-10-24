import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { importFreshModule } from '../../core/test-utils/reimport.js';
import { MESSAGES } from '../messages.js';

const STORAGE_KEY = 'lavalandschaft_language';

// the environment's built-in localStorage behaves inconsistently across setups
function makeMemoryStorage() {
    const store = new Map();
    return {
        getItem: key => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: key => store.delete(key),
    };
}

let language_module;

beforeEach(async () => {
    vi.stubGlobal('localStorage', makeMemoryStorage());
    language_module = await importFreshModule(() => import('../language.js'));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('language', () => {
    test('defaults to English', () => {
        expect(language_module.getLanguage()).toBe('en');
        expect(document.documentElement.lang).toBe('en');
    });

    test('starts with a previously saved language', async () => {
        localStorage.setItem(STORAGE_KEY, 'de');
        language_module = await importFreshModule(() => import('../language.js'));
        expect(language_module.getLanguage()).toBe('de');
    });

    test('ignores an unknown saved language', async () => {
        localStorage.setItem(STORAGE_KEY, 'fr');
        language_module = await importFreshModule(() => import('../language.js'));
        expect(language_module.getLanguage()).toBe('en');
    });

    test('setLanguage saves the choice, updates <html lang> and notifies listeners', () => {
        const listener = vi.fn();
        language_module.onLanguageChange(listener);

        language_module.setLanguage('de');

        expect(language_module.getLanguage()).toBe('de');
        expect(localStorage.getItem(STORAGE_KEY)).toBe('de');
        expect(document.documentElement.lang).toBe('de');
        expect(listener).toHaveBeenCalledWith('de');
    });

    test('setLanguage ignores unknown languages and unchanged values', () => {
        const listener = vi.fn();
        language_module.onLanguageChange(listener);

        language_module.setLanguage('fr');
        language_module.setLanguage('en');

        expect(language_module.getLanguage()).toBe('en');
        expect(listener).not.toHaveBeenCalled();
    });

    test('onLanguageChange returns an unsubscribe function', () => {
        const listener = vi.fn();
        const unsubscribe = language_module.onLanguageChange(listener);
        unsubscribe();

        language_module.setLanguage('de');
        expect(listener).not.toHaveBeenCalled();
    });

    test('translate uses the current language, or an explicitly given one', () => {
        expect(language_module.translate('gui.interaction_mode')).toBe('Interaction mode');
        expect(language_module.translate('gui.interaction_mode', 'de')).toBe('Interaktionsmodus');
    });

    test('translate falls back to the key for unknown messages', () => {
        expect(language_module.translate('does.not.exist')).toBe('does.not.exist');
    });
});

describe('messages', () => {
    test('every language defines exactly the same keys', () => {
        const english_keys = Object.keys(MESSAGES.en).sort();
        for (const messages of Object.values(MESSAGES)) {
            expect(Object.keys(messages).sort()).toEqual(english_keys);
        }
    });
});
