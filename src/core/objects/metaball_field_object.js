import { createMetaballGeometry, rebuildMetaballGeometry } from '../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight } from '../rendering/metaball_material.js';
import { settings, getActiveBalls, stepMetaballAnimation } from '../animation/metaball_animation.js';

const toHexColor = color => '#' + color.getHexString();

export function createMetaballField(scene) {
    const material = createMetaballMaterial();
    const effect = createMetaballGeometry(scene, material);
    rebuildMetaballGeometry(effect, getActiveBalls());

    let displacement_enabled = true;
    let displacement_last = material.uniforms.u_displacement.value;

    return {
        effect,
        update(time, camera) {
            const balls = stepMetaballAnimation(time);
            if (balls) rebuildMetaballGeometry(effect, balls);
            updateMetaballLight(material, camera, time);
        },

        isPaused: () => settings.paused,
        setPaused: value => { settings.paused = value; },

        getCount: () => settings.count,
        setCount: value => { settings.count = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getMaxCount: () => settings.max_count,
        getIsolation: () => effect.isolation,
        setIsolation: value => { effect.isolation = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getSpread: () => settings.spread,
        setSpread: value => { settings.spread = value; },
        getSpeed: () => settings.speed_factor,
        setSpeed: value => { settings.speed_factor = value; },
        getFlowRadius: () => settings.flow_z_radius,
        setFlowRadius: value => { settings.flow_z_radius = value; },

        getColorHot: () => toHexColor(material.uniforms.u_color_hot.value),
        setColorHot: value => material.uniforms.u_color_hot.value.set(value),
        getColorCool: () => toHexColor(material.uniforms.u_color_cool.value),
        setColorCool: value => material.uniforms.u_color_cool.value.set(value),
        getGlowEnabled: () => material.uniforms.u_glow_enabled.value === 1.0,
        setGlowEnabled: value => { material.uniforms.u_glow_enabled.value = value ? 1.0 : 0.0; },
        getGlowColor: () => toHexColor(material.uniforms.u_glow_color.value),
        setGlowColor: value => material.uniforms.u_glow_color.value.set(value),

        getNoiseEnabled: () => material.uniforms.u_noise_enabled.value === 1.0,
        setNoiseEnabled: value => { material.uniforms.u_noise_enabled.value = value ? 1.0 : 0.0; },
        getNoiseColor1: () => toHexColor(material.uniforms.u_noise_color_1.value),
        setNoiseColor1: value => material.uniforms.u_noise_color_1.value.set(value),
        getNoiseColor2: () => toHexColor(material.uniforms.u_noise_color_2.value),
        setNoiseColor2: value => material.uniforms.u_noise_color_2.value.set(value),
        getBumpEnabled: () => material.uniforms.u_bump_enabled.value === 1.0,
        setBumpEnabled: value => { material.uniforms.u_bump_enabled.value = value ? 1.0 : 0.0; },
        getDisplacementEnabled: () => displacement_enabled,
        setDisplacementEnabled: value => {
            displacement_enabled = value;
            if (value) {
                material.uniforms.u_displacement.value = displacement_last;
            } else {
                displacement_last = material.uniforms.u_displacement.value;
                material.uniforms.u_displacement.value = 0.0;
            }
        },
        getDisplacementStrength: () => material.uniforms.u_displacement.value,
        setDisplacementStrength: value => { material.uniforms.u_displacement.value = value; },
    };
}
