import { describe, test, expect, vi, beforeEach } from 'vitest';
import { saveToLocalStorage, loadFromLocalStorage, downloadJson, uploadJson } from '../persistence.js';

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

describe('downloadJson', () => {
    test('creates and clicks a download link, then cleans it up', () => {
        const original_create_object_url = URL.createObjectURL;
        const original_revoke_object_url = URL.revokeObjectURL;
        URL.createObjectURL = vi.fn(() => 'blob:mock-url');
        URL.revokeObjectURL = vi.fn();

        const append_spy = vi.spyOn(document.body, 'appendChild');
        const remove_spy = vi.spyOn(document.body, 'removeChild');
        let clicked_link;
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { clicked_link = this; });

        downloadJson({ foo: 'bar' }, 'export.json');

        expect(clicked_link.download).toBe('export.json');
        expect(clicked_link.href).toBe('blob:mock-url');
        expect(append_spy).toHaveBeenCalledWith(clicked_link);
        expect(remove_spy).toHaveBeenCalledWith(clicked_link);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

        HTMLAnchorElement.prototype.click.mockRestore();
        append_spy.mockRestore();
        remove_spy.mockRestore();
        URL.createObjectURL = original_create_object_url;
        URL.revokeObjectURL = original_revoke_object_url;
    });
});

describe('uploadJson', () => {
    function makeMockFileReader() {
        const reader = { readAsText: vi.fn(), onload: null, result: null };
        reader.readAsText.mockImplementation(() => {
            reader.result = reader.next_result;
            reader.onload();
        });
        return reader;
    }

    test('parses the selected file and forwards the result to the callback', () => {
        const onLoaded = vi.fn();
        let created_input;
        const original_create_element = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation(tag_name => {
            const element = original_create_element(tag_name);
            if (tag_name === 'input') created_input = element;
            return element;
        });

        const mock_reader = makeMockFileReader();
        mock_reader.next_result = '{"foo":"bar"}';
        vi.stubGlobal('FileReader', vi.fn(() => mock_reader));

        uploadJson(onLoaded);

        const file = {};
        Object.defineProperty(created_input, 'files', { value: [file] });
        created_input.onchange();

        expect(mock_reader.readAsText).toHaveBeenCalledWith(file);
        expect(onLoaded).toHaveBeenCalledWith({ foo: 'bar' });

        document.createElement.mockRestore();
    });

    test('logs an error and does not call the callback for invalid JSON', () => {
        const onLoaded = vi.fn();
        let created_input;
        const original_create_element = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation(tag_name => {
            const element = original_create_element(tag_name);
            if (tag_name === 'input') created_input = element;
            return element;
        });

        const mock_reader = makeMockFileReader();
        mock_reader.next_result = 'not valid json';
        vi.stubGlobal('FileReader', vi.fn(() => mock_reader));
        const error_spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        uploadJson(onLoaded);
        Object.defineProperty(created_input, 'files', { value: [{}] });
        created_input.onchange();

        expect(onLoaded).not.toHaveBeenCalled();
        expect(error_spy).toHaveBeenCalled();

        error_spy.mockRestore();
        document.createElement.mockRestore();
    });

    test('does nothing when no file was selected', () => {
        const onLoaded = vi.fn();
        let created_input;
        const original_create_element = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation(tag_name => {
            const element = original_create_element(tag_name);
            if (tag_name === 'input') created_input = element;
            return element;
        });

        uploadJson(onLoaded);
        Object.defineProperty(created_input, 'files', { value: [] });
        created_input.onchange();

        expect(onLoaded).not.toHaveBeenCalled();

        document.createElement.mockRestore();
    });
});
