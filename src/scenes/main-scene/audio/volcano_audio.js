import { random } from '../rand.js';
import {
    AUDIO_LAVA_NOISE_DURATION, AUDIO_LAVA_LOWPASS_FREQUENCY, AUDIO_LAVA_FLOW_GAIN,
    AUDIO_LAVA_FLOW_LFO_FREQUENCY, AUDIO_LAVA_FLOW_LFO_DEPTH,
    AUDIO_CRACKLE_MIN_INTERVAL, AUDIO_CRACKLE_MAX_INTERVAL, AUDIO_CRACKLE_DURATION,
    AUDIO_CRACKLE_BANDPASS_FREQUENCY, AUDIO_CRACKLE_GAIN,
    AUDIO_CRACKLE_GAIN_VARIANCE_MIN, AUDIO_CRACKLE_GAIN_VARIANCE_MAX,
    AUDIO_CRACKLE_CLUSTER_CHANCE, AUDIO_CRACKLE_CLUSTER_MIN_COUNT, AUDIO_CRACKLE_CLUSTER_MAX_COUNT,
    AUDIO_CRACKLE_CLUSTER_GAP_MIN, AUDIO_CRACKLE_CLUSTER_GAP_MAX,
    AUDIO_RUMBLE_MIN_INTERVAL, AUDIO_RUMBLE_MAX_INTERVAL, AUDIO_RUMBLE_FREQUENCY_START,
    AUDIO_RUMBLE_FREQUENCY_END, AUDIO_RUMBLE_DURATION, AUDIO_RUMBLE_GAIN,
    AUDIO_RUMBLE_SECOND_PULSE_DELAY, AUDIO_RUMBLE_SECOND_PULSE_GAIN_SCALE,
    AUDIO_METABALL_SPAWN_NOISE_DURATION, AUDIO_METABALL_SPAWN_LOWPASS_FREQUENCY,
    AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_START, AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_END,
    AUDIO_METABALL_SPAWN_DURATION, AUDIO_METABALL_SPAWN_GAIN,
    AUDIO_PRESS_NOISE_DURATION, AUDIO_PRESS_BANDPASS_FREQUENCY, AUDIO_PRESS_GAIN, AUDIO_PRESS_FADE_TIME_CONSTANT,
    AUDIO_PROXIMITY_NEAR_DISTANCE, AUDIO_PROXIMITY_FAR_DISTANCE,
    AUDIO_PROXIMITY_AMBIENT_FAR_GAIN, AUDIO_PROXIMITY_AMBIENT_NEAR_GAIN,
    AUDIO_PROXIMITY_ACCENT_FAR_GAIN, AUDIO_PROXIMITY_ACCENT_NEAR_GAIN, AUDIO_PROXIMITY_FADE_TIME_CONSTANT,
} from '../config.js';
import { clamp } from '../animation/math_utils.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function computeProximityGain(camera_distance, far_gain, near_gain) {
    const proximity = clamp(
        (AUDIO_PROXIMITY_FAR_DISTANCE - camera_distance) / (AUDIO_PROXIMITY_FAR_DISTANCE - AUDIO_PROXIMITY_NEAR_DISTANCE),
        0, 1,
    );
    return far_gain + (near_gain - far_gain) * proximity * proximity;
}

export function pickNextEventTime(current_time, min_interval, max_interval) {
    return current_time + random(min_interval, max_interval);
}

function fillBrownNoise(data) {
    let last = 0;
    for (let i = 0; i < data.length; i++) {
        const white = random(-1, 1);
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
    }
}

function fillCrackleBurst(data) {
    for (let i = 0; i < data.length; i++) {
        const decay = (1 - i / data.length) ** 3;
        data[i] = random(-1, 1) * decay;
    }
}

function fillWhiteNoise(data) {
    for (let i = 0; i < data.length; i++) data[i] = random(-1, 1);
}

function createNoiseBuffer(audio_context, duration, fillData) {
    const buffer = audio_context.createBuffer(1, Math.floor(audio_context.sampleRate * duration), audio_context.sampleRate);
    fillData(buffer.getChannelData(0));
    return buffer;
}

