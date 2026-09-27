import { GUI } from 'dat.gui';
import { saveToLocalStorage, loadFromLocalStorage } from '../persistence/persistence.js';

export function setupGui(facade) {
    const gui = new GUI({ closed: true });
    const all_controllers = [];
    const refresh_bindings = [];

    function bind(controller) {
        all_controllers.push(controller);
        return controller;
    }

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
    bind(gui.add(root_parameters, 'paused')).name('⏸ Pausiert').onChange(value => facade.setPaused(value));
    bind(gui.add(root_parameters, 'time_scale', 0.1, 100, 0.1)).name('Zeitgeschwindigkeit').onChange(value => facade.setTimeScale(value));
    bind(gui.add(root_parameters, 'autonomous_mode'))
        .name('Autonomer Modus (Zeit-Boost bei Welle)')
        .onChange(value => facade.setInteractionMode(!value))
        .listen();
    bind(gui.add(root_parameters, 'interaction_mode'))
        .name('Interaktionsmodus')
        .onChange(value => facade.setInteractionMode(value))
        .listen();

    const colors_folder = gui.addFolder('Lavafarbe');
    const color_parameters = makeParameters({
        color_hot: facade.getColorHot,
        color_cool: facade.getColorCool,
        glow_enabled: facade.getGlowEnabled,
        glow_color: facade.getGlowColor,
    });
    bind(colors_folder.addColor(color_parameters, 'color_hot'))
        .name('Hell (beleuchtet)')
        .onChange(value => facade.setColorHot(value));
    bind(colors_folder.addColor(color_parameters, 'color_cool'))
        .name('Dunkel (Schatten)')
        .onChange(value => facade.setColorCool(value));
    bind(colors_folder.add(color_parameters, 'glow_enabled'))
        .name('Glühen')
        .onChange(value => facade.setGlowEnabled(value));
    bind(colors_folder.addColor(color_parameters, 'glow_color'))
        .name('Glühfarbe')
        .onChange(value => facade.setGlowColor(value));

    const noise_folder = gui.addFolder('Noise');
    const noise_parameters = makeParameters({
        noise: facade.getNoiseEnabled,
        noise_color_1: facade.getNoiseColor1,
        noise_color_2: facade.getNoiseColor2,
        bumping: facade.getBumpEnabled,
    });
    bind(noise_folder.add(noise_parameters, 'noise'))
        .name('Aktiviert')
        .onChange(value => facade.setNoiseEnabled(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_color_1'))
        .name('primäre Farbe')
        .onChange(value => facade.setNoiseColor1(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_color_2'))
        .name('sekundäre Farbe')
        .onChange(value => facade.setNoiseColor2(value));
    bind(noise_folder.add(noise_parameters, 'bumping'))
        .name('Bumping')
        .onChange(value => facade.setBumpEnabled(value));

    const displacement_parameters = makeParameters({
        displacement: facade.getDisplacementEnabled,
        strength: facade.getDisplacementStrength,
    });
    bind(noise_folder.add(displacement_parameters, 'displacement'))
        .name('Displacement')
        .onChange(value => facade.setDisplacementEnabled(value));
    bind(noise_folder.add(displacement_parameters, 'strength', 0.0, 0.08, 0.002))
        .name('Displacement Stärke')
        .onChange(value => facade.setDisplacementStrength(value));

    const ground_folder = gui.addFolder('Boden');
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
    bind(ground_folder.add(ground_parameters, 'visible'))
        .name('Sichtbar')
        .onChange(value => facade.setGroundVisible(value));
    bind(ground_folder.addColor(ground_parameters, 'color'))
        .name('Farbe')
        .onChange(value => facade.setGroundColor(value));
    bind(ground_folder.addColor(ground_parameters, 'color_2'))
        .name('Farbe 2')
        .onChange(value => facade.setGroundColor2(value));
    bind(ground_folder.addColor(ground_parameters, 'color_3'))
        .name('Farbe 3')
        .onChange(value => facade.setGroundColor3(value));
    bind(ground_folder.addColor(ground_parameters, 'color_4'))
        .name('Farbe 4')
        .onChange(value => facade.setGroundColor4(value));
    bind(ground_folder.add(ground_parameters, 'proximity_radius', 0.0, 40.0, 0.5))
        .name('Reichweite (Vulkannähe)')
        .onChange(value => facade.setGroundProximityRadius(value));
    bind(ground_folder.add(ground_parameters, 'displacement_scale', 0.0, 3.0, 0.05))
        .name('Unebenheit')
        .onChange(value => facade.setGroundDisplacementScale(value));
    bind(ground_folder.add(ground_parameters, 'displacement_frequency', 0.01, 0.5, 0.01))
        .name('Struktur-Frequenz')
        .onChange(value => facade.setGroundDisplacementFrequency(value));
    bind(ground_folder.add(ground_parameters, 'height', -10, 0, 0.01))
        .name('Höhe')
        .onChange(value => facade.setGroundHeight(value));

    const volcano_folder = gui.addFolder('Vulkan');
    const volcano_parameters = makeParameters({
        visible: facade.getVolcanoVisible,
        displacement_scale: facade.getVolcanoDisplacementScale,
        displacement_frequency: facade.getVolcanoDisplacementFrequency,
        rock_color: facade.getVolcanoRockColor,
    });
    bind(volcano_folder.add(volcano_parameters, 'visible'))
        .name('Sichtbar')
        .onChange(value => facade.setVolcanoVisible(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_scale', 0.0, 6.0, 0.05))
        .name('Risstiefe')
        .onChange(value => facade.setVolcanoDisplacementScale(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_frequency', 0.1, 2.0, 0.05))
        .name('Rissfrequenz')
        .onChange(value => facade.setVolcanoDisplacementFrequency(value));
    bind(volcano_folder.addColor(volcano_parameters, 'rock_color'))
        .name('Felsfarbe')
        .onChange(value => facade.setVolcanoRockColor(value));

    const sun_folder = gui.addFolder('Sonne');
    const sun_parameters = makeParameters({
        visible: facade.getSunVisible,
        strength: facade.getSunStrength,
        focus: facade.getSunFocus,
    });
    bind(sun_folder.add(sun_parameters, 'visible'))
        .name('Sichtbar')
        .onChange(value => facade.setSunVisible(value));
    bind(sun_folder.add(sun_parameters, 'strength', 0.0, 0.3, 0.005))
        .name('Sonneneinstrahlung')
        .onChange(value => facade.setSunStrength(value));
    bind(sun_folder.add(sun_parameters, 'focus', 1.0, 25.0, 0.1))
        .name('Sonnenfokus')
        .onChange(value => facade.setSunFocus(value));

    const smoke_folder = gui.addFolder('Rauch & Asche');
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
    bind(smoke_folder.add(smoke_parameters, 'visible'))
        .name('Sichtbar')
        .onChange(value => facade.setSmokeVisible(value));
    bind(smoke_folder.add(smoke_parameters, 'count', 1, facade.getMaxSmokeCount(), 1))
        .name('Anzahl')
        .onChange(value => facade.setSmokeCount(value));
    bind(smoke_folder.add(smoke_parameters, 'spread', 0.0, 8.0, 0.1))
        .name('Streuung')
        .onChange(value => facade.setSmokeSpread(value));
    bind(smoke_folder.add(smoke_parameters, 'rise_speed', 0.1, 3.0, 0.05))
        .name('Aufstiegsgeschwindigkeit')
        .onChange(value => facade.setSmokeRiseSpeed(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_1'))
        .name('Farbe (Asche, dunkel)')
        .onChange(value => facade.setSmokeColor1(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_2'))
        .name('Farbe (Rauch, hell)')
        .onChange(value => facade.setSmokeColor2(value));
    bind(smoke_folder.addColor(smoke_parameters, 'color_3'))
        .name('Farbe (Glut, Akzent)')
        .onChange(value => facade.setSmokeColor3(value));
    bind(smoke_folder.add(smoke_parameters, 'particle_size', 0.1, 200, 0.1))
        .name('Partikelgröße')
        .onChange(value => facade.setSmokeParticleSize(value));
    bind(smoke_folder.add(smoke_parameters, 'ember_cooling_time', 0.1, 30.0, 0.1))
        .name('Abkühlzeit (Glut)')
        .onChange(value => facade.setSmokeEmberCoolingTime(value));

    const bloom_folder = gui.addFolder('Bloom');
    const bloom_parameters = makeParameters({
        enabled: facade.getBloomEnabled,
        strength: facade.getBloomStrength,
    });
    bind(bloom_folder.add(bloom_parameters, 'enabled'))
        .name('Aktiviert')
        .onChange(value => facade.setBloomEnabled(value));
    bind(bloom_folder.add(bloom_parameters, 'strength', 0.0, 4.0, 0.05))
        .name('Stärke')
        .onChange(value => facade.setBloomStrength(value));

    const sky_folder = gui.addFolder('Himmel');
    const sky_parameters = makeParameters({ color: facade.getSkyColor });
    bind(sky_folder.addColor(sky_parameters, 'color'))
        .name('Farbe')
        .onChange(value => facade.setSkyColor(value));

    const god_rays_folder = gui.addFolder('Lichtstrahlen');
    const god_rays_parameters = makeParameters({
        weight: facade.getGodRaysWeight,
        exposure: facade.getGodRaysExposure,
        decay: facade.getGodRaysDecay,
        density: facade.getGodRaysDensity,
        tint_color: facade.getGodRaysTintColor,
    });
    bind(god_rays_folder.add(god_rays_parameters, 'weight', 0.0, 1.0, 0.01))
        .name('Stärke')
        .onChange(value => facade.setGodRaysWeight(value));
    bind(god_rays_folder.add(god_rays_parameters, 'exposure', 0.0, 1.5, 0.01))
        .name('Belichtung')
        .onChange(value => facade.setGodRaysExposure(value));
    bind(god_rays_folder.add(god_rays_parameters, 'decay', 0.8, 0.99, 0.001))
        .name('Abklingrate')
        .onChange(value => facade.setGodRaysDecay(value));
    bind(god_rays_folder.add(god_rays_parameters, 'density', 0.5, 1.2, 0.01))
        .name('Dichte')
        .onChange(value => facade.setGodRaysDensity(value));
    bind(god_rays_folder.addColor(god_rays_parameters, 'tint_color'))
        .name('Farbe')
        .onChange(value => facade.setGodRaysTintColor(value));

    const sound_folder = gui.addFolder('Sound');
    const sound_parameters = makeParameters({
        enabled: facade.getSoundEnabled,
        volume: facade.getSoundVolume,
    });
    bind(sound_folder.add(sound_parameters, 'enabled'))
        .name('Aktiviert')
        .onChange(value => facade.setSoundEnabled(value));
    bind(sound_folder.add(sound_parameters, 'volume', 0.0, 1.0, 0.01))
        .name('Lautstärke')
        .onChange(value => facade.setSoundVolume(value));

    function refreshDisplay() {
        refresh_bindings.forEach(update => update());
        all_controllers.forEach(controller => controller.updateDisplay());
    }

    const persistence_actions = {
        reset: () => { facade.resetToDefaults(); refreshDisplay(); },
    };

    const persistence_folder = gui.addFolder('Zurücksetzen');
    persistence_folder.add(persistence_actions, 'reset').name('🔄 Standard');

    const saved = loadFromLocalStorage();
    if (saved) { facade.applySnapshot(saved); refreshDisplay(); }

    window.addEventListener('beforeunload', () => saveToLocalStorage(facade.getSnapshot()));

    return gui;
}
