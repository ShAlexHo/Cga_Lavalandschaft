import { createSmokeGeometry, setSmokeDrawRange } from '../geometry/smoke_geometry.js';
import { createSmokeMaterial, updateSmokeMaterial } from '../rendering/smoke_material.js';
import { toHexColor } from '../rendering/color_utils.js';
import { settings, particle_seeds, computePlumeOpacityFactor } from '../animation/smoke_particles.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindVisibility } from './visibility_utils.js';

export function createSmoke(scene) {
    const material = createSmokeMaterial();
    const effect = createSmokeGeometry(scene, material, particle_seeds);
    setSmokeDrawRange(effect, settings.count);

    return {
        effect,
        update(time, eruption_intensity = 1.0) {
            updateSmokeMaterial(material, time, computePlumeOpacityFactor(eruption_intensity));
        },

        ...bindVisibility(effect),

        getCount: () => settings.count,
        setCount: value => { settings.count = value; setSmokeDrawRange(effect, value); },
        getMaxCount: () => settings.max_count,
        getSpread: () => material.uniforms.u_spread.value,
        setSpread: value => { material.uniforms.u_spread.value = value; },
        getRiseSpeed: () => material.uniforms.u_rise_speed.value,
        setRiseSpeed: value => { material.uniforms.u_rise_speed.value = value; },

        getColor1: () => toHexColor(material.uniforms.u_color_1.value),
        setColor1: value => material.uniforms.u_color_1.value.set(value),
        getColor2: () => toHexColor(material.uniforms.u_color_2.value),
        setColor2: value => material.uniforms.u_color_2.value.set(value),
        getColor3: () => toHexColor(material.uniforms.u_color_3.value),
        setColor3: value => material.uniforms.u_color_3.value.set(value),
        getParticleSize: () => material.uniforms.u_size.value,
        setParticleSize: value => { material.uniforms.u_size.value = value; },
        getEmberCoolingTime: () => material.uniforms.u_ember_cooling_time.value,
        setEmberCoolingTime: value => { material.uniforms.u_ember_cooling_time.value = value; },

        ...bindSunUniforms(material),
    };
}
