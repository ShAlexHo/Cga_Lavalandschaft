import { createMetaballGeometry, rebuildMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight } from '../rendering/metaball_material.js';
import { settings, getActiveBalls, stepMetaballAnimation, getEruptionIntensity } from '../animation/metaball_animation.js';
import { toHexColor } from './color_utils.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createMetaballField(scene) {
    const material = createMetaballMaterial();
    const effect = createMetaballGeometry(scene, material);
    rebuildMetaballGeometry(effect, getActiveBalls());

    let displacement_enabled = DEFAULT_SETTINGS.displacementEnabled;
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
        getEruptionIntensity: time => getEruptionIntensity(time),
        getActiveWorldPositions: () => getActiveBalls().map(ball => ({
            ...ballToWorldPosition(ball, effect),
            radius: ballToWorldRadius(ball, effect),
        })),
        removeNearestBall: position => {
            let nearest_ball = null;
            let nearest_distance = Infinity;
            for (const ball of getActiveBalls()) {
                const world_position = ballToWorldPosition(ball, effect);
                const dx = world_position.x - position.x, dy = world_position.y - position.y, dz = world_position.z - position.z;
                const ball_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (ball_distance < nearest_distance) {
                    nearest_distance = ball_distance;
                    nearest_ball = ball;
                }
            }
            if (nearest_ball) nearest_ball.active = false;
        },

        getCount: () => settings.count,
        setCount: value => { settings.count = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getMaxCount: () => settings.max_count,
        getIsolation: () => effect.isolation,
        setIsolation: value => { effect.isolation = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getSpread: () => settings.spread,
        setSpread: value => { settings.spread = value; },
        getSpeed: () => settings.speed_factor,
        setSpeed: value => { settings.speed_factor = value; },
        getSinkSpeed: () => settings.sink_speed,
        setSinkSpeed: value => { settings.sink_speed = value; },
        getDisappearY: () => settings.disappear_y,
        setDisappearY: value => { settings.disappear_y = value; },
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
