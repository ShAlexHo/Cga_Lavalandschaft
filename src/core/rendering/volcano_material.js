import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/volcano.vert?raw';
import fragment_glsl from '../shaders/volcano.frag?raw';
import { SUN_LIGHT_COLOR, INTERACTION_MAX_POINTS, INTERACTION_PLATEAU_FRACTION } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { updateKeyAndSunLightUniforms } from './light_utils.js';

// Compile-time array size for GLSL; mirrors GOD_RAYS_NUM_SAMPLES in god_rays_material.js.
const vertex_glsl_resolved = vertex_glsl.replaceAll('INTERACTION_MAX_POINTS', INTERACTION_MAX_POINTS);

export function createVolcanoMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl_resolved,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_sun_position: { value: new THREE.Vector3() },
            u_sun_color: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
            u_sun_focus: { value: DEFAULT_SETTINGS.sunFocus },
            u_displacement_scale: { value: DEFAULT_SETTINGS.volcanoDisplacementScale },
            u_displacement_frequency: { value: DEFAULT_SETTINGS.volcanoDisplacementFrequency },
            u_rock_color: { value: new THREE.Color(DEFAULT_SETTINGS.volcanoRockColor) },
            u_interaction_positions: { value: Array.from({ length: INTERACTION_MAX_POINTS }, () => new THREE.Vector3()) },
            u_interaction_strengths: { value: new Float32Array(INTERACTION_MAX_POINTS) },
            u_interaction_radii: { value: new Float32Array(INTERACTION_MAX_POINTS) },
            u_interaction_plateau_fraction: { value: INTERACTION_PLATEAU_FRACTION },
        },
        side: THREE.DoubleSide,
        precision: 'highp',
    });
}

export function updateVolcanoLight(material, camera, sun_world_position) {
    updateKeyAndSunLightUniforms(material, camera, sun_world_position);
}

export function updateVolcanoInteraction(material, touch_points) {
    const positions = material.uniforms.u_interaction_positions.value;
    const strengths = material.uniforms.u_interaction_strengths.value;
    const radii = material.uniforms.u_interaction_radii.value;
    for (let i = 0; i < INTERACTION_MAX_POINTS; i++) {
        const point = touch_points[i];
        if (point) {
            positions[i].set(point.x, point.y, point.z);
            strengths[i] = point.strength;
            radii[i] = point.radius;
        } else {
            strengths[i] = 0.0;
        }
    }
}
