import { createSmokeGeometry, updateSmokeGeometry } from '../geometry/smoke_geometry.js';
import { createSmokeMaterial } from '../rendering/smoke_material.js';
import { settings, stepSmokeAnimation } from '../animation/smoke_animation.js';
import { toHexColor } from './color_utils.js';

export function createSmoke(scene) {
    const material = createSmokeMaterial();
    const effect = createSmokeGeometry(scene, material);

    return {
        effect,
        update(time, eruption_intensity) {
            updateSmokeGeometry(effect, stepSmokeAnimation(time, eruption_intensity));
        },

        getVisible: () => effect.visible,
        setVisible: value => { effect.visible = value; },

        getCount: () => settings.count,
        setCount: value => { settings.count = value; },
        getMaxCount: () => settings.max_count,
        getSpread: () => settings.spread,
        setSpread: value => { settings.spread = value; },
        getRiseSpeed: () => settings.rise_speed,
        setRiseSpeed: value => { settings.rise_speed = value; },

        getColor1: () => toHexColor(material.uniforms.u_color_1.value),
        setColor1: value => material.uniforms.u_color_1.value.set(value),
        getColor2: () => toHexColor(material.uniforms.u_color_2.value),
        setColor2: value => material.uniforms.u_color_2.value.set(value),
        getColor3: () => toHexColor(material.uniforms.u_color_3.value),
        setColor3: value => material.uniforms.u_color_3.value.set(value),
        getParticleSize: () => material.uniforms.u_size.value,
        setParticleSize: value => { material.uniforms.u_size.value = value; },
    };
}
