import { toHexColor } from './color_utils.js';

export function bindDisplacementUniforms(material) {
    return {
        getDisplacementScale: () => material.uniforms.u_disp_scale.value,
        setDisplacementScale: value => { material.uniforms.u_disp_scale.value = value; },
        getDisplacementFrequency: () => material.uniforms.u_disp_freq.value,
        setDisplacementFrequency: value => { material.uniforms.u_disp_freq.value = value; },
    };
}

export function bindCrackColorUniform(material) {
    return {
        getCrackColor: () => toHexColor(material.uniforms.u_crack_color.value),
        setCrackColor: value => material.uniforms.u_crack_color.value.set(value),
    };
}
