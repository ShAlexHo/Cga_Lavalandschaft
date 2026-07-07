import * as THREE from 'three';
import vertex_glsl    from '../shaders/metaball.vert?raw';
import noise_glsl     from '../shaders/noise.glsl?raw';
import fragment_glsl  from '../shaders/metaball.frag?raw';

const vertex_shader   = noise_glsl + vertex_glsl;
const fragment_shader = noise_glsl + fragment_glsl;

const LIGHT_WORLD_POSITION = new THREE.Vector3(6, 8, 6);
const _light_view_position = new THREE.Vector3();

export function createMetaballMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: 1.0 },
            u_glow_color: { value: new THREE.Color(1.0, 0.05, 0.0) },
            u_color_hot: { value: new THREE.Color(0xa01500) },
            u_color_cool: { value: new THREE.Color(0.20, 0.03, 0.02) },
            u_noise_enabled: { value: 1.0 },
            u_noise_color_1: { value: new THREE.Color(0x7c3027) },
            u_noise_color_2: { value: new THREE.Color(0.82, 0.14, 0.02) },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
        },
        side: THREE.DoubleSide,
    });
}

export function updateMetaballLight(material, camera, time) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}
