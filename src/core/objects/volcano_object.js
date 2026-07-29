import { createVolcanoGeometry } from '../geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight } from '../rendering/volcano_material.js';
import { toHexColor } from './color_utils.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindDisplacementUniforms, bindSunFocusUniform } from './terrain_uniform_utils.js';

export function createVolcano(scene) {
    const material = createVolcanoMaterial();
    const mesh = createVolcanoGeometry(scene, material);
    mesh.castShadow = true;

    return {
        mesh,
        update(camera, sun_world_position) {
            updateVolcanoLight(material, camera, sun_world_position);
        },

        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getRockColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setRockColor: value => material.uniforms.u_rock_color.value.set(value),
        ...bindDisplacementUniforms(material),
        ...bindSunUniforms(material),
        ...bindSunFocusUniform(material),
    };
}
