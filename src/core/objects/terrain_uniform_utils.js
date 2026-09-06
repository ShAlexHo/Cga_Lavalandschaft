import { toHexColor } from '../rendering/color_utils.js';

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
        getCrackColor3: () => toHexColor(material.uniforms.u_crack_color_3.value),
        setCrackColor3: value => material.uniforms.u_crack_color_3.value.set(value),
        getCrackColor4: () => toHexColor(material.uniforms.u_crack_color_4.value),
        setCrackColor4: value => material.uniforms.u_crack_color_4.value.set(value),
    };
}

export function bindSunFocusUniform(material) {
    return {
        getSunFocus: () => material.uniforms.u_sun_focus.value,
        setSunFocus: value => { material.uniforms.u_sun_focus.value = value; },
    };
}
