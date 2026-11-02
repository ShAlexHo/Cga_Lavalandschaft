import { createGround } from './objects/ground_object.js';
import { createVolcano } from './objects/volcano_object.js';
import { createMetaballField } from './objects/metaball_field_object.js';
import { createSmoke } from './objects/smoke_object.js';
import { createSun } from './objects/sun_object.js';
import { createSky } from './objects/sky_object.js';
import { createInteractionController } from './objects/interaction_controller.js';
import { createImpactSmoke } from './objects/impact_smoke_object.js';
import { createVolcanoAudio } from './audio/volcano_audio.js';
import { SMOKE_SPAWN_HEIGHT, METABALL_WAVE_BOOST_MULTIPLIER, METABALL_WAVE_BOOST_HOLD_FRAMES, METABALL_WAVE_BOOST_DECAY_FRAMES } from './config.js';
import { smoothstep, distance } from './animation/math_utils.js';
import DEFAULT_SETTINGS from './default_settings.json';

const IRREGULAR_SETTING_ACCESSOR_NAMES = {
    paused: ['isPaused', 'setPaused'],
    timeScale: ['getBaseTimeScale', 'setTimeScale'],
};

function settingAccessorNames(key) {
    const name = key[0].toUpperCase() + key.slice(1);
    return IRREGULAR_SETTING_ACCESSOR_NAMES[key] ?? [`get${name}`, `set${name}`];
}

