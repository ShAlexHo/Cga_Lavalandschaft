import { vi } from 'vitest';

export async function importFreshModule(importModule) {
    vi.resetModules();
    return importModule();
}
