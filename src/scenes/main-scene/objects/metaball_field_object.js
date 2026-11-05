import { createMetaballGeometry, ballToWorldPosition, ballToWorldRadius } from '../geometry/metaball_geometry.js';
import { createMetaballMaterial, updateMetaballLight, updateMetaballBalls, updateMetaballDisplacement } from '../rendering/metaball_material.js';
import { createMetaballFieldTexture } from '../rendering/metaball_field_texture.js';
import { toHexColor } from '../rendering/color_utils.js';
import { distance } from '../animation/math_utils.js';
import * as main_scene_animation from '../animation/metaball_animation.js';
import { METABALL_GPU_MAX_BALLS } from '../config.js';
import DEFAULT_SETTINGS from '../default_settings.json';

export function createMetaballField(scene, { animation: initial_animation = main_scene_animation, camera_arc_culling: initial_camera_arc_culling = true } = {}) {
    let animation = initial_animation;
    const field_texture = createMetaballFieldTexture({ max_balls: METABALL_GPU_MAX_BALLS });
    const material = createMetaballMaterial({ field_texture });
    const mesh = createMetaballGeometry(scene, material);
    let last_camera = null;
    let is_field_texture_outdated = true;
    let camera_arc_culling = initial_camera_arc_culling;

    function uploadBalls(balls) {
        updateMetaballBalls(mesh, balls, camera_arc_culling ? last_camera : null);
        is_field_texture_outdated = true;
    }

    uploadBalls(animation.getActiveBalls());

    let displacement_enabled = DEFAULT_SETTINGS.displacementEnabled;
    let displacement_strength = DEFAULT_SETTINGS.displacementStrength;

    function update(time, camera, volcano_position) {
        last_camera = camera;
        const balls = animation.stepMetaballAnimation(time);
        if (balls) uploadBalls(balls);
        updateMetaballLight(material, camera, time);
        updateMetaballDisplacement(material, { enabled: displacement_enabled, strength: displacement_strength, camera, volcano_position });
    }

    return {
        mesh,
        update,

        fastForward(duration, step, camera, volcano_position, from_duration = 0) {
            const first_step = from_duration > 0 ? Math.floor(from_duration / step) + 1 : 0;
            const last_step = Math.floor(duration / step);
            for (let i = first_step; i <= last_step; i++) update(i * step, camera, volcano_position);
        },

        renderFieldTexture(renderer) {
            if (!is_field_texture_outdated) return;
            field_texture.render(renderer, material.uniforms);
            is_field_texture_outdated = false;
        },

        setAnimation(next_animation) {
            animation = next_animation;
            uploadBalls(animation.getActiveBalls());
        },

        setCameraArcCulling(value) {
            camera_arc_culling = value;
            uploadBalls(animation.getActiveBalls());
        },

        isPaused: () => animation.settings.paused,
        setPaused: value => { animation.settings.paused = value; },
        getEruptionIntensity: time => animation.getEruptionIntensity(time),
        getSpawnCount: () => animation.getSpawnCount(),
        getWaveStartCount: () => animation.getWaveStartCount(),
        getActiveWorldPositions: () => animation.getActiveBalls().map(ball => ({
            ...ballToWorldPosition(ball, mesh),
            radius: ballToWorldRadius(ball, mesh),
            subtract: ball.subtract,
            isolation: mesh.isolation,
        })),
        squeezeNearestBall({ x, y, z, shrink_increment }) {
            let nearest_ball = null;
            let nearest_distance = Infinity;
            for (const ball of animation.getActiveBalls()) {
                const ball_distance = distance(ballToWorldPosition(ball, mesh), { x, y, z });
                if (ball_distance < nearest_distance) {
                    nearest_distance = ball_distance;
                    nearest_ball = ball;
                }
            }
            if (!nearest_ball) return;
            nearest_ball.shrink_fraction = Math.min(1, nearest_ball.shrink_fraction + shrink_increment);
            const scale = Math.max(1 - nearest_ball.shrink_fraction, 0);
            nearest_ball.strength = nearest_ball.base_strength * scale * scale;
            if (scale <= 0) nearest_ball.active = false;
        },

        getCount: () => animation.settings.count,
        setCount: value => { animation.settings.count = value; uploadBalls(animation.getActiveBalls()); },
        getMaxCount: () => Math.min(animation.settings.max_count, METABALL_GPU_MAX_BALLS),
        getIsolation: () => mesh.isolation,
        setIsolation: value => { mesh.isolation = value; uploadBalls(animation.getActiveBalls()); },
        getRadius: () => mesh.radius_scale,
        setRadius: value => { mesh.radius_scale = value; uploadBalls(animation.getActiveBalls()); },
        getSpread: () => animation.settings.spread,
        setSpread: value => { animation.settings.spread = value; },
        getSpeed: () => animation.settings.speed_factor,
        setSpeed: value => { animation.settings.speed_factor = value; },
        getSinkSpeed: () => animation.settings.sink_speed,
        setSinkSpeed: value => { animation.settings.sink_speed = value; },
        getDisappearY: () => animation.settings.disappear_y,
        setDisappearY: value => { animation.settings.disappear_y = value; },
        getFlowRadius: () => animation.settings.flow_z_radius,
        setFlowRadius: value => { animation.settings.flow_z_radius = value; },

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