export function createSceneController({ scene, camera, renderer, bloom_pass, god_rays_pass, setControlsEnabled, signal }) {
    const ground = createGround(scene);
    const volcano = createVolcano(scene);
    const metaball_field = createMetaballField(scene);
    const smoke = createSmoke(scene);
    const sun = createSun(scene);
    const sky = createSky(scene);
    const interaction = createInteractionController(renderer, volcano.mesh, { signal });
    const impact_smoke = createImpactSmoke(scene);
    const volcano_audio = createVolcanoAudio();

    metaball_field.effect.position.y = 0.36;
    volcano.mesh.position.y = ground.mesh.position.y;
    volcano.rebakeCrackDisplacement();
    ground.rebakeDisplacement(volcano.mesh.position);

    const effect_offset = metaball_field.effect.position.y - volcano.mesh.position.y;
    const position = { x: 0, y: 0, z: 0 };
    let metaball_y_offset = DEFAULT_SETTINGS.metaballHeight;
    let time_scale = DEFAULT_SETTINGS.timeScale;
    let last_spawn_count = metaball_field.getSpawnCount();
    let last_wave_start_count = metaball_field.getWaveStartCount();
    let frames_since_wave_start = Infinity;

    function getWaveBoostMultiplier() {
        if (interaction.getEnabled()) return 1;
        const decay_fraction = 1 - smoothstep(
            METABALL_WAVE_BOOST_HOLD_FRAMES,
            METABALL_WAVE_BOOST_HOLD_FRAMES + METABALL_WAVE_BOOST_DECAY_FRAMES,
            frames_since_wave_start,
        );
        return 1 + (METABALL_WAVE_BOOST_MULTIPLIER - 1) * decay_fraction;
    }

    function applyY(ground_y) {
        ground.mesh.position.y = ground_y;
        volcano.mesh.position.y = ground_y + position.y;
        metaball_field.effect.position.y = ground_y + position.y + effect_offset + metaball_y_offset;
        smoke.effect.position.y = ground_y + position.y + SMOKE_SPAWN_HEIGHT;
        volcano.rebakeCrackDisplacement();
        ground.rebakeDisplacement(volcano.mesh.position);
    }

    const controller = {
        update(time, real_delta_seconds) {
            sun.update(time);
            ground.update(camera, volcano.mesh.position, sun.light.position, time, scene.background);
            metaball_field.update(time, camera, volcano.mesh.position);
            metaball_field.renderFieldTexture(renderer);
            const { touch_points, smoke_bursts, is_touching_lava } = interaction.step(
                time, camera,
                () => metaball_field.getActiveWorldPositions(),
                metaball_squeeze => metaball_field.squeezeNearestBall(metaball_squeeze),
                real_delta_seconds,
            );
            volcano.update(camera, sun.light.position, touch_points);
            impact_smoke.update(camera, sun.light.position, smoke_bursts);
            smoke.update(camera, sun.light.position, time, metaball_field.getEruptionIntensity(time));
            volcano_audio.update(time);
            volcano_audio.setPressing(is_touching_lava);
            volcano_audio.setCameraDistance(distance(camera.position, volcano.mesh.position));

            const spawn_count = metaball_field.getSpawnCount();
            if (spawn_count !== last_spawn_count) {
                last_spawn_count = spawn_count;
                volcano_audio.playMetaballSpawn();
            }

            const wave_start_count = metaball_field.getWaveStartCount();
            if (wave_start_count !== last_wave_start_count) {
                last_wave_start_count = wave_start_count;
                frames_since_wave_start = 0;
            } else {
                frames_since_wave_start++;
            }
        },

        fastForward(duration, step) {
            const step_count = Math.floor(duration / step);
            for (let i = 0; i <= step_count; i++) metaball_field.update(i * step, camera, volcano.mesh.position);
            last_spawn_count = metaball_field.getSpawnCount();
            last_wave_start_count = metaball_field.getWaveStartCount();
        },

        isPaused: () => metaball_field.isPaused(),
        setPaused: value => metaball_field.setPaused(value),

        getTimeScale: () => time_scale * getWaveBoostMultiplier(),
        setTimeScale(value) { time_scale = value; },
        getBaseTimeScale: () => time_scale,

        getInteractionMode: () => interaction.getEnabled(),
        setInteractionMode(value) {
            interaction.setEnabled(value);
            setControlsEnabled(!value);
        },
        getInteractionSmokeVisible: () => impact_smoke.getVisible(),
        setInteractionSmokeVisible: value => impact_smoke.setVisible(value),

        getMetaballCount: () => metaball_field.getCount(),
        setMetaballCount: value => metaball_field.setCount(value),
        getMaxMetaballCount: () => metaball_field.getMaxCount(),
        getMetaballIsolation: () => metaball_field.getIsolation(),
        setMetaballIsolation: value => metaball_field.setIsolation(value),
        getMetaballRadius: () => metaball_field.getRadius(),
        setMetaballRadius: value => metaball_field.setRadius(value),
        getMetaballSpread: () => metaball_field.getSpread(),
        setMetaballSpread: value => metaball_field.setSpread(value),
        getMetaballSpeed: () => metaball_field.getSpeed(),
        setMetaballSpeed: value => metaball_field.setSpeed(value),
        getMetaballSinkSpeed: () => metaball_field.getSinkSpeed(),
        setMetaballSinkSpeed: value => metaball_field.setSinkSpeed(value),
        getMetaballDisappearY: () => metaball_field.getDisappearY(),
        setMetaballDisappearY: value => metaball_field.setDisappearY(value),
        getMetaballHeight: () => metaball_y_offset,
        setMetaballHeight(value) {
            metaball_y_offset = value;
            applyY(ground.mesh.position.y);
        },
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
        getGroundColor2: () => ground.getColor2(),
        setGroundColor2: value => ground.setColor2(value),
        getGroundColor3: () => ground.getColor3(),
        setGroundColor3: value => ground.setColor3(value),
        getGroundColor4: () => ground.getColor4(),
        setGroundColor4: value => ground.setColor4(value),
        getGroundCrackColor: () => ground.getCrackColor(),
        setGroundCrackColor: value => ground.setCrackColor(value),
        getGroundCrackColor2: () => ground.getCrackColor2(),
        setGroundCrackColor2: value => ground.setCrackColor2(value),
        getGroundCrackColor3: () => ground.getCrackColor3(),
        setGroundCrackColor3: value => ground.setCrackColor3(value),
        getGroundCrackColor4: () => ground.getCrackColor4(),
        setGroundCrackColor4: value => ground.setCrackColor4(value),
        getGroundCrackSoftness: () => ground.getCrackSoftness(),
        setGroundCrackSoftness: value => ground.setCrackSoftness(value),
        getGroundProximityColor: () => ground.getProximityColor(),
        setGroundProximityColor: value => ground.setProximityColor(value),
        getGroundProximityNoiseColor: () => ground.getProximityNoiseColor(),
        setGroundProximityNoiseColor: value => ground.setProximityNoiseColor(value),
        getGroundProximityRadius: () => ground.getProximityRadius(),
        setGroundProximityRadius: value => ground.setProximityRadius(value),
        getGroundSunFocusRadius: () => ground.getSunFocusRadius(),
        setGroundSunFocusRadius: value => ground.setSunFocusRadius(value),
        getGroundRockVarianceRadius: () => ground.getRockVarianceRadius(),
        setGroundRockVarianceRadius: value => ground.setRockVarianceRadius(value),
        getGroundDisplacementScale: () => ground.getDisplacementScale(),
        setGroundDisplacementScale: value => ground.setDisplacementScale(value),
        getGroundDisplacementFrequency: () => ground.getDisplacementFrequency(),
        setGroundDisplacementFrequency: value => ground.setDisplacementFrequency(value),
        getGroundHeight: () => ground.mesh.position.y,
        setGroundHeight: value => applyY(value),
        getGroundMesh: () => ground.mesh,

        getVolcanoPosition: () => volcano.mesh.position,
        getVolcanoMesh: () => volcano.mesh,
        getSunMesh: () => sun.mesh,

        getVolcanoVisible: () => volcano.getVisible(),
        setVolcanoVisible: value => volcano.setVisible(value),
        getVolcanoRockColor: () => volcano.getRockColor(),
        setVolcanoRockColor: value => volcano.setRockColor(value),
        getVolcanoDisplacementScale: () => volcano.getDisplacementScale(),
        setVolcanoDisplacementScale(value) {
            volcano.setDisplacementScale(value);
            ground.setVolcanoCrackScale(value);
        },
        getVolcanoDisplacementFrequency: () => volcano.getDisplacementFrequency(),
        setVolcanoDisplacementFrequency(value) {
            volcano.setDisplacementFrequency(value);
            ground.setVolcanoCrackFrequency(value);
        },

        getSunVisible: () => sun.getVisible(),
        setSunVisible(value) {
            sun.setVisible(value);
            god_rays_pass.enabled = value;
            ground.setSunEnabled(value);
            volcano.setSunEnabled(value);
            smoke.setSunEnabled(value);
            impact_smoke.setSunEnabled(value);
        },
        getSunStrength: () => volcano.getSunStrength(),
        setSunStrength(value) {
            ground.setSunStrength(value);
            volcano.setSunStrength(value);
            smoke.setSunStrength(value);
            impact_smoke.setSunStrength(value);
        },
        getSunFocus: () => volcano.getSunFocus(),
        setSunFocus(value) {
            ground.setSunFocus(value);
            volcano.setSunFocus(value);
        },

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
        getSmokeEmberCoolingTime: () => smoke.getEmberCoolingTime(),
        setSmokeEmberCoolingTime: value => smoke.setEmberCoolingTime(value),

        getOffsetX: () => position.x,
        setOffsetX(value) {
            position.x = value;
            volcano.mesh.position.x = value;
            metaball_field.effect.position.x = value;
            smoke.effect.position.x = value;
            volcano.rebakeCrackDisplacement();
            ground.rebakeDisplacement(volcano.mesh.position);
        },
        getOffsetY: () => position.y,
        setOffsetY(value) {
            position.y = value;
            applyY(ground.mesh.position.y);
        },
        getOffsetZ: () => position.z,
        setOffsetZ(value) {
            position.z = value;
            volcano.mesh.position.z = value;
            metaball_field.effect.position.z = value;
            smoke.effect.position.z = value;
            volcano.rebakeCrackDisplacement();
            ground.rebakeDisplacement(volcano.mesh.position);
        },

        getBloomEnabled: () => bloom_pass.enabled,
        setBloomEnabled(value) { bloom_pass.enabled = value; },
        getBloomStrength: () => bloom_pass.strength,
        setBloomStrength(value) { bloom_pass.strength = value; },
        getBloomRadius: () => bloom_pass.radius,
        setBloomRadius(value) { bloom_pass.radius = value; },
        getBloomThreshold: () => bloom_pass.threshold,
        setBloomThreshold(value) { bloom_pass.threshold = value; },

        getSkyColor: () => sky.getColor(),
        setSkyColor: value => sky.setColor(value),

        getGodRaysWeight: () => god_rays_pass.getWeight(),
        setGodRaysWeight: value => god_rays_pass.setWeight(value),
        getGodRaysExposure: () => god_rays_pass.getExposure(),
        setGodRaysExposure: value => god_rays_pass.setExposure(value),
        getGodRaysDecay: () => god_rays_pass.getDecay(),
        setGodRaysDecay: value => god_rays_pass.setDecay(value),
        getGodRaysDensity: () => god_rays_pass.getDensity(),
        setGodRaysDensity: value => god_rays_pass.setDensity(value),
        getGodRaysTintColor: () => god_rays_pass.getTintColor(),
        setGodRaysTintColor: value => god_rays_pass.setTintColor(value),

        startAudio: () => volcano_audio.start(),
        stopAudio: () => volcano_audio.stop(),
        closeAudio: () => volcano_audio.close(),
        getSoundEnabled: () => volcano_audio.getEnabled(),
        setSoundEnabled: value => volcano_audio.setEnabled(value),
        getSoundVolume: () => volcano_audio.getVolume(),
        setSoundVolume: value => volcano_audio.setVolume(value),

        getSnapshot,
        applySnapshot,
        resetToDefaults: () => applySnapshot(DEFAULT_SETTINGS),
    };

    const setting_bindings = Object.keys(DEFAULT_SETTINGS).map(key => {
        const [getter_name, setter_name] = settingAccessorNames(key);
        return { key, get: () => controller[getter_name](), set: value => controller[setter_name](value) };
    });

    const setters_by_key = Object.fromEntries(setting_bindings.map(({ key, set }) => [key, set]));

    function getSnapshot() {
        const snapshot = {};
        for (const { key, get } of setting_bindings) snapshot[key] = get();
        return snapshot;
    }

    function applySnapshot(data) {
        for (const [key, value] of Object.entries(data)) {
            if (setters_by_key[key]) setters_by_key[key](value);
        }
    }

    applyY(ground.mesh.position.y);

    return controller;
}
