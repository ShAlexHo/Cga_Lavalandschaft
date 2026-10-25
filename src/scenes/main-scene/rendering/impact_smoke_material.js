import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/impact_smoke.vert?raw';
import fragment_glsl from '../shaders/smoke.frag?raw';
import {
    INTERACTION_SMOKE_MAX_BURSTS, INTERACTION_SMOKE_PARTICLE_SIZE,
    INTERACTION_SMOKE_SPREAD_RADIUS, INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION, INTERACTION_SMOKE_RISE_SPEED,
    INTERACTION_SMOKE_PARTICLE_LIFETIME,
    INTERACTION_SMOKE_HAZE_GROWTH_DURATION, INTERACTION_SMOKE_HAZE_MAX_OPACITY,
    INTERACTION_SMOKE_RISE_BOOST_DURATION, INTERACTION_SMOKE_MAX_RISE_BOOST, INTERACTION_SMOKE_EMBER_RADIUS_FRACTION,
    INTERACTION_SMOKE_GREY_VARIANCE_MIN,
    INTERACTION_SMOKE_COLOR_1, INTERACTION_SMOKE_COLOR_2,
    SMOKE_EMBER_GLOW_STRENGTH, SUN_ASH_TINT_COLOR,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { updateSunLightUniform } from './light_utils.js';

const vertex_glsl_resolved = vertex_glsl.replaceAll('INTERACTION_SMOKE_MAX_BURSTS', INTERACTION_SMOKE_MAX_BURSTS);

export function createImpactSmokeMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl_resolved,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_size: { value: INTERACTION_SMOKE_PARTICLE_SIZE },
            u_spread_radius: { value: INTERACTION_SMOKE_SPREAD_RADIUS },
            u_initial_spread_fraction: { value: INTERACTION_SMOKE_INITIAL_SPREAD_FRACTION },
            u_rise_speed: { value: INTERACTION_SMOKE_RISE_SPEED },
            u_particle_lifetime: { value: INTERACTION_SMOKE_PARTICLE_LIFETIME },
            u_haze_growth_duration: { value: INTERACTION_SMOKE_HAZE_GROWTH_DURATION },
            u_haze_max_opacity: { value: INTERACTION_SMOKE_HAZE_MAX_OPACITY },
            u_rise_boost_duration: { value: INTERACTION_SMOKE_RISE_BOOST_DURATION },
            u_max_rise_boost: { value: INTERACTION_SMOKE_MAX_RISE_BOOST },
            u_ember_radius_fraction: { value: INTERACTION_SMOKE_EMBER_RADIUS_FRACTION },
            u_grey_variance_min: { value: INTERACTION_SMOKE_GREY_VARIANCE_MIN },
            u_burst_positions: { value: Array.from({ length: INTERACTION_SMOKE_MAX_BURSTS }, () => new THREE.Vector3()) },
            u_burst_bloom: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_burst_fade: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_burst_elapsed: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS) },
            u_burst_ember_strength: { value: new Float32Array(INTERACTION_SMOKE_MAX_BURSTS).fill(1) },
            u_color_1: { value: new THREE.Color(INTERACTION_SMOKE_COLOR_1) },
            u_color_2: { value: new THREE.Color(INTERACTION_SMOKE_COLOR_2) },
            u_color_3: { value: new THREE.Color(DEFAULT_SETTINGS.smokeColor3) },
            u_ember_glow_strength: { value: SMOKE_EMBER_GLOW_STRENGTH },
            u_sun_color: { value: new THREE.Color(SUN_ASH_TINT_COLOR) },
            u_sun_position: { value: new THREE.Vector3() },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        precision: 'highp',
    });
}

export function updateImpactSmoke(material, camera, sun_world_position, bursts) {
    updateSunLightUniform(material, camera, sun_world_position);

    const positions = material.uniforms.u_burst_positions.value;
    const bloom = material.uniforms.u_burst_bloom.value;
    const fade = material.uniforms.u_burst_fade.value;
    const elapsed = material.uniforms.u_burst_elapsed.value;
    const ember_strength = material.uniforms.u_burst_ember_strength.value;
    for (let i = 0; i < INTERACTION_SMOKE_MAX_BURSTS; i++) {
        const burst = bursts[i];
        if (burst) {
            positions[i].set(burst.x, burst.y, burst.z);
            bloom[i] = burst.bloom;
            fade[i] = burst.fade;
            elapsed[i] = burst.elapsed;
            ember_strength[i] = burst.ember_strength;
        } else {
            fade[i] = 0.0;
        }
    }
}
