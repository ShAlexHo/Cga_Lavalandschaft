const STORAGE_KEY = 'lavalandschaft_settings';

export function save_to_local_storage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function load_from_local_storage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Saved settings are corrupted:', e);
        return null;
    }
}

export function download_json(data, filename = 'lavalandschaft-settings.json') {
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

export function upload_json(on_loaded) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                on_loaded(JSON.parse(reader.result));
            } catch (e) {
                console.error('Invalid JSON file:', e);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
