import { toHexColor } from './color_utils.js';

export function bindDisplacementUniforms(material) {
    return {
        getDisplacementScale: () => material.uniforms.u_displacement_scale.value,
        setDisplacementScale: value => { material.uniforms.u_displacement_scale.value = value; },
        getDisplacementFrequency: () => material.uniforms.u_displacement_frequency.value,
        setDisplacementFrequency: value => { material.uniforms.u_displacement_frequency.value = value; },
    };
}

export function bindCrackColorUniforms(material) {
    return {
        getCrackColor: () => toHexColor(material.uniforms.u_crack_color.value),
        setCrackColor: value => material.uniforms.u_crack_color.value.set(value),
        getCrackColor2: () => toHexColor(material.uniforms.u_crack_color_2.value),
        setCrackColor2: value => material.uniforms.u_crack_color_2.value.set(value),
    };
}
