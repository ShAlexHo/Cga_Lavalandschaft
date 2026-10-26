const STORAGE_KEY = 'lavalandschaft_settings';

export function saveToLocalStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromLocalStorage() {
    const serialized_settings = localStorage.getItem(STORAGE_KEY);
    if (!serialized_settings) return null;
    try {
        return JSON.parse(serialized_settings);
    } catch (error) {
        console.error('Saved settings are corrupted:', error);
        return null;
    }
}
