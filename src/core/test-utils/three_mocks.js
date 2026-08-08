// Shared `vi.mock('three', ...)` fakes - safe to import directly despite vi.mock() hoisting,
// since Vitest resolves imports before a mock factory runs.

import { vi } from 'vitest';

export function makeScene() {
    return { add: vi.fn() };
}

export function makeColor(hex = '000000') {
    return {
        _hex: hex,
        set(value) { this._hex = String(value).replace('#', ''); return this; },
        getHexString() { return this._hex; },
    };
}

export class MockHexColor {
    constructor(hex = 0) { this.hex = hex; }
    getHexString() { return this.hex.toString(16).padStart(6, '0'); }
    set(value) { this.hex = value; return this; }
}

export class MockRgbColor {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r; this.g = g; this.b = b;
    }
}

export class MockVector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z;
    }
    copy(other) {
        this.x = other.x; this.y = other.y; this.z = other.z;
        return this;
    }
    applyMatrix4(_matrix) {
        return this; // identity transform in tests
    }
}

export class MockShaderMaterial {
    constructor(parameters = {}) {
        this.uniforms = parameters.uniforms ?? {};
        this.vertexShader = parameters.vertexShader ?? '';
        this.fragmentShader = parameters.fragmentShader ?? '';
        this.side = parameters.side ?? 0;
        this.transparent = parameters.transparent ?? false;
        this.depthWrite = parameters.depthWrite ?? true;
    }
}

export class MockMesh {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.visible = true;
    }
}

export class MockPlaneGeometry {
    constructor(width, height, width_segments, height_segments) {
        this.width = width; this.height = height;
        this.width_segments = width_segments; this.height_segments = height_segments;
    }
}
