const SEED = 42;

export const make_seeded_rand = (seed) => {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
};

const rand_raw = make_seeded_rand(SEED);

export const rand = (min, max) => min + rand_raw() * (max - min);
export const rand3 = (min, max) => [rand(min, max), rand(min, max), rand(min, max)];

export const rand_gauss = (mean, std) => {
    const u1 = rand_raw() + 1e-10;
    const u2 = rand_raw();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * std;
};
