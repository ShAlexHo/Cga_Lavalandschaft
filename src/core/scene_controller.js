import * as THREE from 'three';
import { create_metaballs, rebuild_field, update_metaballs, update_light, settings } from './metaballs.js';
import { create_volcano, update_volcano_light } from './volcano.js';
import default_settings from './default_settings.json';

const hex = color => '#' + color.getHexString();

export function createSceneController({ scene, camera, bloomPass }) {
    const { effect, material } = create_metaballs(scene);
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

    const { mesh: volcano, material: volcano_material } = create_volcano(scene);
    volcano.position.y = ground.position.y;

    const effect_offset = effect.position.y - volcano.position.y;
    const pos = { x: 0, y: 0, z: 0 };
    let metaball_y_off = 1.6;
    let displacement_enabled = true;
    let displacement_last = material.uniforms.u_displacement.value;

    function apply_y(ground_y) {
        ground.position.y = ground_y;
        volcano.position.y = ground_y + pos.y;
        effect.position.y = ground_y + pos.y + effect_offset + metaball_y_off;
    }

    const controller = {
        update(time) {
            update_metaballs(effect, time);
            update_light(material, camera, time);
            update_volcano_light(volcano_material, camera);
        },

        isPaused: () => settings.paused,
        setPaused: v => { settings.paused = v; },

        getMetaballCount: () => settings.count,
        setMetaballCount: v => { settings.count = v; rebuild_field(effect); },
        getMaxMetaballCount: () => settings.max_count,
        getMetaballIsolation: () => effect.isolation,
        setMetaballIsolation: v => { effect.isolation = v; rebuild_field(effect); },
        getMetaballSpread: () => settings.spread,
        setMetaballSpread: v => { settings.spread = v; },
        getMetaballSpeed: () => settings.speed_factor,
        setMetaballSpeed: v => { settings.speed_factor = v; },
        getMetaballHeight: () => metaball_y_off,
        setMetaballHeight: v => { metaball_y_off = v; apply_y(ground.position.y); },
        getFlowRadius: () => settings.flow_z_radius,
        setFlowRadius: v => { settings.flow_z_radius = v; },

        getColorHot: () => hex(material.uniforms.u_color_hot.value),
        setColorHot: v => material.uniforms.u_color_hot.value.set(v),
        getColorCool: () => hex(material.uniforms.u_color_cool.value),
        setColorCool: v => material.uniforms.u_color_cool.value.set(v),
        getGlowEnabled: () => material.uniforms.u_glow_enabled.value === 1.0,
        setGlowEnabled: v => { material.uniforms.u_glow_enabled.value = v ? 1.0 : 0.0; },
        getGlowColor: () => hex(material.uniforms.u_glow_color.value),
        setGlowColor: v => material.uniforms.u_glow_color.value.set(v),

        getNoiseEnabled: () => material.uniforms.u_noise_enabled.value === 1.0,
        setNoiseEnabled: v => { material.uniforms.u_noise_enabled.value = v ? 1.0 : 0.0; },
        getNoiseColor1: () => hex(material.uniforms.u_noise_color_1.value),
        setNoiseColor1: v => material.uniforms.u_noise_color_1.value.set(v),
        getNoiseColor2: () => hex(material.uniforms.u_noise_color_2.value),
        setNoiseColor2: v => material.uniforms.u_noise_color_2.value.set(v),
        getBumpEnabled: () => material.uniforms.u_bump_enabled.value === 1.0,
        setBumpEnabled: v => { material.uniforms.u_bump_enabled.value = v ? 1.0 : 0.0; },
        getDisplacementEnabled: () => displacement_enabled,
        setDisplacementEnabled: v => {
            displacement_enabled = v;
            if (v) {
                material.uniforms.u_displacement.value = displacement_last;
            } else {
                displacement_last = material.uniforms.u_displacement.value;
                material.uniforms.u_displacement.value = 0.0;
            }
        },
        getDisplacementStrength: () => material.uniforms.u_displacement.value,
        setDisplacementStrength: v => { material.uniforms.u_displacement.value = v; },

        getGroundVisible: () => ground.visible,
        setGroundVisible: v => { ground.visible = v; },
        getGroundColor: () => hex(ground.material.color),
        setGroundColor: v => {
            ground.material.color.set(v);
            ground.material.emissive.set(v).multiplyScalar(0.25);
        },
        getGroundHeight: () => ground.position.y,
        setGroundHeight: v => apply_y(v),

        getVolcanoVisible: () => volcano.visible,
        setVolcanoVisible: v => { volcano.visible = v; },
        getVolcanoRockColor: () => hex(volcano_material.uniforms.u_rock_color.value),
        setVolcanoRockColor: v => volcano_material.uniforms.u_rock_color.value.set(v),
        getVolcanoCrackColor: () => hex(volcano_material.uniforms.u_crack_color.value),
        setVolcanoCrackColor: v => volcano_material.uniforms.u_crack_color.value.set(v),
        getVolcanoDispScale: () => volcano_material.uniforms.u_disp_scale.value,
        setVolcanoDispScale: v => { volcano_material.uniforms.u_disp_scale.value = v; },
        getVolcanoDispFreq: () => volcano_material.uniforms.u_disp_freq.value,
        setVolcanoDispFreq: v => { volcano_material.uniforms.u_disp_freq.value = v; },

        getOffsetX: () => pos.x,
        setOffsetX: v => { pos.x = v; volcano.position.x = v; effect.position.x = v; },
        getOffsetY: () => pos.y,
        setOffsetY: v => { pos.y = v; apply_y(ground.position.y); },
        getOffsetZ: () => pos.z,
        setOffsetZ: v => { pos.z = v; volcano.position.z = v; effect.position.z = v; },

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
            volcanoDispScale: controller.getVolcanoDispScale(),
            volcanoDispFreq: controller.getVolcanoDispFreq(),
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
        volcanoDispScale: controller.setVolcanoDispScale,
        volcanoDispFreq: controller.setVolcanoDispFreq,
        volcanoRockColor: controller.setVolcanoRockColor,
        volcanoCrackColor: controller.setVolcanoCrackColor,
        offsetX: controller.setOffsetX,
        offsetY: controller.setOffsetY,
        offsetZ: controller.setOffsetZ,
        bloomEnabled: v => controller.setBloom({ enabled: v }),
        bloomStrength: v => controller.setBloom({ strength: v }),
        bloomRadius: v => controller.setBloom({ radius: v }),
        bloomThreshold: v => controller.setBloom({ threshold: v }),
    };

    function applySnapshot(data) {
        for (const [key, value] of Object.entries(data)) {
            if (SETTERS[key]) SETTERS[key](value);
        }
    }

    apply_y(ground.position.y);

    return controller;
}
