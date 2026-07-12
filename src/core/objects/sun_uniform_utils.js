export function bindSunUniforms(material) {
    return {
        getSunEnabled: () => material.uniforms.u_sun_enabled.value === 1.0,
        setSunEnabled: value => { material.uniforms.u_sun_enabled.value = value ? 1.0 : 0.0; },
        getSunStrength: () => material.uniforms.u_sun_strength.value,
        setSunStrength: value => { material.uniforms.u_sun_strength.value = value; },
    };
}
