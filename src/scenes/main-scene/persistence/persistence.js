const STORAGE_KEY = 'lavalandschaft_settings';

export function saveToLocalStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Saved settings are corrupted:', error);
        return null;
    }
}

export function downloadJson(data, filename = 'lavalandschaft-settings.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function uploadJson(onLoaded) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                onLoaded(JSON.parse(reader.result));
            } catch (error) {
                console.error('Invalid JSON file:', error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
