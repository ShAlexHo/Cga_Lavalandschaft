import { vi } from 'vitest';

export function makeScene() {
    return { add: vi.fn() };
}

export function makeColor(hex = '000000') {
    return {
        hex,
        set(value) { this.hex = String(value).replace('#', ''); return this; },
        getHexString() { return this.hex; },
    };
}

export function makeGroundMaterialUniformsMock() {
    return {
        u_displacement_scale: { value: 0.6 },
        u_displacement_frequency: { value: 0.08 },
        u_rock_color: { value: makeColor('220500') },
        u_rock_color_2: { value: makeColor('2a1f1a') },
        u_rock_color_3: { value: makeColor('1c1f24') },
        u_rock_color_4: { value: makeColor('35404a') },
        u_crack_color: { value: makeColor('050505') },
        u_crack_color_2: { value: makeColor('ffaa00') },
        u_crack_color_3: { value: makeColor('ffd700') },
        u_crack_color_4: { value: makeColor('dd0000') },
        u_crack_softness: { value: 0.25 },
        u_proximity_color: { value: makeColor('9b9696') },
        u_proximity_noise_color: { value: makeColor('8a3a1a') },
        u_proximity_radius: { value: 18.0 },
        u_sun_focus_radius: { value: 4.5 },
        u_rock_variance_radius: { value: 45.0 },
        u_sun_enabled: { value: 1.0 },
        u_sun_strength: { value: 0.06 },
        u_sun_focus: { value: 8.0 },
        u_volcano_crack_scale: { value: 2.5 },
        u_volcano_crack_frequency: { value: 0.5 },
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
    set(x, y, z) {
        this.x = x; this.y = y; this.z = z;
        return this;
    }
    copy(other) {
        this.x = other.x; this.y = other.y; this.z = other.z;
        return this;
    }
    applyMatrix4() {
        return this;
    }
}

export class MockMatrix4 {
    constructor() { this.elements = new Array(16).fill(0); }
    copy(other) { this.elements = [...other.elements]; return this; }
}

export class MockShaderMaterial {
    constructor(parameters = {}) {
        this.uniforms = parameters.uniforms ?? {};
        this.vertexShader = parameters.vertexShader ?? '';
        this.fragmentShader = parameters.fragmentShader ?? '';
        this.side = parameters.side ?? 0;
        this.transparent = parameters.transparent ?? false;
        this.depthWrite = parameters.depthWrite ?? true;
        this.depthTest = parameters.depthTest ?? true;
        this.glslVersion = parameters.glslVersion ?? null;
    }
}

export class MockMesh {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { set: vi.fn() };
        this.visible = true;
    }
}

export class MockPlaneGeometry {
    constructor(width, height, width_segments, height_segments) {
        this.width = width; this.height = height;
        this.width_segments = width_segments; this.height_segments = height_segments;
    }
}

export class MockBoxGeometry {
    constructor(width, height, depth) {
        this.width = width; this.height = height; this.depth = depth;
        this.translate = vi.fn();
    }
}
