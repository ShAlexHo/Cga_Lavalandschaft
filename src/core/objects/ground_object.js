import * as THREE from 'three';
import { createGroundMaterial, updateGroundLight } from '../rendering/ground_material.js';
import { toHexColor } from '../rendering/color_utils.js';
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
        update(camera, volcano_world_position, sun_world_position, time) {
            updateGroundLight(material, camera, volcano_world_position, sun_world_position, time);
        },

        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setColor: value => material.uniforms.u_rock_color.value.set(value),
        getColor2: () => toHexColor(material.uniforms.u_rock_color_2.value),
        setColor2: value => material.uniforms.u_rock_color_2.value.set(value),
        getColor3: () => toHexColor(material.uniforms.u_rock_color_3.value),
        setColor3: value => material.uniforms.u_rock_color_3.value.set(value),
        getColor4: () => toHexColor(material.uniforms.u_rock_color_4.value),
        setColor4: value => material.uniforms.u_rock_color_4.value.set(value),
        getCrackSoftness: () => material.uniforms.u_crack_softness.value,
        setCrackSoftness: value => { material.uniforms.u_crack_softness.value = value; },
        getProximityColor: () => toHexColor(material.uniforms.u_proximity_color.value),
        setProximityColor: value => material.uniforms.u_proximity_color.value.set(value),
        getProximityNoiseColor: () => toHexColor(material.uniforms.u_proximity_noise_color.value),
        setProximityNoiseColor: value => material.uniforms.u_proximity_noise_color.value.set(value),
        getProximityRadius: () => material.uniforms.u_proximity_radius.value,
        setProximityRadius: value => { material.uniforms.u_proximity_radius.value = value; },
        getSunFocusRadius: () => material.uniforms.u_sun_focus_radius.value,
        setSunFocusRadius: value => { material.uniforms.u_sun_focus_radius.value = value; },
        getRockVarianceRadius: () => material.uniforms.u_rock_variance_radius.value,
        setRockVarianceRadius: value => { material.uniforms.u_rock_variance_radius.value = value; },
        ...bindCrackColorUniforms(material),
        ...bindDisplacementUniforms(material),
        ...bindSunUniforms(material),
        ...bindSunFocusUniform(material),
    };
}
