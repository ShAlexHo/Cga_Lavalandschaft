import * as THREE from 'three';
import { createGroundMaterial, updateGroundLight } from '../rendering/ground_material.js';
import { toHexColor } from './color_utils.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindDisplacementUniforms, bindCrackColorUniforms, bindSunFocusUniform } from './terrain_uniform_utils.js';
import { GROUND_SIZE, GROUND_SEGMENTS } from '../config.js';

export function createGround(scene) {
    const material = createGroundMaterial();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE, GROUND_SEGMENTS, GROUND_SEGMENTS), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -6;
    mesh.receiveShadow = true;
    scene.add(mesh);

    return {
        mesh,
        update(camera) {
            updateGroundLight(material, camera);
        },

        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setColor: value => material.uniforms.u_rock_color.value.set(value),
        getCrackSoftness: () => material.uniforms.u_crack_softness.value,
        setCrackSoftness: value => { material.uniforms.u_crack_softness.value = value; },
        ...bindCrackColorUniforms(material),
        ...bindDisplacementUniforms(material),
        ...bindSunUniforms(material),
        ...bindSunFocusUniform(material),
    };
}
