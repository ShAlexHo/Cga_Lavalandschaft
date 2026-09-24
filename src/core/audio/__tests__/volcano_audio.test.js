import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createVolcanoAudio, pickNextEventTime, computeProximityGain } from '../volcano_audio.js';
import {
    AUDIO_CRACKLE_MIN_INTERVAL, AUDIO_CRACKLE_MAX_INTERVAL, AUDIO_RUMBLE_MIN_INTERVAL, AUDIO_RUMBLE_MAX_INTERVAL,
    AUDIO_METABALL_SPAWN_GAIN, AUDIO_PRESS_GAIN,
    AUDIO_PROXIMITY_NEAR_DISTANCE, AUDIO_PROXIMITY_FAR_DISTANCE,
    AUDIO_PROXIMITY_AMBIENT_FAR_GAIN, AUDIO_PROXIMITY_AMBIENT_NEAR_GAIN,
    AUDIO_PROXIMITY_ACCENT_FAR_GAIN, AUDIO_PROXIMITY_ACCENT_NEAR_GAIN,
} from '../../config.js';
import DEFAULT_SETTINGS from '../../default_settings.json';

class MockAudioParam {
    constructor(value = 0) {
        this.value = value;
    }
    setValueAtTime(value) { this.value = value; return this; }
    exponentialRampToValueAtTime(value) { this.value = value; return this; }
    setTargetAtTime(value) { this.value = value; return this; }
}

function makeMockNode() {
    return { connect: vi.fn(node => node) };
}

function makeMockAudioContext() {
    const created = { buffer_sources: [], oscillators: [], filters: [], gains: [] };
    return {
        currentTime: 0,
        sampleRate: 44100,
        destination: makeMockNode(),
        resume: vi.fn(),
        createBuffer: vi.fn((channels, length) => ({
            getChannelData: () => new Float32Array(length),
        })),
        createGain: vi.fn(() => {
            const node = { ...makeMockNode(), gain: new MockAudioParam(1) };
            created.gains.push(node);
            return node;
        }),
        createBiquadFilter: vi.fn(() => {
            const node = { ...makeMockNode(), type: 'lowpass', frequency: new MockAudioParam(0) };
            created.filters.push(node);
            return node;
        }),
        createBufferSource: vi.fn(() => {
            const node = { ...makeMockNode(), buffer: null, loop: false, start: vi.fn(), stop: vi.fn() };
            created.buffer_sources.push(node);
            return node;
        }),
        createOscillator: vi.fn(() => {
            const node = { ...makeMockNode(), type: 'sine', frequency: new MockAudioParam(0), start: vi.fn(), stop: vi.fn() };
            created.oscillators.push(node);
            return node;
        }),
        _created: created,
    };
}

describe('pickNextEventTime', () => {
    test('returns a time within [current_time + min, current_time + max]', () => {
        for (let i = 0; i < 20; i++) {
            const result = pickNextEventTime(10, 2, 5);
            expect(result).toBeGreaterThanOrEqual(12);
            expect(result).toBeLessThanOrEqual(15);
        }
    });
});

describe('computeProximityGain', () => {
    test('returns far_gain at or beyond the far distance and near_gain at or inside the near distance', () => {
        expect(computeProximityGain(AUDIO_PROXIMITY_FAR_DISTANCE, 0.2, 2)).toBeCloseTo(0.2, 9);
        expect(computeProximityGain(AUDIO_PROXIMITY_FAR_DISTANCE + 10, 0.2, 2)).toBeCloseTo(0.2, 9);
        expect(computeProximityGain(AUDIO_PROXIMITY_NEAR_DISTANCE, 0.2, 2)).toBeCloseTo(2, 9);
        expect(computeProximityGain(AUDIO_PROXIMITY_NEAR_DISTANCE - 10, 0.2, 2)).toBeCloseTo(2, 9);
    });

    test('rises quadratically, not linearly, as the camera approaches', () => {
        const halfway = (AUDIO_PROXIMITY_NEAR_DISTANCE + AUDIO_PROXIMITY_FAR_DISTANCE) / 2;
        expect(computeProximityGain(halfway, 0, 1)).toBeCloseTo(0.25, 9);
    });
});

