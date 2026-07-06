import { GUI } from 'dat.gui';
import { saveToLocalStorage, loadFromLocalStorage, downloadJson, uploadJson } from './persistence.js';

export function setupGui(facade) {
    const gui = new GUI();
    const all_controllers = [];

    function bind(controller) {
        all_controllers.push(controller);
        return controller;
    }

    const root_parameters = { paused: facade.isPaused() };
    bind(gui.add(root_parameters, 'paused')).name('⏸ Pausiert').onChange(value => facade.setPaused(value));

    const metaballs_folder = gui.addFolder('Metaballs');
    const metaballs_parameters = {
        count: facade.getMetaballCount(),
        isolation: facade.getMetaballIsolation(),
        spread: facade.getMetaballSpread(),
        speed_factor: facade.getMetaballSpeed(),
        hoehe: facade.getMetaballHeight(),
        flow_z_radius: facade.getFlowRadius(),
    };
    bind(metaballs_folder.add(metaballs_parameters, 'count', 1, facade.getMaxMetaballCount(), 1))
        .name('Limit')
        .onChange(value => facade.setMetaballCount(value));
    bind(metaballs_folder.add(metaballs_parameters, 'isolation', 1, 100, 1))
        .name('Threshold')
        .onChange(value => facade.setMetaballIsolation(value));
    bind(metaballs_folder.add(metaballs_parameters, 'spread', 0.1, 2.0, 0.01))
        .name('Verteilung')
        .onChange(value => facade.setMetaballSpread(value));
    bind(metaballs_folder.add(metaballs_parameters, 'speed_factor', 0.0, 0.01, 0.0001))
        .name('Geschwindigkeit')
        .onChange(value => facade.setMetaballSpeed(value));
    bind(metaballs_folder.add(metaballs_parameters, 'hoehe', 0, 5, 0.05))
        .name('Höhe')
        .onChange(value => facade.setMetaballHeight(value));
    bind(metaballs_folder.add(metaballs_parameters, 'flow_z_radius', 0, 20, 0.1))
        .name('Steigung')
        .onChange(value => facade.setFlowRadius(value));
    metaballs_folder.open();

    const colors_folder = gui.addFolder('Lavafarbe');
    const color_parameters = {
        farbe_hell: facade.getColorHot(),
        farbe_dunkel: facade.getColorCool(),
        gluehen: facade.getGlowEnabled(),
        glueh_farbe: facade.getGlowColor(),
    };
    bind(colors_folder.addColor(color_parameters, 'farbe_hell'))
        .name('Hell (beleuchtet)')
        .onChange(value => facade.setColorHot(value));
    bind(colors_folder.addColor(color_parameters, 'farbe_dunkel'))
        .name('Dunkel (Schatten)')
        .onChange(value => facade.setColorCool(value));
    bind(colors_folder.add(color_parameters, 'gluehen'))
        .name('Glühen')
        .onChange(value => facade.setGlowEnabled(value));
    bind(colors_folder.addColor(color_parameters, 'glueh_farbe'))
        .name('Glühfarbe')
        .onChange(value => facade.setGlowColor(value));
    colors_folder.open();

    const noise_folder = gui.addFolder('Noise');
    const noise_parameters = {
        noise: facade.getNoiseEnabled(),
        noise_farbe_1: facade.getNoiseColor1(),
        noise_farbe_2: facade.getNoiseColor2(),
        bumping: facade.getBumpEnabled(),
    };
    bind(noise_folder.add(noise_parameters, 'noise'))
        .name('Aktiviert')
        .onChange(value => facade.setNoiseEnabled(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_farbe_1'))
        .name('primäre Farbe')
        .onChange(value => facade.setNoiseColor1(value));
    bind(noise_folder.addColor(noise_parameters, 'noise_farbe_2'))
        .name('sekundäre Farbe')
        .onChange(value => facade.setNoiseColor2(value));
    bind(noise_folder.add(noise_parameters, 'bumping'))
        .name('Bumping')
        .onChange(value => facade.setBumpEnabled(value));

    const displacement_parameters = {
        displacement: facade.getDisplacementEnabled(),
        staerke: facade.getDisplacementStrength(),
    };
    bind(noise_folder.add(displacement_parameters, 'displacement'))
        .name('Displacement')
        .onChange(value => facade.setDisplacementEnabled(value));
    bind(noise_folder.add(displacement_parameters, 'staerke', 0.0, 0.004, 0.0001))
        .name('Displacement Stärke')
        .onChange(value => facade.setDisplacementStrength(value));
    noise_folder.open();

    const ground_folder = gui.addFolder('Boden');
    const ground_parameters = {
        sichtbar: facade.getGroundVisible(),
        farbe: facade.getGroundColor(),
        hoehe: facade.getGroundHeight(),
    };
    bind(ground_folder.add(ground_parameters, 'sichtbar'))
        .name('sichtbar')
        .onChange(value => facade.setGroundVisible(value));
    bind(ground_folder.addColor(ground_parameters, 'farbe'))
        .name('Farbe')
        .onChange(value => facade.setGroundColor(value));
    bind(ground_folder.add(ground_parameters, 'hoehe', -10, 0, 0.01))
        .name('Höhe')
        .onChange(value => facade.setGroundHeight(value));
    ground_folder.open();

    const volcano_folder = gui.addFolder('Vulkan');
    const volcano_parameters = {
        sichtbar: facade.getVolcanoVisible(),
        displacement_scale: facade.getVolcanoDisplacementScale(),
        displacement_frequency: facade.getVolcanoDisplacementFrequency(),
        fels_farbe: facade.getVolcanoRockColor(),
        riss_farbe: facade.getVolcanoCrackColor(),
    };
    bind(volcano_folder.add(volcano_parameters, 'sichtbar'))
        .name('Sichtbar')
        .onChange(value => facade.setVolcanoVisible(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_scale', 0.0, 6.0, 0.05))
        .name('Risstiefe')
        .onChange(value => facade.setVolcanoDisplacementScale(value));
    bind(volcano_folder.add(volcano_parameters, 'displacement_frequency', 0.1, 2.0, 0.05))
        .name('Rissfrequenz')
        .onChange(value => facade.setVolcanoDisplacementFrequency(value));
    bind(volcano_folder.addColor(volcano_parameters, 'fels_farbe'))
        .name('Felsfarbe')
        .onChange(value => facade.setVolcanoRockColor(value));
    bind(volcano_folder.addColor(volcano_parameters, 'riss_farbe'))
        .name('Rissfarbe')
        .onChange(value => facade.setVolcanoCrackColor(value));
    volcano_folder.open();

    const position_folder = gui.addFolder('Position (Vulkan + Lava)');
    const position_parameters = {
        x: facade.getOffsetX(),
        y: facade.getOffsetY(),
        z: facade.getOffsetZ(),
    };
    bind(position_folder.add(position_parameters, 'x', -10, 10, 0.1))
        .name('X')
        .onChange(value => facade.setOffsetX(value));
    bind(position_folder.add(position_parameters, 'y', -6, 6, 0.1))
        .name('Y-Versatz')
        .onChange(value => facade.setOffsetY(value));
    bind(position_folder.add(position_parameters, 'z', -10, 10, 0.1))
        .name('Z')
        .onChange(value => facade.setOffsetZ(value));
    position_folder.open();

    const bloom_folder = gui.addFolder('Bloom');
    const bloom_parameters = facade.getBloom();
    bind(bloom_folder.add(bloom_parameters, 'enabled'))
        .name('Aktiviert')
        .onChange(value => facade.setBloom({ enabled: value }));
    bind(bloom_folder.add(bloom_parameters, 'strength', 0.0, 4.0, 0.05))
        .name('Stärke')
        .onChange(value => facade.setBloom({ strength: value }));
    bind(bloom_folder.add(bloom_parameters, 'radius', 0.0, 1.5, 0.01))
        .name('Radius')
        .onChange(value => facade.setBloom({ radius: value }));
    bind(bloom_folder.add(bloom_parameters, 'threshold', 0.0, 1.0, 0.01))
        .name('Schwellenwert')
        .onChange(value => facade.setBloom({ threshold: value }));
    bloom_folder.open();

    function refreshDisplay() {
        root_parameters.paused = facade.isPaused();
        metaballs_parameters.count = facade.getMetaballCount();
        metaballs_parameters.isolation = facade.getMetaballIsolation();
        metaballs_parameters.spread = facade.getMetaballSpread();
        metaballs_parameters.speed_factor = facade.getMetaballSpeed();
        metaballs_parameters.hoehe = facade.getMetaballHeight();
        metaballs_parameters.flow_z_radius = facade.getFlowRadius();
        color_parameters.farbe_hell = facade.getColorHot();
        color_parameters.farbe_dunkel = facade.getColorCool();
        color_parameters.gluehen = facade.getGlowEnabled();
        color_parameters.glueh_farbe = facade.getGlowColor();
        noise_parameters.noise = facade.getNoiseEnabled();
        noise_parameters.noise_farbe_1 = facade.getNoiseColor1();
        noise_parameters.noise_farbe_2 = facade.getNoiseColor2();
        noise_parameters.bumping = facade.getBumpEnabled();
        displacement_parameters.displacement = facade.getDisplacementEnabled();
        displacement_parameters.staerke = facade.getDisplacementStrength();
        ground_parameters.sichtbar = facade.getGroundVisible();
        ground_parameters.farbe = facade.getGroundColor();
        ground_parameters.hoehe = facade.getGroundHeight();
        volcano_parameters.sichtbar = facade.getVolcanoVisible();
        volcano_parameters.displacement_scale = facade.getVolcanoDisplacementScale();
        volcano_parameters.displacement_frequency = facade.getVolcanoDisplacementFrequency();
        volcano_parameters.fels_farbe = facade.getVolcanoRockColor();
        volcano_parameters.riss_farbe = facade.getVolcanoCrackColor();
        position_parameters.x = facade.getOffsetX();
        position_parameters.y = facade.getOffsetY();
        position_parameters.z = facade.getOffsetZ();
        Object.assign(bloom_parameters, facade.getBloom());

        all_controllers.forEach(controller => controller.updateDisplay());
    }

    const persistence_actions = {
        speichern: () => {
            const data = facade.getSnapshot();
            saveToLocalStorage(data);
            downloadJson(data);
        },
        laden: () => uploadJson(data => { facade.applySnapshot(data); refreshDisplay(); }),
        standard: () => { facade.resetToDefaults(); refreshDisplay(); },
    };

    const persistence_folder = gui.addFolder('Speichern / Laden');
    persistence_folder.add(persistence_actions, 'speichern').name('💾 Speichern');
    persistence_folder.add(persistence_actions, 'laden').name('📂 Laden');
    persistence_folder.add(persistence_actions, 'standard').name('🔄 Standard');
    persistence_folder.open();

    const saved = loadFromLocalStorage();
    if (saved) { facade.applySnapshot(saved); refreshDisplay(); }

    window.addEventListener('beforeunload', () => saveToLocalStorage(facade.getSnapshot()));

    return gui;
}
