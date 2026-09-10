import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createFpsMeter } from '../fps_meter.js';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { vi.restoreAllMocks(); });

describe('createFpsMeter', () => {
    test('appends a display element to the document body', () => {
        createFpsMeter();
        expect(document.body.children).toHaveLength(1);
    });

    test('does not update the displayed text before the update interval has elapsed', () => {
        let now = 1000;
        vi.spyOn(performance, 'now').mockImplementation(() => now);
        const meter = createFpsMeter();
        const element = document.body.firstChild;

        now += 100;
        meter.tick();
        expect(element.textContent).toBe('');
    });

    test('shows the average fps once the update interval has elapsed', () => {
        let now = 1000;
        vi.spyOn(performance, 'now').mockImplementation(() => now);
        const meter = createFpsMeter();
        const element = document.body.firstChild;

        for (let i = 0; i < 30; i++) meter.tick();
        now += 500;
        meter.tick();
        expect(element.textContent).toBe('62 FPS'); // 31 ticks / 0.5s
    });

    test('resets the frame count after each update', () => {
        let now = 1000;
        vi.spyOn(performance, 'now').mockImplementation(() => now);
        const meter = createFpsMeter();
        const element = document.body.firstChild;

        now += 500;
        meter.tick();
        expect(element.textContent).toBe('2 FPS'); // 1 tick / 0.5s

        now += 500;
        meter.tick();
        expect(element.textContent).toBe('2 FPS'); // frame_count reset to 0, not accumulated across updates
    });
});
