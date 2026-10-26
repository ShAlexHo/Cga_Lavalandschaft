import * as THREE from 'three';
import { createMetaballMaterial, updateMetaballBalls, updateMetaballLight } from '../main-scene/rendering/metaball_material.js';
import { toHexColor } from '../main-scene/rendering/color_utils.js';
import MAIN_SCENE_DEFAULTS from '../main-scene/default_settings.json';
import { computeBalls } from './metaballs_animation.js';
import { createGroundPlate } from './ground_plate.js';
import {
    EFFECT_SCALE, BOX_HALF_EXTENT, BOX_MARGIN, MAX_BALL_COUNT, DEFAULTS, SURFACE_DEFAULTS, GROUND_DEFAULTS, GROUND_PATH_SPEED_SCALE,
} from './config.js';

export function createMetaballsController(scene, { noise = false, surface = false, ground = false, bloom_pass = null } = {}) {
    const material = createMetaballMaterial({ max_balls: MAX_BALL_COUNT });

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const unit_box_positions = geometry.attributes.position.array.slice();
    const effect = new THREE.Mesh(geometry, material);
    effect.scale.setScalar(EFFECT_SCALE);
    effect.frustumCulled = false;
    scene.add(effect);

    const uniforms = material.uniforms;
    const box_center = uniforms.u_box_center.value;
    const box_half_extent = uniforms.u_box_half_extent.value;
    const box_minimum = new THREE.Vector3();
    const box_maximum = new THREE.Vector3();

    function fitBoxToBalls(balls) {
        box_minimum.setScalar(Infinity);
        box_maximum.setScalar(-Infinity);
        for (const ball of balls) {
            if (ball.subtract <= 0) {
                box_minimum.setScalar(-BOX_HALF_EXTENT);
                box_maximum.setScalar(BOX_HALF_EXTENT);
                break;
            }
            const reach = 2 * effect.radius_scale * Math.sqrt(ball.strength / ball.subtract) + uniforms.u_displacement.value + BOX_MARGIN;
            box_minimum.min({ x: 2 * ball.x - 1 - reach, y: 2 * ball.y - 1 - reach, z: 2 * ball.z - 1 - reach });
            box_maximum.max({ x: 2 * ball.x - 1 + reach, y: 2 * ball.y - 1 + reach, z: 2 * ball.z - 1 + reach });
        }
        box_center.addVectors(box_minimum, box_maximum).multiplyScalar(0.5);
        box_half_extent.subVectors(box_maximum, box_minimum).multiplyScalar(0.5);

        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = box_center.x + unit_box_positions[i] * box_half_extent.x;
            positions[i + 1] = box_center.y + unit_box_positions[i + 1] * box_half_extent.y;
            positions[i + 2] = box_center.z + unit_box_positions[i + 2] * box_half_extent.z;
        }
        geometry.attributes.position.needsUpdate = true;
    }

    const settings = {};
    let elapsed_time = 0;

    function colorUniform(name) {
        return { get: () => toHexColor(uniforms[name].value), set: value => uniforms[name].value.set(value) };
    }

    function flagUniform(name) {
        return { get: () => uniforms[name].value === 1.0, set: value => { uniforms[name].value = value ? 1.0 : 0.0; } };
    }

    const color_hot = colorUniform('u_color_hot');
    const color_cool = colorUniform('u_color_cool');
    const glow_color = colorUniform('u_glow_color');
    const glow_enabled = flagUniform('u_glow_enabled');
    const noise_color_1 = colorUniform('u_noise_color_1');
    const noise_color_2 = colorUniform('u_noise_color_2');
    const noise_enabled = flagUniform('u_noise_enabled');
    const bump_enabled = flagUniform('u_bump_enabled');

    function applyDisplacement() {
        uniforms.u_displacement.value = settings.displacement_enabled ? settings.displacement_strength : 0.0;
    }

    const ground_plate = ground ? createGroundPlate(scene) : null;
    const path_speed_scale = ground ? GROUND_PATH_SPEED_SCALE : 1;

    const controller = {
        effect,

        update(delta_seconds, camera) {
            if (!settings.paused) elapsed_time += delta_seconds * settings.speed;
            const balls = computeBalls(elapsed_time * path_speed_scale, settings, { planar: ground });
            updateMetaballBalls(effect, balls);
            fitBoxToBalls(balls);
            updateMetaballLight(material, camera, elapsed_time);
        },
        getElapsedTime: () => elapsed_time,
        setElapsedTime: value => { elapsed_time = value; },

        isPaused: () => settings.paused,
        setPaused: value => { settings.paused = value; },
        getSpeed: () => settings.speed,
        setSpeed: value => { settings.speed = value; },

        getCount: () => settings.count,
        setCount: value => { settings.count = value; },
        getIsolation: () => effect.isolation,
        setIsolation: value => { effect.isolation = value; },
        getRadius: () => effect.radius_scale,
        setRadius: value => { effect.radius_scale = value; },
        getSubtractScale: () => settings.subtract_scale,
        setSubtractScale: value => { settings.subtract_scale = value; },
        getSpread: () => settings.spread,
        setSpread: value => { settings.spread = value; },
        getRaymarchSteps: () => uniforms.u_raymarch_steps.value,
        setRaymarchSteps: value => { uniforms.u_raymarch_steps.value = value; },

        getColorHot: color_hot.get,
        setColorHot: color_hot.set,
        getColorCool: color_cool.get,
        setColorCool: color_cool.set,
        getGlowEnabled: glow_enabled.get,
        setGlowEnabled: glow_enabled.set,
        getGlowColor: glow_color.get,
        setGlowColor: glow_color.set,

        getSnapshot: () => Object.fromEntries(Object.entries(setting_accessors).map(([key, [get]]) => [key, get()])),

        applySnapshot(snapshot) {
            for (const [key, value] of Object.entries(snapshot)) setting_accessors[key]?.[1](value);
        },

        resetToDefaults() {
            Object.assign(settings, DEFAULTS);
            effect.isolation = MAIN_SCENE_DEFAULTS.metaballIsolation;
            effect.radius_scale = MAIN_SCENE_DEFAULTS.metaballRadius;
            uniforms.u_raymarch_steps.value = DEFAULTS.raymarch_steps;
            color_hot.set(MAIN_SCENE_DEFAULTS.colorHot);
            color_cool.set(MAIN_SCENE_DEFAULTS.colorCool);
            glow_enabled.set(MAIN_SCENE_DEFAULTS.glowEnabled);
            glow_color.set(MAIN_SCENE_DEFAULTS.glowColor);

            noise_enabled.set(noise && MAIN_SCENE_DEFAULTS.noiseEnabled);
            noise_color_1.set(MAIN_SCENE_DEFAULTS.noiseColor1);
            noise_color_2.set(MAIN_SCENE_DEFAULTS.noiseColor2);

            bump_enabled.set(surface && SURFACE_DEFAULTS.bump_enabled);
            settings.displacement_enabled = surface && SURFACE_DEFAULTS.displacement_enabled;
            settings.displacement_strength = SURFACE_DEFAULTS.displacement_strength;
            applyDisplacement();

            if (bloom_pass) controller.setBloomEnabled(MAIN_SCENE_DEFAULTS.bloomEnabled);
            if (ground) settings.count = GROUND_DEFAULTS.count;
            ground_plate?.setVisible(GROUND_DEFAULTS.ground_visible);
            ground_plate?.setHeight(GROUND_DEFAULTS.ground_height);
        },
    };

    const setting_accessors = {
        paused: [controller.isPaused, controller.setPaused],
        speed: [controller.getSpeed, controller.setSpeed],
        count: [controller.getCount, controller.setCount],
        isolation: [controller.getIsolation, controller.setIsolation],
        radius: [controller.getRadius, controller.setRadius],
        subtract_scale: [controller.getSubtractScale, controller.setSubtractScale],
        spread: [controller.getSpread, controller.setSpread],
        raymarch_steps: [controller.getRaymarchSteps, controller.setRaymarchSteps],
        color_hot: [controller.getColorHot, controller.setColorHot],
        color_cool: [controller.getColorCool, controller.setColorCool],
        glow_enabled: [controller.getGlowEnabled, controller.setGlowEnabled],
        glow_color: [controller.getGlowColor, controller.setGlowColor],
    };

    if (noise) {
        Object.assign(controller, {
            getNoiseEnabled: noise_enabled.get,
            setNoiseEnabled: noise_enabled.set,
            getNoiseColor1: noise_color_1.get,
            setNoiseColor1: noise_color_1.set,
            getNoiseColor2: noise_color_2.get,
            setNoiseColor2: noise_color_2.set,
        });
        Object.assign(setting_accessors, {
            noise_enabled: [controller.getNoiseEnabled, controller.setNoiseEnabled],
            noise_color_1: [controller.getNoiseColor1, controller.setNoiseColor1],
            noise_color_2: [controller.getNoiseColor2, controller.setNoiseColor2],
        });
    }

    if (surface) {
        Object.assign(controller, {
            getBumpEnabled: bump_enabled.get,
            setBumpEnabled: bump_enabled.set,
            getDisplacementEnabled: () => settings.displacement_enabled,
            setDisplacementEnabled(value) {
                settings.displacement_enabled = value;
                applyDisplacement();
            },
            getDisplacementStrength: () => settings.displacement_strength,
            setDisplacementStrength(value) {
                settings.displacement_strength = value;
                applyDisplacement();
            },
        });
        Object.assign(setting_accessors, {
            bump_enabled: [controller.getBumpEnabled, controller.setBumpEnabled],
            displacement_enabled: [controller.getDisplacementEnabled, controller.setDisplacementEnabled],
            displacement_strength: [controller.getDisplacementStrength, controller.setDisplacementStrength],
        });
    }

    if (bloom_pass) {
        Object.assign(controller, {
            getBloomEnabled: () => bloom_pass.strength > 0,
            setBloomEnabled: value => { bloom_pass.strength = value ? MAIN_SCENE_DEFAULTS.bloomStrength : 0; },
        });
        setting_accessors.bloom_enabled = [controller.getBloomEnabled, controller.setBloomEnabled];
    }

    if (ground) {
        Object.assign(controller, {
            getGroundVisible: ground_plate.getVisible,
            setGroundVisible: ground_plate.setVisible,
            getGroundHeight: ground_plate.getHeight,
            setGroundHeight: ground_plate.setHeight,
        });
        Object.assign(setting_accessors, {
            ground_visible: [controller.getGroundVisible, controller.setGroundVisible],
            ground_height: [controller.getGroundHeight, controller.setGroundHeight],
        });
    }

    controller.resetToDefaults();
    return controller;
}