export function createVolcanoAudio(audio_context = new (window.AudioContext || window.webkitAudioContext)()) {
    const master_gain = audio_context.createGain();
    master_gain.connect(audio_context.destination);

    let enabled = DEFAULT_SETTINGS.soundEnabled;
    let volume = DEFAULT_SETTINGS.soundVolume;
    master_gain.gain.value = enabled ? volume : 0;
    function applyMasterGain() {
        master_gain.gain.setTargetAtTime(enabled ? volume : 0, audio_context.currentTime, 0.2);
    }

    const ambient_proximity_gain = audio_context.createGain();
    ambient_proximity_gain.gain.value = AUDIO_PROXIMITY_AMBIENT_FAR_GAIN;
    ambient_proximity_gain.connect(master_gain);
    const accent_proximity_gain = audio_context.createGain();
    accent_proximity_gain.gain.value = AUDIO_PROXIMITY_ACCENT_FAR_GAIN;
    accent_proximity_gain.connect(master_gain);

    const lava_noise_buffer = createNoiseBuffer(audio_context, AUDIO_LAVA_NOISE_DURATION, fillBrownNoise);
    const crackle_buffer = createNoiseBuffer(audio_context, AUDIO_CRACKLE_DURATION, fillCrackleBurst);

    const lava_noise_source = audio_context.createBufferSource();
    lava_noise_source.buffer = lava_noise_buffer;
    lava_noise_source.loop = true;
    const lava_lowpass = audio_context.createBiquadFilter();
    lava_lowpass.type = 'lowpass';
    lava_lowpass.frequency.value = AUDIO_LAVA_LOWPASS_FREQUENCY;
    const lava_flow_gain = audio_context.createGain();
    lava_flow_gain.gain.value = AUDIO_LAVA_FLOW_GAIN;
    lava_noise_source.connect(lava_lowpass).connect(lava_flow_gain).connect(ambient_proximity_gain);
    lava_noise_source.start();

    const flow_lfo = audio_context.createOscillator();
    flow_lfo.frequency.value = AUDIO_LAVA_FLOW_LFO_FREQUENCY;
    const flow_lfo_depth = audio_context.createGain();
    flow_lfo_depth.gain.value = AUDIO_LAVA_FLOW_GAIN * AUDIO_LAVA_FLOW_LFO_DEPTH;
    flow_lfo.connect(flow_lfo_depth).connect(lava_flow_gain.gain);
    flow_lfo.start();

    function playCrackleAt(start_time) {
        const source = audio_context.createBufferSource();
        source.buffer = crackle_buffer;
        const bandpass = audio_context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = AUDIO_CRACKLE_BANDPASS_FREQUENCY;
        const gain = audio_context.createGain();
        gain.gain.value = AUDIO_CRACKLE_GAIN * random(AUDIO_CRACKLE_GAIN_VARIANCE_MIN, AUDIO_CRACKLE_GAIN_VARIANCE_MAX);
        source.connect(bandpass).connect(gain).connect(accent_proximity_gain);
        source.start(start_time);
    }

    function playCrackle() {
        let next_pop_time = audio_context.currentTime;
        playCrackleAt(next_pop_time);
        if (random(0, 1) < AUDIO_CRACKLE_CLUSTER_CHANCE) {
            const extra_count = Math.round(random(AUDIO_CRACKLE_CLUSTER_MIN_COUNT, AUDIO_CRACKLE_CLUSTER_MAX_COUNT));
            for (let i = 0; i < extra_count; i++) {
                next_pop_time += random(AUDIO_CRACKLE_CLUSTER_GAP_MIN, AUDIO_CRACKLE_CLUSTER_GAP_MAX);
                playCrackleAt(next_pop_time);
            }
        }
    }

    function playRumblePulse(start_time, gain_scale) {
        const oscillator = audio_context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(AUDIO_RUMBLE_FREQUENCY_START, start_time);
        oscillator.frequency.exponentialRampToValueAtTime(AUDIO_RUMBLE_FREQUENCY_END, start_time + AUDIO_RUMBLE_DURATION);
        const gain = audio_context.createGain();
        gain.gain.setValueAtTime(0.0001, start_time);
        gain.gain.exponentialRampToValueAtTime(AUDIO_RUMBLE_GAIN * gain_scale, start_time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, start_time + AUDIO_RUMBLE_DURATION);
        oscillator.connect(gain).connect(accent_proximity_gain);
        oscillator.start(start_time);
        oscillator.stop(start_time + AUDIO_RUMBLE_DURATION + 0.05);
    }

    function playRumble() {
        const now = audio_context.currentTime;
        playRumblePulse(now, 1.0);
        playRumblePulse(now + AUDIO_RUMBLE_SECOND_PULSE_DELAY, AUDIO_RUMBLE_SECOND_PULSE_GAIN_SCALE);
    }

    const metaball_spawn_noise_buffer = createNoiseBuffer(audio_context, AUDIO_METABALL_SPAWN_NOISE_DURATION, fillCrackleBurst);

    function playMetaballSpawn() {
        const now = audio_context.currentTime;

        const noise_source = audio_context.createBufferSource();
        noise_source.buffer = metaball_spawn_noise_buffer;
        const lowpass = audio_context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = AUDIO_METABALL_SPAWN_LOWPASS_FREQUENCY;
        const noise_gain = audio_context.createGain();
        noise_gain.gain.value = AUDIO_METABALL_SPAWN_GAIN;
        noise_source.connect(lowpass).connect(noise_gain).connect(ambient_proximity_gain);
        noise_source.start();

        const thump = audio_context.createOscillator();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_START, now);
        thump.frequency.exponentialRampToValueAtTime(AUDIO_METABALL_SPAWN_THUMP_FREQUENCY_END, now + AUDIO_METABALL_SPAWN_DURATION);
        const thump_gain = audio_context.createGain();
        thump_gain.gain.setValueAtTime(0.0001, now);
        thump_gain.gain.exponentialRampToValueAtTime(AUDIO_METABALL_SPAWN_GAIN, now + 0.02);
        thump_gain.gain.exponentialRampToValueAtTime(0.0001, now + AUDIO_METABALL_SPAWN_DURATION);
        thump.connect(thump_gain).connect(accent_proximity_gain);
        thump.start(now);
        thump.stop(now + AUDIO_METABALL_SPAWN_DURATION + 0.05);
    }

    const press_noise_buffer = createNoiseBuffer(audio_context, AUDIO_PRESS_NOISE_DURATION, fillWhiteNoise);
    const press_noise_source = audio_context.createBufferSource();
    press_noise_source.buffer = press_noise_buffer;
    press_noise_source.loop = true;
    const press_bandpass = audio_context.createBiquadFilter();
    press_bandpass.type = 'bandpass';
    press_bandpass.frequency.value = AUDIO_PRESS_BANDPASS_FREQUENCY;
    const press_gain = audio_context.createGain();
    press_gain.gain.value = 0;
    press_noise_source.connect(press_bandpass).connect(press_gain).connect(ambient_proximity_gain);
    press_noise_source.start();

    let next_crackle_time = pickNextEventTime(0, AUDIO_CRACKLE_MIN_INTERVAL, AUDIO_CRACKLE_MAX_INTERVAL);
    let next_rumble_time = pickNextEventTime(0, AUDIO_RUMBLE_MIN_INTERVAL, AUDIO_RUMBLE_MAX_INTERVAL);

    return {
        start: () => audio_context.resume(),
        stop: () => audio_context.suspend(),
        update(time) {
            if (time >= next_crackle_time) {
                playCrackle();
                next_crackle_time = pickNextEventTime(time, AUDIO_CRACKLE_MIN_INTERVAL, AUDIO_CRACKLE_MAX_INTERVAL);
            }
            if (time >= next_rumble_time) {
                playRumble();
                next_rumble_time = pickNextEventTime(time, AUDIO_RUMBLE_MIN_INTERVAL, AUDIO_RUMBLE_MAX_INTERVAL);
            }
        },
        playMetaballSpawn,
        setPressing: is_pressing => {
            press_gain.gain.setTargetAtTime(is_pressing ? AUDIO_PRESS_GAIN : 0, audio_context.currentTime, AUDIO_PRESS_FADE_TIME_CONSTANT);
        },
        setCameraDistance: camera_distance => {
            const now = audio_context.currentTime;
            ambient_proximity_gain.gain.setTargetAtTime(
                computeProximityGain(camera_distance, AUDIO_PROXIMITY_AMBIENT_FAR_GAIN, AUDIO_PROXIMITY_AMBIENT_NEAR_GAIN),
                now, AUDIO_PROXIMITY_FADE_TIME_CONSTANT,
            );
            accent_proximity_gain.gain.setTargetAtTime(
                computeProximityGain(camera_distance, AUDIO_PROXIMITY_ACCENT_FAR_GAIN, AUDIO_PROXIMITY_ACCENT_NEAR_GAIN),
                now, AUDIO_PROXIMITY_FADE_TIME_CONSTANT,
            );
        },
        getEnabled: () => enabled,
        setEnabled: value => { enabled = value; applyMasterGain(); },
        getVolume: () => volume,
        setVolume: value => { volume = value; applyMasterGain(); },
    };
}
