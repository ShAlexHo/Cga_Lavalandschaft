export const OCTAVE_COUNT = 4;
export const LACUNARITY = 2.1;
export const GAIN = 0.5;

const WHITE_NOISE_SAMPLES_PER_UNIT = 6;
const WHITE_NOISE_SEED_OFFSET = 1000;

function randomValue(index) {
    const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
    return 2 * (value - Math.floor(value)) - 1;
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

export function gradientNoise(x) {
    const lattice_index = Math.floor(x);
    const offset = x - lattice_index;
    const left = randomValue(lattice_index) * offset;
    const right = randomValue(lattice_index + 1) * (offset - 1);
    return 2 * (left + fade(offset) * (right - left));
}

export function octaveNoise(x, octave) {
    return GAIN ** (octave + 1) * gradientNoise(LACUNARITY ** octave * x);
}

export function fractalNoise(x) {
    let value = 0;
    for (let octave = 0; octave < OCTAVE_COUNT; octave++) value += octaveNoise(x, octave);
    return value;
}

function sampleCurve(noise, x_max, samples_per_unit) {
    const sample_count = Math.round(x_max * samples_per_unit);
    return Array.from({ length: sample_count + 1 }, (_, i) => {
        const x = i / samples_per_unit;
        return { x, y: noise(x, i) };
    });
}

export function noiseCurves(x_max, samples_per_unit) {
    return {
        white: sampleCurve((x, i) => randomValue(i + WHITE_NOISE_SEED_OFFSET), x_max, WHITE_NOISE_SAMPLES_PER_UNIT),
        octaves: Array.from({ length: OCTAVE_COUNT }, (_, octave) => sampleCurve(x => octaveNoise(x, octave), x_max, samples_per_unit)),
        fractal: sampleCurve(fractalNoise, x_max, samples_per_unit),
    };
}
