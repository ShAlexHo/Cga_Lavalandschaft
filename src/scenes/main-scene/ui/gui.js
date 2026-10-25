import { GUI } from 'dat.gui';
import { saveToLocalStorage, loadFromLocalStorage } from '../persistence/persistence.js';
import { translate, onLanguageChange } from '../../../ui/language.js';

const TIME_SCALE_MIN = 1;
const TIME_SCALE_MAX = 6;
const TIME_SCALE_STEP = 1;

// with mode_controls_only, hidden settings can't be reset, so only the visible ones are restored
export function setupGui(facade, { mode_controls_only = false } = {}) {
    const gui = new GUI({ closed: true });
    const all_controllers = [];
    const refresh_bindings = [];
    const relabel_callbacks = [];

    function nameController(controller, message_key) {
        controller.name(translate(message_key));
        relabel_callbacks.push(() => controller.name(translate(message_key)));
        return controller;
    }

    function bind(controller, message_key) {
        all_controllers.push(controller);
        return nameController(controller, message_key);
    }

    function addFolder(message_key) {
        const folder = gui.addFolder(translate(message_key));
        relabel_callbacks.push(() => { folder.name = translate(message_key); });
        return folder;
    }

    function relabel() {
        GUI.TEXT_OPEN = translate('gui.open_controls');
        GUI.TEXT_CLOSED = translate('gui.close_controls');
        gui.closed = gui.closed; // re-renders the open/close button with the new texts
        relabel_callbacks.forEach(callback => callback());
    }

    relabel();
    onLanguageChange(relabel);

    function makeParameters(getters) {
        const parameters = {};
        for (const [key, getter] of Object.entries(getters)) {
            parameters[key] = getter();
            refresh_bindings.push(() => { parameters[key] = getter(); });
        }
        return parameters;
    }

    function defineLiveProperty(parameters, key, get, set) {
        Object.defineProperty(parameters, key, { get, set, enumerable: true });
    }

    const root_parameters = makeParameters({
        paused: facade.isPaused,
        time_scale: facade.getBaseTimeScale, // not getTimeScale - a boosted read-back would fight the user's drag
    });
    defineLiveProperty(root_parameters, 'interaction_mode', () => facade.getInteractionMode(), value => facade.setInteractionMode(value));
    defineLiveProperty(root_parameters, 'autonomous_mode', () => !facade.getInteractionMode(), value => facade.setInteractionMode(!value));
    if (!mode_controls_only) {
        bind(gui.add(root_parameters, 'paused'), 'gui.paused').onChange(value => facade.setPaused(value));
    }
    bind(gui.add(root_parameters, 'time_scale', TIME_SCALE_MIN, TIME_SCALE_MAX, TIME_SCALE_STEP), 'gui.time_scale')
        .onChange(value => facade.setTimeScale(value));
    bind(gui.add(root_parameters, 'autonomous_mode'), 'gui.autonomous_mode')
        .onChange(value => facade.setInteractionMode(!value))
        .listen();
    bind(gui.add(root_parameters, 'interaction_mode'), 'gui.interaction_mode')
        .onChange(value => facade.setInteractionMode(value))
        .listen();

    function refreshDisplay() {
        refresh_bindings.forEach(update => update());
        all_controllers.forEach(controller => controller.updateDisplay());
    }

    function restoreSavedSettings(keys) {
        const saved = loadFromLocalStorage();
        if (!saved) return;
        const restored = keys
            ? Object.fromEntries(keys.filter(key => key in saved).map(key => [key, saved[key]]))
            : { ...saved };
        // older saves may hold values outside the slider's range
        if ('timeScale' in restored) restored.timeScale = Math.min(Math.max(restored.timeScale, TIME_SCALE_MIN), TIME_SCALE_MAX);
        facade.applySnapshot(restored);
        refreshDisplay();
    }

    window.addEventListener('beforeunload', () => saveToLocalStorage(facade.getSnapshot()));

    const persistence_actions = {
        reset: () => { facade.resetToDefaults(); refreshDisplay(); },
    };

    if (mode_controls_only) {
        nameController(gui.add(persistence_actions, 'reset'), 'gui.reset.all');
        restoreSavedSettings(['interactionMode', 'timeScale']);
        return gui;
    }

    const metaballs_folder = addFolder('gui.folder.metaballs');
    const metaballs_parameters = makeParameters({
        height: facade.getMetaballHeight,
    });
    bind(metaballs_folder.add(metaballs_parameters, 'height', 0, 5, 0.05), 'gui.height')
        .onChange(value => facade.setMetaballHeight(value));

    const colors_folder = addFolder('gui.folder.lava_colour');
    const color_parameters = makeParameters({
        color_hot: facade.getColorHot,
        color_cool: facade.getColorCool,
        glow_enabled: facade.getGlowEnabled,
        glow_color: facade.getGlowColor,
    });
    bind(colors_folder.addColor(color_parameters, 'color_hot'), 'gui.lava.colour_hot')
        .onChange(value => facade.setColorHot(value));
    bind(colors_folder.addColor(color_parameters, 'color_cool'), 'gui.lava.colour_cool')
        .onChange(value => facade.setColorCool(value));
    bind(colors_folder.add(color_parameters, 'glow_enabled'), 'gui.lava.glow')
        .onChange(value => facade.setGlowEnabled(value));
    bind(colors_folder.addColor(color_parameters, 'glow_color'), 'gui.lava.glow_colour')
        .onChange(value => facade.setGlowColor(value));

    const noise_folder = addFolder('gui.folder.noise');
    const noise_parameters = makeParameters({
        noise: facade.getNoiseEnabled,
        noise_color_1: facade.getNoiseColor1,
        noise_color_2: facade.getNoiseColor2,
        bumping: facade.getBumpEnabled,
    });
    bind(noise_folder.add(noise_parameters, 'noise'), 'gui.enabled')
        .onChange(value => facade.setNoiseEnabled(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_color_1'), 'gui.noise.colour_1')
        .onChange(value => facade.setNoiseColor1(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_color_2'), 'gui.noise.colour_2')
        .onChange(value => facade.setNoiseColor2(value));
    bind(noise_folder.add(noise_parameters, 'bumping'), 'gui.noise.bumping')
        .onChange(value => facade.setBumpEnabled(value));

    const displacement_parameters = makeParameters({
        displacement: facade.getDisplacementEnabled,
        strength: facade.getDisplacementStrength,
    });
    bind(noise_folder.add(displacement_parameters, 'displacement'), 'gui.noise.displacement')
        .onChange(value => facade.setDisplacementEnabled(value));
    bind(noise_folder.add(displacement_parameters, 'strength', 0.0, 0.08, 0.002), 'gui.noise.displacement_strength')
        .onChange(value => facade.setDisplacementStrength(value));

    const ground_folder = addFolder('gui.folder.ground');
    const ground_parameters = makeParameters({
        visible: facade.getGroundVisible,
        color: facade.getGroundColor,
        color_2: facade.getGroundColor2,
        color_3: facade.getGroundColor3,
        color_4: facade.getGroundColor4,
        proximity_radius: facade.getGroundProximityRadius,
        displacement_scale: facade.getGroundDisplacementScale,
        displacement_frequency: facade.getGroundDisplacementFrequency,
        height: facade.getGroundHeight,
    });
    bind(ground_folder.add(ground_parameters, 'visible'), 'gui.visible')
        .onChange(value => facade.setGroundVisible(value));
    bind(ground_folder.addColor(ground_parameters, 'color'), 'gui.colour')
        .onChange(value => facade.setGroundColor(value));
    bind(ground_folder.addColor(ground_parameters, 'color_2'), 'gui.colour_2')
        .onChange(value => facade.setGroundColor2(value));
    bind(ground_folder.addColor(ground_parameters, 'color_3'), 'gui.colour_3')
        .onChange(value => facade.setGroundColor3(value));
    bind(ground_folder.addColor(ground_parameters, 'color_4'), 'gui.colour_4')
        .onChange(value => facade.setGroundColor4(value));
    bind(ground_folder.add(ground_parameters, 'proximity_radius', 0.0, 40.0, 0.5), 'gui.ground.proximity_radius')
        .onChange(value => facade.setGroundProximityRadius(value));
    bind(ground_folder.add(ground_parameters, 'displacement_scale', 0.0, 3.0, 0.05), 'gui.ground.displacement_scale')
        .onChange(value => facade.setGroundDisplacementScale(value));
    bind(ground_folder.add(ground_parameters, 'displacement_frequency', 0.01, 0.5, 0.01), 'gui.ground.displacement_frequency')
        .onChange(value => facade.setGroundDisplacementFrequency(value));
    bind(ground_folder.add(ground_parameters, 'height', -10, 0, 0.01), 'gui.height')
        .onChange(value => facade.setGroundHeight(value));

    const volcano_folder = addFolder('gui.folder.volcano');
    const volcano_parameters = makeParameters({
        visible: facade.getVolcanoVisible,
        displacement_scale: facade.getVolcanoDisplacementScale,
        displacement_frequency: facade.getVolcanoDisplacementFrequency,
        rock_color: facade.getVolcanoRockColor,
    });
    bind(volcano_folder.add(volcano_parameters, 'visible'), 'gui.visible')
        .onChange(value => facade.setVolcanoVisible(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_scale', 0.0, 6.0, 0.05), 'gui.volcano.displacement_scale')
        .onChange(value => facade.setVolcanoDisplacementScale(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_frequency', 0.1, 2.0, 0.05), 'gui.volcano.displacement_frequency')
        .onChange(value => facade.setVolcanoDisplacementFrequency(value));
    bind(volcano_folder.addColor(volcano_parameters, 'rock_color'), 'gui.volcano.rock_colour')
        .onChange(value => facade.setVolcanoRockColor(value));

    const sun_folder = addFolder('gui.folder.sun');
    const sun_parameters = makeParameters({
        visible: facade.getSunVisible,
        strength: facade.getSunStrength,
        focus: facade.getSunFocus,
    });
    bind(sun_folder.add(sun_parameters, 'visible'), 'gui.visible')
        .onChange(value => facade.setSunVisible(value));
    bind(sun_folder.add(sun_parameters, 'strength', 0.0, 0.3, 0.005), 'gui.sun.strength')
        .onChange(value => facade.setSunStrength(value));
    bind(sun_folder.add(sun_parameters, 'focus', 1.0, 25.0, 0.1), 'gui.sun.focus')
        .onChange(value => facade.setSunFocus(value));

    const smoke_folder = addFolder('gui.folder.smoke');
    const smoke_parameters = makeParameters({
        visible: facade.getSmokeVisible,
        count: facade.getSmokeCount,
        spread: facade.getSmokeSpread,
        rise_speed: facade.getSmokeRiseSpeed,
        color_1: facade.getSmokeColor1,
        color_2: facade.getSmokeColor2,
        color_3: facade.getSmokeColor3,
        particle_size: facade.getSmokeParticleSize,
        ember_cooling_time: facade.getSmokeEmberCoolingTime,
    });
    bind(smoke_folder.add(smoke_parameters, 'visible'), 'gui.visible')
        .onChange(value => facade.setSmokeVisible(value));
    bind(smoke_folder.add(smoke_parameters, 'count', 1, facade.getMaxSmokeCount(), 1), 'gui.smoke.count')
        .onChange(value => facade.setSmokeCount(value));
    bind(smoke_folder.add(smoke_parameters, 'spread', 0.0, 8.0, 0.1), 'gui.smoke.spread')
        .onChange(value => facade.setSmokeSpread(value));
    bind(smoke_folder.add(smoke_parameters, 'rise_speed', 0.1, 3.0, 0.05), 'gui.smoke.rise_speed')
        .onChange(value => facade.setSmokeRiseSpeed(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_1'), 'gui.smoke.colour_1')
        .onChange(value => facade.setSmokeColor1(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_2'), 'gui.smoke.colour_2')
        .onChange(value => facade.setSmokeColor2(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_3'), 'gui.smoke.colour_3')
        .onChange(value => facade.setSmokeColor3(value));
    bind(smoke_folder.add(smoke_parameters, 'particle_size', 0.1, 200, 0.1), 'gui.smoke.particle_size')
        .onChange(value => facade.setSmokeParticleSize(value));
    bind(smoke_folder.add(smoke_parameters, 'ember_cooling_time', 0.1, 30.0, 0.1), 'gui.smoke.ember_cooling_time')
        .onChange(value => facade.setSmokeEmberCoolingTime(value));

    const bloom_folder = addFolder('gui.folder.bloom');
    const bloom_parameters = makeParameters({
        enabled: facade.getBloomEnabled,
        strength: facade.getBloomStrength,
    });
    bind(bloom_folder.add(bloom_parameters, 'enabled'), 'gui.enabled')
        .onChange(value => facade.setBloomEnabled(value));
    bind(bloom_folder.add(bloom_parameters, 'strength', 0.0, 4.0, 0.05), 'gui.strength')
        .onChange(value => facade.setBloomStrength(value));

    const sky_folder = addFolder('gui.folder.sky');
    const sky_parameters = makeParameters({ color: facade.getSkyColor });
    bind(sky_folder.addColor(sky_parameters, 'color'), 'gui.colour')
        .onChange(value => facade.setSkyColor(value));

    const god_rays_folder = addFolder('gui.folder.god_rays');
    const god_rays_parameters = makeParameters({
        weight: facade.getGodRaysWeight,
        exposure: facade.getGodRaysExposure,
        decay: facade.getGodRaysDecay,
        density: facade.getGodRaysDensity,
        tint_color: facade.getGodRaysTintColor,
    });
    bind(god_rays_folder.add(god_rays_parameters, 'weight', 0.0, 1.0, 0.01), 'gui.strength')
        .onChange(value => facade.setGodRaysWeight(value));
    bind(god_rays_folder.add(god_rays_parameters, 'exposure', 0.0, 1.5, 0.01), 'gui.god_rays.exposure')
        .onChange(value => facade.setGodRaysExposure(value));
    bind(god_rays_folder.add(god_rays_parameters, 'decay', 0.8, 0.99, 0.001), 'gui.god_rays.decay')
        .onChange(value => facade.setGodRaysDecay(value));
    bind(god_rays_folder.add(god_rays_parameters, 'density', 0.5, 1.2, 0.01), 'gui.god_rays.density')
        .onChange(value => facade.setGodRaysDensity(value));
    bind(god_rays_folder.addColor(god_rays_parameters, 'tint_color'), 'gui.colour')
        .onChange(value => facade.setGodRaysTintColor(value));

    const sound_folder = addFolder('gui.folder.sound');
    const sound_parameters = makeParameters({
        enabled: facade.getSoundEnabled,
        volume: facade.getSoundVolume,
    });
    bind(sound_folder.add(sound_parameters, 'enabled'), 'gui.enabled')
        .onChange(value => facade.setSoundEnabled(value));
    bind(sound_folder.add(sound_parameters, 'volume', 0.0, 1.0, 0.01), 'gui.sound.volume')
        .onChange(value => facade.setSoundVolume(value));

    const persistence_folder = addFolder('gui.folder.reset');
    nameController(persistence_folder.add(persistence_actions, 'reset'), 'gui.reset.defaults');

    restoreSavedSettings();

    return gui;
}
