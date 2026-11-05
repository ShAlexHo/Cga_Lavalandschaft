import * as THREE from 'three';
import { createSettingSnapshots } from '../../setting_snapshots.js';
import { createMetaballMaterial, updateMetaballBalls, updateMetaballLight } from '../../main-scene/rendering/metaball_material.js';
import { toHexColor } from '../../main-scene/rendering/color_utils.js';
import MAIN_SCENE_DEFAULTS from '../../main-scene/default_settings.json';
import { computeBalls } from './metaballs_animation.js';
import { MESH_SCALE, BOX_HALF_EXTENT, BOX_MARGIN, MAX_BALL_COUNT, METABALLS_DEFAULTS, SURFACE_DEFAULTS } from './config.js';

export function createFloatingScenery(scene, settings) {
    return {
        computeBalls: elapsed_time => computeBalls(elapsed_time, settings),
        resetToDefaults() {},
        methods: {},
        setting_accessors: {},
    };
}

const DEFAULT_SCENERIES = { floating: createFloatingScenery };

export function createMetaballsController(scene, { sceneries = DEFAULT_SCENERIES, mode = {}, bloom_pass = null } = {}) {
    const material = createMetaballMaterial({ max_balls: MAX_BALL_COUNT });

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const unit_box_positions = geometry.attributes.position.array.slice();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(MESH_SCALE);
    mesh.frustumCulled = false;
    scene.add(mesh);

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
            const reach = 2 * mesh.radius_scale * Math.sqrt(ball.strength / ball.subtract) + uniforms.u_displacement.value + BOX_MARGIN;
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

    const scenery_by_name = Object.fromEntries(Object.entries(sceneries).map(([name, createScenery]) => [name, createScenery(scene, settings)]));
    const default_scenery_name = Object.keys(scenery_by_name)[0];
    let active_mode = null;
    let scenery = null;

    const controller = {
        mesh,

        applyMode(mode) {
            active_mode = { with_noise: false, with_surface: false, scenery: default_scenery_name, ...mode };
            for (const [name, other_scenery] of Object.entries(scenery_by_name)) {
                if (name !== active_mode.scenery) other_scenery.deactivate?.();
            }
            scenery = scenery_by_name[active_mode.scenery];
            scenery.activate?.(active_mode);
            collectSettingAccessors();
        },

        update(delta_seconds, camera) {
            if (!settings.paused) elapsed_time += delta_seconds * settings.speed;
            const balls = scenery.computeBalls(elapsed_time);
            updateMetaballBalls(mesh, balls);
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
        getIsolation: () => mesh.isolation,
        setIsolation: value => { mesh.isolation = value; },
        getRadius: () => mesh.radius_scale,
        setRadius: value => { mesh.radius_scale = value; },
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

        resetToDefaults() {
            Object.assign(settings, METABALLS_DEFAULTS);
            mesh.isolation = MAIN_SCENE_DEFAULTS.metaballIsolation;
            mesh.radius_scale = MAIN_SCENE_DEFAULTS.metaballRadius;
            uniforms.u_raymarch_steps.value = METABALLS_DEFAULTS.raymarch_steps;
            color_hot.set(MAIN_SCENE_DEFAULTS.colorHot);
            color_cool.set(MAIN_SCENE_DEFAULTS.colorCool);
            glow_enabled.set(MAIN_SCENE_DEFAULTS.glowEnabled);
            glow_color.set(MAIN_SCENE_DEFAULTS.glowColor);

            noise_enabled.set(active_mode.with_noise && MAIN_SCENE_DEFAULTS.noiseEnabled);
            noise_color_1.set(MAIN_SCENE_DEFAULTS.noiseColor1);
            noise_color_2.set(MAIN_SCENE_DEFAULTS.noiseColor2);

            bump_enabled.set(active_mode.with_surface && SURFACE_DEFAULTS.bump_enabled);
            settings.displacement_enabled = active_mode.with_surface && SURFACE_DEFAULTS.displacement_enabled;
            settings.displacement_strength = SURFACE_DEFAULTS.displacement_strength;
            applyDisplacement();

            if (bloom_pass) controller.setBloomEnabled(MAIN_SCENE_DEFAULTS.bloomEnabled);
            scenery.resetToDefaults(controller);
        },
    };

    const base_accessors = {
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

    Object.assign(controller, {
        getNoiseEnabled: noise_enabled.get,
        setNoiseEnabled: noise_enabled.set,
        getNoiseColor1: noise_color_1.get,
        setNoiseColor1: noise_color_1.set,
        getNoiseColor2: noise_color_2.get,
        setNoiseColor2: noise_color_2.set,
    });
    const noise_accessors = {
        noise_enabled: [controller.getNoiseEnabled, controller.setNoiseEnabled],
        noise_color_1: [controller.getNoiseColor1, controller.setNoiseColor1],
        noise_color_2: [controller.getNoiseColor2, controller.setNoiseColor2],
    };

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
    const surface_accessors = {
        bump_enabled: [controller.getBumpEnabled, controller.setBumpEnabled],
        displacement_enabled: [controller.getDisplacementEnabled, controller.setDisplacementEnabled],
        displacement_strength: [controller.getDisplacementStrength, controller.setDisplacementStrength],
    };

    const bloom_accessors = {};
    if (bloom_pass) {
        Object.assign(controller, {
            getBloomEnabled: () => bloom_pass.strength > 0,
            setBloomEnabled: value => { bloom_pass.strength = value ? MAIN_SCENE_DEFAULTS.bloomStrength : 0; },
        });
        bloom_accessors.bloom_enabled = [controller.getBloomEnabled, controller.setBloomEnabled];
    }

    for (const each_scenery of Object.values(scenery_by_name)) Object.assign(controller, each_scenery.methods);

    const setting_accessors = {};
    Object.assign(controller, createSettingSnapshots(setting_accessors));

    function collectSettingAccessors() {
        for (const key of Object.keys(setting_accessors)) delete setting_accessors[key];
        Object.assign(
            setting_accessors,
            base_accessors,
            active_mode.with_noise ? noise_accessors : {},
            active_mode.with_surface ? surface_accessors : {},
            bloom_accessors,
            scenery.setting_accessors,
        );
    }

    controller.applyMode(mode);
    controller.resetToDefaults();
    return controller;
}
