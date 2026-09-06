import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/impact_smoke.vert?raw';
import fragment_glsl from '../shaders/smoke.frag?raw';
import {
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_PARTICLE_SIZE,
    INTERACTION_SMOKE_SPREAD_RADIUS, INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION, INTERACTION_SMOKE_RISE_SPEED,
    INTERACTION_SMOKE_PARTICLE_LIFETIME,
    INTERACTION_SMOKE_COLOR_1, INTERACTION_SMOKE_COLOR_2,
    SMOKE_EMBER_GLOW_STRENGTH, SUN_ASH_TINT_COLOR,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

const vertex_glsl_resolved = vertex_glsl.replaceAll('INTERACTION_SMOKE_MAX_BURSTS', INTERACTION_SMOKE_MAX_BURSTS);

export function createImpactSmokeMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertex_glsl_resolved,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_size: { value: INTERACTION_SMOKE_PARTICLE_SIZE },
            u_spread_radius: { value: INTERACTION_SMOKE_SPREAD_RADIUS },
            u_initial_spread_fraction: { value: INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION },
            u_rise_speed: { value: INTERACTION_SMOKE_RISE_SPEED },
            u_particle_lifetime: { value: INTERACTION_SMOKE_PARTICLE_LIFETIME },
            u_burst_positions: { value: Array.from({ length: INTERACTION_SMOKE_MAX_BURSTS }, () => new THREE.Vector3()) },
            u_burst_bloom: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_burst_fade: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_burst_elapsed: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_color_1: { value: new THREE.Color(INTERACTION_SMOKE_COLOR_1) },
            u_color_2: { value: new THREE.Color(INTERACTION_SMOKE_COLOR_2) },
            u_color_3: { value: new THREE.Color(DEFAULT_SETTINGS.smokeColor3) },
            u_ember_glow_strength: { value: SMOKE_EMBER_GLOW_STRENGTH },
            u_sun_color: { value: new THREE.Color(SUN_ASH_TINT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
        },
        transparent: true,
        depthWrite: false,
        precision: 'highp',
    });
}

export function updateImpactSmoke(material, bursts) {
    const positions = material.uniforms.u_burst_positions.value;
    const bloom = material.uniforms.u_burst_bloom.value;
    const fade = material.uniforms.u_burst_fade.value;
    const elapsed = material.uniforms.u_burst_elapsed.value;
    for (let i = 0; i < INTERACTION_SMOKE_MAX_BURSTS; i++) {
        const burst = bursts[i];
        if (burst) {
            positions[i].set(burst.x, burst.y, burst.z);
            bloom[i] = burst.bloom;
            fade[i] = burst.fade;
            elapsed[i] = burst.elapsed;
        } else {
            fade[i] = 0.0;
        }
    }
}
