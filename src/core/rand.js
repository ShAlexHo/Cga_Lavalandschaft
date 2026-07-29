const SEED = 42;

export function makeSeededRand(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

const randomRaw = makeSeededRand(SEED);

export function random(min, max) {
    return min + randomRaw() * (max - min);
}

export function randomGauss(mean, standard_deviation) {
    const uniform_sample_1 = randomRaw() + 1e-10;
    const uniform_sample_2 = randomRaw();
    const standard_normal_sample = Math.sqrt(-2.0 * Math.log(uniform_sample_1)) * Math.cos(2.0 * Math.PI * uniform_sample_2);
    return mean + standard_normal_sample * standard_deviation;
}
