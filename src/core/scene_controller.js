import * as THREE from 'three';
import { createMetaballGeometry, rebuildMetaballGeometry } from './geometry/metaball_geometry.js';
import { settings, getActiveBalls, stepMetaballAnimation } from './animation/metaball_animation.js';
import { createMetaballMaterial, updateMetaballLight } from './rendering/metaball_material.js';
import { createVolcanoGeometry } from './geometry/volcano_geometry.js';
import { createVolcanoMaterial, updateVolcanoLight } from './rendering/volcano_material.js';
import default_settings from './default_settings.json';

const toHexColor = color => '#' + color.getHexString();

export function createSceneController({ scene, camera, bloomPass }) {
    const material = createMetaballMaterial();
    const effect = createMetaballGeometry(scene, material);
    rebuildMetaballGeometry(effect, getActiveBalls());
    effect.position.y = 0.36;

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({
            color: 0x220500,
            emissive: 0x2b0800,
            roughness: 0.88,
            metalness: 0.05,
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6;
    scene.add(ground);

    const volcano_material = createVolcanoMaterial();
    const volcano = createVolcanoGeometry(scene, volcano_material);
    volcano.position.y = ground.position.y;

    const effect_offset = effect.position.y - volcano.position.y;
    const position = { x: 0, y: 0, z: 0 };
    let metaball_y_offset = 1.6;
    let displacement_enabled = true;
    let displacement_last = material.uniforms.u_displacement.value;

    function applyY(ground_y) {
        ground.position.y = ground_y;
        volcano.position.y = ground_y + position.y;
        effect.position.y = ground_y + position.y + effect_offset + metaball_y_offset;
    }

    const controller = {
        update(time) {
            const balls = stepMetaballAnimation(time);
            if (balls) rebuildMetaballGeometry(effect, balls);
            updateMetaballLight(material, camera, time);
            updateVolcanoLight(volcano_material, camera);
        },

        isPaused: () => settings.paused,
        setPaused: value => { settings.paused = value; },

        getMetaballCount: () => settings.count,
        setMetaballCount: value => { settings.count = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getMaxMetaballCount: () => settings.max_count,
        getMetaballIsolation: () => effect.isolation,
        setMetaballIsolation: value => { effect.isolation = value; rebuildMetaballGeometry(effect, getActiveBalls()); },
        getMetaballSpread: () => settings.spread,
        setMetaballSpread: value => { settings.spread = value; },
        getMetaballSpeed: () => settings.speed_factor,
        setMetaballSpeed: value => { settings.speed_factor = value; },
        getMetaballHeight: () => metaball_y_offset,
        setMetaballHeight: value => { metaball_y_offset = value; applyY(ground.position.y); },
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

        getGroundVisible: () => ground.visible,
        setGroundVisible: value => { ground.visible = value; },
        getGroundColor: () => toHexColor(ground.material.color),
        setGroundColor: value => {
            ground.material.color.set(value);
            ground.material.emissive.set(value).multiplyScalar(0.25);
        },
        getGroundHeight: () => ground.position.y,
        setGroundHeight: value => applyY(value),

        getVolcanoVisible: () => volcano.visible,
        setVolcanoVisible: value => { volcano.visible = value; },
        getVolcanoRockColor: () => toHexColor(volcano_material.uniforms.u_rock_color.value),
        setVolcanoRockColor: value => volcano_material.uniforms.u_rock_color.value.set(value),
        getVolcanoCrackColor: () => toHexColor(volcano_material.uniforms.u_crack_color.value),
        setVolcanoCrackColor: value => volcano_material.uniforms.u_crack_color.value.set(value),
        getVolcanoDisplacementScale: () => volcano_material.uniforms.u_disp_scale.value,
        setVolcanoDisplacementScale: value => { volcano_material.uniforms.u_disp_scale.value = value; },
        getVolcanoDisplacementFrequency: () => volcano_material.uniforms.u_disp_freq.value,
        setVolcanoDisplacementFrequency: value => { volcano_material.uniforms.u_disp_freq.value = value; },

        getOffsetX: () => position.x,
        setOffsetX: value => { position.x = value; volcano.position.x = value; effect.position.x = value; },
        getOffsetY: () => position.y,
        setOffsetY: value => { position.y = value; applyY(ground.position.y); },
        getOffsetZ: () => position.z,
        setOffsetZ: value => { position.z = value; volcano.position.z = value; effect.position.z = value; },

        getBloom: () => ({
            enabled: bloomPass.enabled,
            strength: bloomPass.strength,
            radius: bloomPass.radius,
            threshold: bloomPass.threshold,
        }),
        setBloom: partial => Object.assign(bloomPass, partial),

        getSnapshot,
        applySnapshot,
        resetToDefaults: () => applySnapshot(default_settings),
    };

    function getSnapshot() {
        const bloom = controller.getBloom();
        return {
            paused: controller.isPaused(),
            metaballCount: controller.getMetaballCount(),
            metaballIsolation: controller.getMetaballIsolation(),
            metaballSpread: controller.getMetaballSpread(),
            metaballSpeed: controller.getMetaballSpeed(),
            metaballHeight: controller.getMetaballHeight(),
            flowRadius: controller.getFlowRadius(),
            colorHot: controller.getColorHot(),
            colorCool: controller.getColorCool(),
            glowEnabled: controller.getGlowEnabled(),
            glowColor: controller.getGlowColor(),
            noiseEnabled: controller.getNoiseEnabled(),
            noiseColor1: controller.getNoiseColor1(),
            noiseColor2: controller.getNoiseColor2(),
            bumpEnabled: controller.getBumpEnabled(),
            displacementEnabled: controller.getDisplacementEnabled(),
            displacementStrength: controller.getDisplacementStrength(),
            groundVisible: controller.getGroundVisible(),
            groundColor: controller.getGroundColor(),
            groundHeight: controller.getGroundHeight(),
            volcanoVisible: controller.getVolcanoVisible(),
            volcanoDisplacementScale: controller.getVolcanoDisplacementScale(),
            volcanoDisplacementFrequency: controller.getVolcanoDisplacementFrequency(),
            volcanoRockColor: controller.getVolcanoRockColor(),
            volcanoCrackColor: controller.getVolcanoCrackColor(),
            offsetX: controller.getOffsetX(),
            offsetY: controller.getOffsetY(),
            offsetZ: controller.getOffsetZ(),
            bloomEnabled: bloom.enabled,
            bloomStrength: bloom.strength,
            bloomRadius: bloom.radius,
            bloomThreshold: bloom.threshold,
        };
    }

    const SETTERS = {
        paused: controller.setPaused,
        metaballCount: controller.setMetaballCount,
        metaballIsolation: controller.setMetaballIsolation,
        metaballSpread: controller.setMetaballSpread,
        metaballSpeed: controller.setMetaballSpeed,
        metaballHeight: controller.setMetaballHeight,
        flowRadius: controller.setFlowRadius,
        colorHot: controller.setColorHot,
        colorCool: controller.setColorCool,
        glowEnabled: controller.setGlowEnabled,
        glowColor: controller.setGlowColor,
        noiseEnabled: controller.setNoiseEnabled,
        noiseColor1: controller.setNoiseColor1,
        noiseColor2: controller.setNoiseColor2,
        bumpEnabled: controller.setBumpEnabled,
        displacementEnabled: controller.setDisplacementEnabled,
        displacementStrength: controller.setDisplacementStrength,
        groundVisible: controller.setGroundVisible,
        groundColor: controller.setGroundColor,
        groundHeight: controller.setGroundHeight,
        volcanoVisible: controller.setVolcanoVisible,
        volcanoDisplacementScale: controller.setVolcanoDisplacementScale,
        volcanoDisplacementFrequency: controller.setVolcanoDisplacementFrequency,
        volcanoRockColor: controller.setVolcanoRockColor,
        volcanoCrackColor: controller.setVolcanoCrackColor,
        offsetX: controller.setOffsetX,
        offsetY: controller.setOffsetY,
        offsetZ: controller.setOffsetZ,
        bloomEnabled: value => controller.setBloom({ enabled: value }),
        bloomStrength: value => controller.setBloom({ strength: value }),
        bloomRadius: value => controller.setBloom({ radius: value }),
        bloomThreshold: value => controller.setBloom({ threshold: value }),
    };

    function applySnapshot(data) {
        for (const [key, value] of Object.entries(data)) {
            if (SETTERS[key]) SETTERS[key](value);
        }
    }

    applyY(ground.position.y);

    return controller;
}
