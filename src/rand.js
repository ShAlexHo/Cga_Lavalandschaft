const SEED = 42;

const make_seeded_rand = (seed) => {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
};

const rand_raw = make_seeded_rand(SEED);

export const rand = (min, max) => min + rand_raw() * (max - min);
export const rand3 = (min, max) => [rand(min, max), rand(min, max), rand(min, max)];
