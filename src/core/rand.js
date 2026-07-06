const SEED = 42;

export const makeSeededRand = (seed) => {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
};

const random_raw = makeSeededRand(SEED);

export const random = (min, max) => min + random_raw() * (max - min);
export const random3 = (min, max) => [random(min, max), random(min, max), random(min, max)];

export const randomGauss = (mean, standard_deviation) => {
    const uniform_sample_1 = random_raw() + 1e-10;
    const uniform_sample_2 = random_raw();
    const standard_normal_sample = Math.sqrt(-2.0 * Math.log(uniform_sample_1)) * Math.cos(2.0 * Math.PI * uniform_sample_2);
    return mean + standard_normal_sample * standard_deviation;
};
