import { describe, test, expect, vi, beforeEach } from 'vitest';
import { saveToLocalStorage, loadFromLocalStorage } from '../persistence.js';

function makeMemoryStorage() {
    const store = new Map();
    return {
        getItem: key => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: key => store.delete(key),
    };
}

beforeEach(() => {
    vi.stubGlobal('localStorage', makeMemoryStorage());
});

describe('saveToLocalStorage / loadFromLocalStorage', () => {
    test('round-trips a plain object', () => {
        const data = { count: 42, colorHot: '#ff0000', paused: true };
        saveToLocalStorage(data);
        expect(loadFromLocalStorage()).toEqual(data);
    });

    test('returns null when nothing has been saved yet', () => {
        expect(loadFromLocalStorage()).toBeNull();
    });

    test('returns null and logs an error for corrupted JSON', () => {
        localStorage.setItem('lavalandschaft_settings', '{not valid json');
        const error_spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(loadFromLocalStorage()).toBeNull();
        expect(error_spy).toHaveBeenCalled();

        error_spy.mockRestore();
    });
});