describe('createVolcanoAudio', () => {
    let context;
    beforeEach(() => { context = makeMockAudioContext(); });

    test('starts a looping buffer source for the continuous lava noise bed', () => {
        createVolcanoAudio(context);
        const lava_source = context._created.buffer_sources[0];
        expect(lava_source.loop).toBe(true);
        expect(lava_source.buffer).not.toBeNull();
        expect(lava_source.start).toHaveBeenCalled();
    });

    test('starts an LFO oscillator modulating the flow bed gain', () => {
        createVolcanoAudio(context);
        expect(context._created.oscillators[0].start).toHaveBeenCalled();
    });

    test('start() resumes the audio context', () => {
        const audio = createVolcanoAudio(context);
        audio.start();
        expect(context.resume).toHaveBeenCalledTimes(1);
    });

    test('defaults to enabled at DEFAULT_SETTINGS.soundVolume', () => {
        const audio = createVolcanoAudio(context);
        expect(audio.getEnabled()).toBe(true);
        expect(audio.getVolume()).toBeCloseTo(DEFAULT_SETTINGS.soundVolume, 9);
    });

    test('setEnabled(false) mutes the master gain, setEnabled(true) restores it to the current volume', () => {
        const audio = createVolcanoAudio(context);
        const master_gain = context._created.gains[0];

        audio.setEnabled(false);
        expect(master_gain.gain.value).toBe(0);

        audio.setEnabled(true);
        expect(master_gain.gain.value).toBeCloseTo(DEFAULT_SETTINGS.soundVolume, 9);
    });

    test('setVolume() updates the master gain while enabled', () => {
        const audio = createVolcanoAudio(context);
        audio.setVolume(0.8);
        expect(context._created.gains[0].gain.value).toBeCloseTo(0.8, 9);
    });

    test('setVolume() while disabled keeps the master gain muted until re-enabled', () => {
        const audio = createVolcanoAudio(context);
        audio.setEnabled(false);
        audio.setVolume(0.8);
        expect(context._created.gains[0].gain.value).toBe(0);
        audio.setEnabled(true);
        expect(context._created.gains[0].gain.value).toBeCloseTo(0.8, 9);
    });

    test('update() triggers no crackle/rumble before their first scheduled time', () => {
        const audio = createVolcanoAudio(context);
        const buffer_sources_before = context._created.buffer_sources.length;
        const oscillators_before = context._created.oscillators.length;
        audio.update(0);
        expect(context._created.buffer_sources.length).toBe(buffer_sources_before);
        expect(context._created.oscillators.length).toBe(oscillators_before);
    });

    test('update() plays a crackle burst once enough simulated time has passed', () => {
        const audio = createVolcanoAudio(context);
        const buffer_sources_before = context._created.buffer_sources.length;
        audio.update(AUDIO_CRACKLE_MAX_INTERVAL + 0.01);
        expect(context._created.buffer_sources.length).toBeGreaterThan(buffer_sources_before);
    });

    test('update() plays a two-pulse rumble once enough simulated time has passed', () => {
        const audio = createVolcanoAudio(context);
        const oscillators_before = context._created.oscillators.length;
        audio.update(AUDIO_RUMBLE_MAX_INTERVAL + 0.01);
        expect(context._created.oscillators.length).toBe(oscillators_before + 2);
    });

    test('update() does not retrigger a crackle on the same or an earlier time', () => {
        const audio = createVolcanoAudio(context);
        audio.update(AUDIO_CRACKLE_MAX_INTERVAL + 0.01);
        const count_after_first = context._created.buffer_sources.length;
        audio.update(AUDIO_CRACKLE_MAX_INTERVAL + 0.01);
        expect(context._created.buffer_sources.length).toBe(count_after_first);
    });

    test('a crackle occasionally clusters into a quick flurry of several pops instead of exactly one', () => {
        const audio = createVolcanoAudio(context);
        const buffer_sources_before = context._created.buffer_sources.length;
        let time = 0;
        let trigger_count = 0;
        for (let i = 0; i < 30; i++) {
            time += AUDIO_CRACKLE_MAX_INTERVAL + 0.01;
            const count_before = context._created.buffer_sources.length;
            audio.update(time);
            if (context._created.buffer_sources.length > count_before) trigger_count++;
        }
        const total_pops = context._created.buffer_sources.length - buffer_sources_before;
        expect(trigger_count).toBeGreaterThan(0);
        expect(total_pops).toBeGreaterThan(trigger_count);
    });

    test('a triggered crackle schedules its next occurrence within the configured interval bounds', () => {
        const audio = createVolcanoAudio(context);
        audio.update(AUDIO_CRACKLE_MIN_INTERVAL);
        const count_at_min = context._created.buffer_sources.length;
        audio.update(AUDIO_CRACKLE_MIN_INTERVAL + AUDIO_CRACKLE_MAX_INTERVAL + 0.01);
        expect(context._created.buffer_sources.length).toBeGreaterThan(count_at_min);
    });

    test('playMetaballSpawn() plays a noise burst and a pitch-dropping thump', () => {
        const audio = createVolcanoAudio(context);
        const buffer_sources_before = context._created.buffer_sources.length;
        const oscillators_before = context._created.oscillators.length;

        audio.playMetaballSpawn();

        expect(context._created.buffer_sources.length).toBe(buffer_sources_before + 1);
        expect(context._created.oscillators.length).toBe(oscillators_before + 1);
        const thump = context._created.oscillators.at(-1);
        expect(thump.start).toHaveBeenCalled();
        expect(thump.stop).toHaveBeenCalled();
    });

    test('playMetaballSpawn() plays its noise body at AUDIO_METABALL_SPAWN_GAIN', () => {
        const audio = createVolcanoAudio(context);
        audio.playMetaballSpawn();
        const [noise_gain] = context._created.gains.slice(-2);
        expect(noise_gain.gain.value).toBeCloseTo(AUDIO_METABALL_SPAWN_GAIN, 9);
    });

    test('setCameraDistance() drives the ambient and accent proximity buses between their far and near gains', () => {
        const audio = createVolcanoAudio(context);
        const [, ambient_proximity_gain, accent_proximity_gain] = context._created.gains;

        audio.setCameraDistance(AUDIO_PROXIMITY_FAR_DISTANCE);
        expect(ambient_proximity_gain.gain.value).toBeCloseTo(AUDIO_PROXIMITY_AMBIENT_FAR_GAIN, 9);
        expect(accent_proximity_gain.gain.value).toBeCloseTo(AUDIO_PROXIMITY_ACCENT_FAR_GAIN, 9);

        audio.setCameraDistance(AUDIO_PROXIMITY_NEAR_DISTANCE);
        expect(ambient_proximity_gain.gain.value).toBeCloseTo(AUDIO_PROXIMITY_AMBIENT_NEAR_GAIN, 9);
        expect(accent_proximity_gain.gain.value).toBeCloseTo(AUDIO_PROXIMITY_ACCENT_NEAR_GAIN, 9);
    });

    test('crackle, rumble and spawn thump route through the accent bus, the lava bed through the ambient bus', () => {
        const audio = createVolcanoAudio(context);
        const [, ambient_proximity_gain, accent_proximity_gain] = context._created.gains;
        const lava_flow_gain = context._created.gains[3];
        expect(lava_flow_gain.connect).toHaveBeenCalledWith(ambient_proximity_gain);

        const gains_before = context._created.gains.length;
        audio.update(Math.max(AUDIO_CRACKLE_MAX_INTERVAL, AUDIO_RUMBLE_MAX_INTERVAL) + 0.01);
        audio.playMetaballSpawn();
        const event_gains = context._created.gains.slice(gains_before);
        const thump_gain = event_gains.at(-1);
        const spawn_noise_gain = event_gains.at(-2);
        for (const gain of event_gains.slice(0, -2)) expect(gain.connect).toHaveBeenCalledWith(accent_proximity_gain);
        expect(thump_gain.connect).toHaveBeenCalledWith(accent_proximity_gain);
        expect(spawn_noise_gain.connect).toHaveBeenCalledWith(ambient_proximity_gain);
    });

    test('the press noise bed starts silent', () => {
        createVolcanoAudio(context);
        const press_gain = context._created.gains.at(-1);
        expect(press_gain.gain.value).toBe(0);
    });

    test('setPressing(true) raises the press noise to AUDIO_PRESS_GAIN, setPressing(false) silences it again', () => {
        const audio = createVolcanoAudio(context);
        const press_gain = context._created.gains.at(-1);

        audio.setPressing(true);
        expect(press_gain.gain.value).toBeCloseTo(AUDIO_PRESS_GAIN, 9);

        audio.setPressing(false);
        expect(press_gain.gain.value).toBe(0);
    });
});
