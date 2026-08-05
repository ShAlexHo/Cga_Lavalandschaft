import * as THREE from 'three';
import noise_glsl from '../shaders/noise.glsl?raw';
import vertex_glsl from '../shaders/ground.vert?raw';
import fragment_glsl from '../shaders/ground.frag?raw';
import {
    VOLCANO_LIGHT_POSITION, GROUND_CRACK_FREQUENCY, GROUND_DEFAULT_DISPLACEMENT_SCALE, GROUND_DEFAULT_DISPLACEMENT_FREQUENCY,
    GROUND_DEFAULT_CRACK_SOFTNESS, GROUND_DEFAULT_PROXIMITY_RADIUS, GROUND_DEFAULT_SUN_FOCUS_RADIUS, SUN_LIGHT_COLOR, SUN_DEFAULT_STRENGTH, SUN_DEFAULT_FOCUS,
    VOLCANO_DEFAULT_DISPLACEMENT_SCALE, VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY,
} from '../config.js';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(VOLCANO_LIGHT_POSITION.x, VOLCANO_LIGHT_POSITION.y, VOLCANO_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();
const _sun_view_position = new THREE.Vector3();

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
            u_sun_strength: { value: SUN_DEFAULT_STRENGTH },
            u_sun_focus: { value: SUN_DEFAULT_FOCUS },
            u_displacement_scale: { value: GROUND_DEFAULT_DISPLACEMENT_SCALE },
            u_displacement_frequency: { value: GROUND_DEFAULT_DISPLACEMENT_FREQUENCY },
            u_crack_frequency: { value: GROUND_CRACK_FREQUENCY },
            u_crack_softness: { value: GROUND_DEFAULT_CRACK_SOFTNESS },
            u_rock_color: { value: new THREE.Color(0x110f0f) },
            u_crack_color: { value: new THREE.Color(0xe03008) },
            u_crack_color_2: { value: new THREE.Color(0x872412) },
            u_crack_color_3: { value: new THREE.Color(0xdb9e49) },
            u_crack_color_4: { value: new THREE.Color(0xdd0000) },
            u_volcano_position: { value: new THREE.Vector3() },
            u_proximity_color: { value: new THREE.Color(0x000000) },
            u_proximity_noise_color: { value: new THREE.Color(0x2d2424) },
            u_proximity_radius: { value: GROUND_DEFAULT_PROXIMITY_RADIUS },
            u_sun_focus_radius: { value: GROUND_DEFAULT_SUN_FOCUS_RADIUS },
            // The volcano's own crack-displacement scale/frequency, so the jagged pattern blended into
            // the ground near its foot (see ground.vert) matches the volcano's geometry at the seam.
            u_volcano_crack_scale: { value: VOLCANO_DEFAULT_DISPLACEMENT_SCALE },
            u_volcano_crack_frequency: { value: VOLCANO_DEFAULT_DISPLACEMENT_FREQUENCY },
        },
        side: THREE.DoubleSide,
    });
}

export function updateGroundLight(material, camera, volcano_world_position, sun_world_position, time) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    computeLightViewPosition(camera, sun_world_position, _sun_view_position);
    material.uniforms.u_sun_position.value.copy(_sun_view_position);
    material.uniforms.u_volcano_position.value.copy(volcano_world_position);
    material.uniforms.u_time.value = time;
}
