import * as THREE from 'three';
import noise_glsl    from '../shaders/noise.glsl?raw';
import vertex_glsl   from '../shaders/volcano.vert?raw';
import fragment_glsl from '../shaders/volcano.frag?raw';

const LIGHT_WORLD_POSITION = new THREE.Vector3(5, 8, 5);
const _light_view_position = new THREE.Vector3();

export function createVolcanoMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader:   noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_disp_scale: { value: 2.5  },
            u_disp_freq: { value: 0.5  },
            u_crack_freq: { value: 1.0  },
            u_rock_color: { value: new THREE.Color(0xafafaf) },
            u_crack_color: { value: new THREE.Color(0.003, 0.003, 0.003) },
        },
        side: THREE.DoubleSide,
    });
}

export function updateVolcanoLight(material, camera) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
}
