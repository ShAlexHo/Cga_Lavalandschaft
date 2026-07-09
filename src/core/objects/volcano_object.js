import { createVolcanoGeometry } from '../geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight } from '../rendering/volcano_material.js';
import { toHexColor } from './color_utils.js';

export function createVolcano(scene) {
    const material = createVolcanoMaterial();
    const mesh = createVolcanoGeometry(scene, material);

    return {
        mesh,
        update(camera) {
            updateVolcanoLight(material, camera);
        },

        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getRockColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setRockColor: value => material.uniforms.u_rock_color.value.set(value),
        getCrackColor: () => toHexColor(material.uniforms.u_crack_color.value),
        setCrackColor: value => material.uniforms.u_crack_color.value.set(value),
        getDisplacementScale: () => material.uniforms.u_disp_scale.value,
        setDisplacementScale: value => { material.uniforms.u_disp_scale.value = value; },
        getDisplacementFrequency: () => material.uniforms.u_disp_freq.value,
        setDisplacementFrequency: value => { material.uniforms.u_disp_freq.value = value; },
    };
}
