import { createGround } from './objects/ground_object.js';
import { createVolcano } from './objects/volcano_object.js';
import { createMetaballField } from './objects/metaball_field_object.js';
import { createSmoke } from './objects/smoke_object.js';
import { SMOKE_SPAWN_HEIGHT } from './config.js';
import default_settings from './default_settings.json';

export function createSceneController({ scene, camera, bloomPass }) {
    const ground = createGround(scene);
    const volcano = createVolcano(scene);
    const metaball_field = createMetaballField(scene);
    const smoke = createSmoke(scene);

    metaball_field.effect.position.y = 0.36;
    volcano.mesh.position.y = ground.mesh.position.y;

    const effect_offset = metaball_field.effect.position.y - volcano.mesh.position.y;
    const position = { x: 0, y: 0, z: 0 };
    let metaball_y_offset = 1.6;

    function applyY(ground_y) {
        ground.mesh.position.y = ground_y;
        volcano.mesh.position.y = ground_y + position.y;
        metaball_field.effect.position.y = ground_y + position.y + effect_offset + metaball_y_offset;
        smoke.effect.position.y = ground_y + position.y + SMOKE_SPAWN_HEIGHT;
    }

    const controller = {
        update(time) {
            metaball_field.update(time, camera);
            volcano.update(camera);
            smoke.update(time, metaball_field.getEruptionIntensity(time));
        },

        isPaused: () => metaball_field.isPaused(),
        setPaused: value => metaball_field.setPaused(value),

        getMetaballCount: () => metaball_field.getCount(),
        setMetaballCount: value => metaball_field.setCount(value),
        getMaxMetaballCount: () => metaball_field.getMaxCount(),
        getMetaballIsolation: () => metaball_field.getIsolation(),
        setMetaballIsolation: value => metaball_field.setIsolation(value),
        getMetaballSpread: () => metaball_field.getSpread(),
        setMetaballSpread: value => metaball_field.setSpread(value),
        getMetaballSpeed: () => metaball_field.getSpeed(),
        setMetaballSpeed: value => metaball_field.setSpeed(value),
        getMetaballHeight: () => metaball_y_offset,
        setMetaballHeight: value => { metaball_y_offset = value; applyY(ground.mesh.position.y); },
        getFlowRadius: () => metaball_field.getFlowRadius(),
        setFlowRadius: value => metaball_field.setFlowRadius(value),

        getColorHot: () => metaball_field.getColorHot(),
        setColorHot: value => metaball_field.setColorHot(value),
        getColorCool: () => metaball_field.getColorCool(),
        setColorCool: value => metaball_field.setColorCool(value),
        getGlowEnabled: () => metaball_field.getGlowEnabled(),
        setGlowEnabled: value => metaball_field.setGlowEnabled(value),
        getGlowColor: () => metaball_field.getGlowColor(),
        setGlowColor: value => metaball_field.setGlowColor(value),

        getNoiseEnabled: () => metaball_field.getNoiseEnabled(),
        setNoiseEnabled: value => metaball_field.setNoiseEnabled(value),
        getNoiseColor1: () => metaball_field.getNoiseColor1(),
        setNoiseColor1: value => metaball_field.setNoiseColor1(value),
        getNoiseColor2: () => metaball_field.getNoiseColor2(),
        setNoiseColor2: value => metaball_field.setNoiseColor2(value),
        getBumpEnabled: () => metaball_field.getBumpEnabled(),
        setBumpEnabled: value => metaball_field.setBumpEnabled(value),
        getDisplacementEnabled: () => metaball_field.getDisplacementEnabled(),
        setDisplacementEnabled: value => metaball_field.setDisplacementEnabled(value),
        getDisplacementStrength: () => metaball_field.getDisplacementStrength(),
        setDisplacementStrength: value => metaball_field.setDisplacementStrength(value),

        getGroundVisible: () => ground.getVisible(),
        setGroundVisible: value => ground.setVisible(value),
        getGroundColor: () => ground.getColor(),
        setGroundColor: value => ground.setColor(value),
        getGroundHeight: () => ground.mesh.position.y,
        setGroundHeight: value => applyY(value),

        getVolcanoVisible: () => volcano.getVisible(),
        setVolcanoVisible: value => volcano.setVisible(value),
        getVolcanoRockColor: () => volcano.getRockColor(),
        setVolcanoRockColor: value => volcano.setRockColor(value),
        getVolcanoCrackColor: () => volcano.getCrackColor(),
        setVolcanoCrackColor: value => volcano.setCrackColor(value),
        getVolcanoDisplacementScale: () => volcano.getDisplacementScale(),
        setVolcanoDisplacementScale: value => volcano.setDisplacementScale(value),
        getVolcanoDisplacementFrequency: () => volcano.getDisplacementFrequency(),
        setVolcanoDisplacementFrequency: value => volcano.setDisplacementFrequency(value),

        getSmokeVisible: () => smoke.getVisible(),
        setSmokeVisible: value => smoke.setVisible(value),
        getSmokeCount: () => smoke.getCount(),
        setSmokeCount: value => smoke.setCount(value),
        getMaxSmokeCount: () => smoke.getMaxCount(),
        getSmokeSpread: () => smoke.getSpread(),
        setSmokeSpread: value => smoke.setSpread(value),
        getSmokeRiseSpeed: () => smoke.getRiseSpeed(),
        setSmokeRiseSpeed: value => smoke.setRiseSpeed(value),
        getSmokeColor1: () => smoke.getColor1(),
        setSmokeColor1: value => smoke.setColor1(value),
        getSmokeColor2: () => smoke.getColor2(),
        setSmokeColor2: value => smoke.setColor2(value),
        getSmokeColor3: () => smoke.getColor3(),
        setSmokeColor3: value => smoke.setColor3(value),
        getSmokeParticleSize: () => smoke.getParticleSize(),
        setSmokeParticleSize: value => smoke.setParticleSize(value),

        getOffsetX: () => position.x,
        setOffsetX: value => { position.x = value; volcano.mesh.position.x = value; metaball_field.effect.position.x = value; smoke.effect.position.x = value; },
        getOffsetY: () => position.y,
        setOffsetY: value => { position.y = value; applyY(ground.mesh.position.y); },
        getOffsetZ: () => position.z,
        setOffsetZ: value => { position.z = value; volcano.mesh.position.z = value; metaball_field.effect.position.z = value; smoke.effect.position.z = value; },

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
            smokeVisible: controller.getSmokeVisible(),
            smokeCount: controller.getSmokeCount(),
            smokeSpread: controller.getSmokeSpread(),
            smokeRiseSpeed: controller.getSmokeRiseSpeed(),
            smokeColor1: controller.getSmokeColor1(),
            smokeColor2: controller.getSmokeColor2(),
            smokeColor3: controller.getSmokeColor3(),
            smokeParticleSize: controller.getSmokeParticleSize(),
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
        smokeVisible: controller.setSmokeVisible,
        smokeCount: controller.setSmokeCount,
        smokeSpread: controller.setSmokeSpread,
        smokeRiseSpeed: controller.setSmokeRiseSpeed,
        smokeColor1: controller.setSmokeColor1,
        smokeColor2: controller.setSmokeColor2,
        smokeColor3: controller.setSmokeColor3,
        smokeParticleSize: controller.setSmokeParticleSize,
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

    applyY(ground.mesh.position.y);

    return controller;
}
