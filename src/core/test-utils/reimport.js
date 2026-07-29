import { vi } from 'vitest';

// Animation modules bake state (module-level counters, seeded RNG-derived arrays) at import time,
// so tests must not share one import across cases. Resetting modules before each re-import also
// restarts rand.js's seeded RNG from the same seed, keeping results deterministic.
export async function importFreshModule(importModule) {
    vi.resetModules();
    return importModule();
}
