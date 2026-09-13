import { createVolcanoGeometry, bakeCrackDisplacement } from '../geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight, updateVolcanoInteraction } from '../rendering/volcano_material.js';
import { toHexColor } from '../rendering/color_utils.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindDisplacementUniforms, bindSunFocusUniform } from './terrain_uniform_utils.js';
import { bindVisibility } from './visibility_utils.js';

export function createVolcano(scene) {
    const material = createVolcanoMaterial();
    const mesh = createVolcanoGeometry(scene, material);
    mesh.castShadow = true;

    const rebakeCrackDisplacement = () => bakeCrackDisplacement(
        mesh, material.uniforms.u_displacement_frequency.value, material.uniforms.u_displacement_scale.value,
    );

    return {
        mesh,
        rebakeCrackDisplacement,
        update(camera, sun_world_position, interaction_points = []) {
            updateVolcanoLight(material, camera, sun_world_position);
            updateVolcanoInteraction(material, interaction_points, camera, mesh.position);
        },

        ...bindVisibility(mesh),
        getRockColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setRockColor: value => material.uniforms.u_rock_color.value.set(value),
        ...bindDisplacementUniforms(material, rebakeCrackDisplacement),
        ...bindSunUniforms(material),
        ...bindSunFocusUniform(material),
    };
}
