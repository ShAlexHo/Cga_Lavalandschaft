import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/ground.vert?raw';
import fragment_glsl from '../shaders/ground.frag?raw';
import {
    GROUND_CRACK_FREQUENCY, SUN_LIGHT_COLOR, GROUND_CRACK_DENSITY_FADE_START, GROUND_CRACK_DENSITY_FADE_END,
} from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';
import { updateKeyAndSunLightUniforms } from './light_utils.js';

export function createGroundMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_time: { value: 0.0 },
            u_light_position: { value: new THREE.Vector3() },
            u_sun_position: { value: new THREE.Vector3() },
            u_sun_color: { value: new THREE.Color(SUN_LIGHT_COLOR) },
            u_sun_enabled: { value: 1.0 },
            u_sun_strength: { value: DEFAULT_SETTINGS.sunStrength },
            u_sun_focus: { value: DEFAULT_SETTINGS.sunFocus },
            u_displacement_scale: { value: DEFAULT_SETTINGS.groundDisplacementScale },
            u_displacement_frequency: { value: DEFAULT_SETTINGS.groundDisplacementFrequency },
            u_crack_frequency: { value: GROUND_CRACK_FREQUENCY },
            u_crack_softness: { value: DEFAULT_SETTINGS.groundCrackSoftness },
            u_rock_color: { value: new THREE.Color(DEFAULT_SETTINGS.groundColor) },
            u_rock_color_2: { value: new THREE.Color(DEFAULT_SETTINGS.groundColor2) },
            u_rock_color_3: { value: new THREE.Color(DEFAULT_SETTINGS.groundColor3) },
            u_rock_color_4: { value: new THREE.Color(DEFAULT_SETTINGS.groundColor4) },
            u_crack_color: { value: new THREE.Color(DEFAULT_SETTINGS.groundCrackColor) },
            u_crack_color_2: { value: new THREE.Color(DEFAULT_SETTINGS.groundCrackColor2) },
            u_crack_color_3: { value: new THREE.Color(DEFAULT_SETTINGS.groundCrackColor3) },
            u_crack_color_4: { value: new THREE.Color(DEFAULT_SETTINGS.groundCrackColor4) },
            u_volcano_position: { value: new THREE.Vector3() },
            u_proximity_color: { value: new THREE.Color(DEFAULT_SETTINGS.groundProximityColor) },
            u_proximity_noise_color: { value: new THREE.Color(DEFAULT_SETTINGS.groundProximityNoiseColor) },
            u_proximity_radius: { value: DEFAULT_SETTINGS.groundProximityRadius },
            u_sun_focus_radius: { value: DEFAULT_SETTINGS.groundSunFocusRadius },
            u_rock_variance_radius: { value: DEFAULT_SETTINGS.groundRockVarianceRadius },
            // volcano's own crack scale/frequency, so the blended pattern near its foot matches (ground.vert)
            u_volcano_crack_scale: { value: DEFAULT_SETTINGS.volcanoDisplacementScale },
            u_volcano_crack_frequency: { value: DEFAULT_SETTINGS.volcanoDisplacementFrequency },
            u_crack_density_fade_start: { value: GROUND_CRACK_DENSITY_FADE_START },
            u_crack_density_fade_end: { value: GROUND_CRACK_DENSITY_FADE_END },
        },
        side: THREE.DoubleSide,
        precision: 'highp',
    });
}

export function updateGroundLight(material, camera, volcano_world_position, sun_world_position, time) {
    updateKeyAndSunLightUniforms(material, camera, sun_world_position);
    material.uniforms.u_volcano_position.value.copy(volcano_world_position);
    material.uniforms.u_time.value = time;
}
