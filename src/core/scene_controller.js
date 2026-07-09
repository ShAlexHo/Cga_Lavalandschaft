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

    // Single source of truth for every persisted/snapshot-able setting - getSnapshot() and the
    // restore-by-key SETTERS map are both derived from this instead of hand-duplicating each field twice.
    const SETTINGS = [
        { key: 'paused', get: () => controller.isPaused(), set: value => controller.setPaused(value) },
        { key: 'metaballCount', get: () => controller.getMetaballCount(), set: value => controller.setMetaballCount(value) },
        { key: 'metaballIsolation', get: () => controller.getMetaballIsolation(), set: value => controller.setMetaballIsolation(value) },
        { key: 'metaballSpread', get: () => controller.getMetaballSpread(), set: value => controller.setMetaballSpread(value) },
        { key: 'metaballSpeed', get: () => controller.getMetaballSpeed(), set: value => controller.setMetaballSpeed(value) },
        { key: 'metaballHeight', get: () => controller.getMetaballHeight(), set: value => controller.setMetaballHeight(value) },
        { key: 'flowRadius', get: () => controller.getFlowRadius(), set: value => controller.setFlowRadius(value) },
        { key: 'colorHot', get: () => controller.getColorHot(), set: value => controller.setColorHot(value) },
        { key: 'colorCool', get: () => controller.getColorCool(), set: value => controller.setColorCool(value) },
        { key: 'glowEnabled', get: () => controller.getGlowEnabled(), set: value => controller.setGlowEnabled(value) },
        { key: 'glowColor', get: () => controller.getGlowColor(), set: value => controller.setGlowColor(value) },
        { key: 'noiseEnabled', get: () => controller.getNoiseEnabled(), set: value => controller.setNoiseEnabled(value) },
        { key: 'noiseColor1', get: () => controller.getNoiseColor1(), set: value => controller.setNoiseColor1(value) },
        { key: 'noiseColor2', get: () => controller.getNoiseColor2(), set: value => controller.setNoiseColor2(value) },
        { key: 'bumpEnabled', get: () => controller.getBumpEnabled(), set: value => controller.setBumpEnabled(value) },
        { key: 'displacementEnabled', get: () => controller.getDisplacementEnabled(), set: value => controller.setDisplacementEnabled(value) },
        { key: 'displacementStrength', get: () => controller.getDisplacementStrength(), set: value => controller.setDisplacementStrength(value) },
        { key: 'groundVisible', get: () => controller.getGroundVisible(), set: value => controller.setGroundVisible(value) },
        { key: 'groundColor', get: () => controller.getGroundColor(), set: value => controller.setGroundColor(value) },
        { key: 'groundHeight', get: () => controller.getGroundHeight(), set: value => controller.setGroundHeight(value) },
        { key: 'volcanoVisible', get: () => controller.getVolcanoVisible(), set: value => controller.setVolcanoVisible(value) },
        { key: 'volcanoDisplacementScale', get: () => controller.getVolcanoDisplacementScale(), set: value => controller.setVolcanoDisplacementScale(value) },
        { key: 'volcanoDisplacementFrequency', get: () => controller.getVolcanoDisplacementFrequency(), set: value => controller.setVolcanoDisplacementFrequency(value) },
        { key: 'volcanoRockColor', get: () => controller.getVolcanoRockColor(), set: value => controller.setVolcanoRockColor(value) },
        { key: 'volcanoCrackColor', get: () => controller.getVolcanoCrackColor(), set: value => controller.setVolcanoCrackColor(value) },
        { key: 'smokeVisible', get: () => controller.getSmokeVisible(), set: value => controller.setSmokeVisible(value) },
        { key: 'smokeCount', get: () => controller.getSmokeCount(), set: value => controller.setSmokeCount(value) },
        { key: 'smokeSpread', get: () => controller.getSmokeSpread(), set: value => controller.setSmokeSpread(value) },
        { key: 'smokeRiseSpeed', get: () => controller.getSmokeRiseSpeed(), set: value => controller.setSmokeRiseSpeed(value) },
        { key: 'smokeColor1', get: () => controller.getSmokeColor1(), set: value => controller.setSmokeColor1(value) },
        { key: 'smokeColor2', get: () => controller.getSmokeColor2(), set: value => controller.setSmokeColor2(value) },
        { key: 'smokeColor3', get: () => controller.getSmokeColor3(), set: value => controller.setSmokeColor3(value) },
        { key: 'smokeParticleSize', get: () => controller.getSmokeParticleSize(), set: value => controller.setSmokeParticleSize(value) },
        { key: 'offsetX', get: () => controller.getOffsetX(), set: value => controller.setOffsetX(value) },
        { key: 'offsetY', get: () => controller.getOffsetY(), set: value => controller.setOffsetY(value) },
        { key: 'offsetZ', get: () => controller.getOffsetZ(), set: value => controller.setOffsetZ(value) },
        { key: 'bloomEnabled', get: () => controller.getBloom().enabled, set: value => controller.setBloom({ enabled: value }) },
        { key: 'bloomStrength', get: () => controller.getBloom().strength, set: value => controller.setBloom({ strength: value }) },
        { key: 'bloomRadius', get: () => controller.getBloom().radius, set: value => controller.setBloom({ radius: value }) },
        { key: 'bloomThreshold', get: () => controller.getBloom().threshold, set: value => controller.setBloom({ threshold: value }) },
    ];

    const SETTERS = Object.fromEntries(SETTINGS.map(({ key, set }) => [key, set]));

    function getSnapshot() {
        const snapshot = {};
        for (const { key, get } of SETTINGS) snapshot[key] = get();
        return snapshot;
    }

    function applySnapshot(data) {
        for (const [key, value] of Object.entries(data)) {
            if (SETTERS[key]) SETTERS[key](value);
        }
    }

    applyY(ground.mesh.position.y);

    return controller;
}
