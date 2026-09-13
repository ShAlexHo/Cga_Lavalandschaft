import { createMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls, updateMetaballDisplacement } from '../rendering/metaball_material.js';
import { toHexColor } from '../rendering/color_utils.js';
import { settings, getActiveBalls, stepMetaballAnimation, getEruptionIntensity } from '../animation/metaball_animation.js';
import { METABALL_GPU_MAX_BALLS } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createMetaballField(scene) {
    const material = createMetaballMaterial();
    const effect = createMetaballGeometry(scene, material);
    let last_camera = null;
    updateMetaballBalls(effect, getActiveBalls(), last_camera);

    let displacement_enabled = DEFAULT_SETTINGS.displacementEnabled;
    let displacement_strength = DEFAULT_SETTINGS.displacementStrength;

    return {
        effect,
        update(time, camera, volcano_position) {
            last_camera = camera;
            const balls = stepMetaballAnimation(time);
            if (balls) updateMetaballBalls(effect, balls, camera);
            updateMetaballLight(material, camera, time);
            updateMetaballDisplacement(material, { enabled: displacement_enabled, strength: displacement_strength, camera, volcano_position });
        },

        isPaused: () => settings.paused,
        setPaused: value => { settings.paused = value; },
        getEruptionIntensity: time => getEruptionIntensity(time),
        // subtract/isolation let the interaction layer replicate metaball.frag's blended field, not
        // just nearest-ball distance.
        getActiveWorldPositions: () => getActiveBalls().map(ball => ({
            ...ballToWorldPosition(ball, effect),
            radius: ballToWorldRadius(ball, effect),
            subtract: ball.subtract,
            isolation: effect.isolation,
        })),
        // shrink_increment accumulates onto the ball's persisted shrink_fraction, so an already-shrunk
        // ball doesn't pop back to full size.
        squeezeNearestBall({ x, y, z, shrink_increment }) {
            let nearest_ball = null;
            let nearest_distance = Infinity;
            for (const ball of getActiveBalls()) {
                const world_position = ballToWorldPosition(ball, effect);
                const dx = world_position.x - x, dy = world_position.y - y, dz = world_position.z - z;
                const ball_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (ball_distance < nearest_distance) {
                    nearest_distance = ball_distance;
                    nearest_ball = ball;
                }
            }
            if (!nearest_ball) return;
            nearest_ball.shrink_fraction = Math.min(1, nearest_ball.shrink_fraction + shrink_increment);
            const scale = Math.max(1 - nearest_ball.shrink_fraction, 0);
            nearest_ball.strength = nearest_ball.base_strength * scale * scale; // radius ∝ sqrt(strength)
            if (scale <= 0) nearest_ball.active = false;
        },

        getCount: () => settings.count,
        setCount: value => { settings.count = value; updateMetaballBalls(effect, getActiveBalls(), last_camera); },
        // GUI/persistence max only, clamped to the GPU array size - settings.max_count itself stays uncapped.
        getMaxCount: () => Math.min(settings.max_count, METABALL_GPU_MAX_BALLS),
        getIsolation: () => effect.isolation,
        setIsolation: value => { effect.isolation = value; updateMetaballBalls(effect, getActiveBalls(), last_camera); },
        getRadius: () => effect.radius_scale,
        setRadius: value => { effect.radius_scale = value; updateMetaballBalls(effect, getActiveBalls(), last_camera); },
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
        setDisplacementEnabled: value => { displacement_enabled = value; },
        getDisplacementStrength: () => displacement_strength,
        setDisplacementStrength: value => { displacement_strength = value; },
    };
}
