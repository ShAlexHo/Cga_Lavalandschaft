import { vi } from 'vitest';

// Animation modules bake state at import time; resetting modules per case also restarts
// rand.js's seeded RNG from the same seed, keeping results deterministic.
export async function importFreshModule(importModule) {
    vi.resetModules();
    return importModule();
}
