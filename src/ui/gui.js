import { GUI } from 'dat.gui';
import { save_to_local_storage, load_from_local_storage, download_json, upload_json } from './persistence.js';

export function setup_gui(facade) {
    const gui = new GUI();
    const all_controllers = [];

    function bind(controller) {
        all_controllers.push(controller);
        return controller;
    }

    const root_params = { paused: facade.isPaused() };
    bind(gui.add(root_params, 'paused')).name('⏸ Pausiert').onChange(v => facade.setPaused(v));

    const metaballs_folder = gui.addFolder('Metaballs');
    const metaballs_vm = {
        count: facade.getMetaballCount(),
        isolation: facade.getMetaballIsolation(),
        spread: facade.getMetaballSpread(),
        speed_factor: facade.getMetaballSpeed(),
        hoehe: facade.getMetaballHeight(),
        flow_z_radius: facade.getFlowRadius(),
    };
    bind(metaballs_folder.add(metaballs_vm, 'count', 1, facade.getMaxMetaballCount(), 1))
        .name('Limit')
        .onChange(v => facade.setMetaballCount(v));
    bind(metaballs_folder.add(metaballs_vm, 'isolation', 1, 100, 1))
        .name('Threshold')
        .onChange(v => facade.setMetaballIsolation(v));
    bind(metaballs_folder.add(metaballs_vm, 'spread', 0.1, 2.0, 0.01))
        .name('Verteilung')
        .onChange(v => facade.setMetaballSpread(v));
    bind(metaballs_folder.add(metaballs_vm, 'speed_factor', 0.0, 0.01, 0.0001))
        .name('Geschwindigkeit')
        .onChange(v => facade.setMetaballSpeed(v));
    bind(metaballs_folder.add(metaballs_vm, 'hoehe', 0, 5, 0.05))
        .name('Höhe')
        .onChange(v => facade.setMetaballHeight(v));
    bind(metaballs_folder.add(metaballs_vm, 'flow_z_radius', 0, 20, 0.1))
        .name('Steigung')
        .onChange(v => facade.setFlowRadius(v));
    metaballs_folder.open();

    const colors_folder = gui.addFolder('Lavafarbe');
    const color_params = {
        farbe_hell: facade.getColorHot(),
        farbe_dunkel: facade.getColorCool(),
        gluehen: facade.getGlowEnabled(),
        glueh_farbe: facade.getGlowColor(),
    };
    bind(colors_folder.addColor(color_params, 'farbe_hell'))
        .name('Hell (beleuchtet)')
        .onChange(v => facade.setColorHot(v));
    bind(colors_folder.addColor(color_params, 'farbe_dunkel'))
        .name('Dunkel (Schatten)')
        .onChange(v => facade.setColorCool(v));
    bind(colors_folder.add(color_params, 'gluehen'))
        .name('Glühen')
        .onChange(v => facade.setGlowEnabled(v));
    bind(colors_folder.addColor(color_params, 'glueh_farbe'))
        .name('Glühfarbe')
        .onChange(v => facade.setGlowColor(v));
    colors_folder.open();

    const noise_folder = gui.addFolder('Noise');
    const noise_params = {
        noise: facade.getNoiseEnabled(),
        noise_farbe_1: facade.getNoiseColor1(),
        noise_farbe_2: facade.getNoiseColor2(),
        bumping: facade.getBumpEnabled(),
    };
    bind(noise_folder.add(noise_params, 'noise'))
        .name('Aktiviert')
        .onChange(v => facade.setNoiseEnabled(v));
    bind(noise_folder.addColor(noise_params, 'noise_farbe_1'))
        .name('primäre Farbe')
        .onChange(v => facade.setNoiseColor1(v));
    bind(noise_folder.addColor(noise_params, 'noise_farbe_2'))
        .name('sekundäre Farbe')
        .onChange(v => facade.setNoiseColor2(v));
    bind(noise_folder.add(noise_params, 'bumping'))
        .name('Bumping')
        .onChange(v => facade.setBumpEnabled(v));

    const disp_params = {
        displacement: facade.getDisplacementEnabled(),
        staerke: facade.getDisplacementStrength(),
    };
    bind(noise_folder.add(disp_params, 'displacement'))
        .name('Displacement')
        .onChange(v => facade.setDisplacementEnabled(v));
    bind(noise_folder.add(disp_params, 'staerke', 0.0, 0.004, 0.0001))
        .name('Displacement Stärke')
        .onChange(v => facade.setDisplacementStrength(v));
    noise_folder.open();

    const ground_folder = gui.addFolder('Boden');
    const ground_params = {
        sichtbar: facade.getGroundVisible(),
        farbe: facade.getGroundColor(),
        hoehe: facade.getGroundHeight(),
    };
    bind(ground_folder.add(ground_params, 'sichtbar'))
        .name('sichtbar')
        .onChange(v => facade.setGroundVisible(v));
    bind(ground_folder.addColor(ground_params, 'farbe'))
        .name('Farbe')
        .onChange(v => facade.setGroundColor(v));
    bind(ground_folder.add(ground_params, 'hoehe', -10, 0, 0.01))
        .name('Höhe')
        .onChange(v => facade.setGroundHeight(v));
    ground_folder.open();

    const volcano_folder = gui.addFolder('Vulkan');
    const volcano_params = {
        sichtbar: facade.getVolcanoVisible(),
        disp_scale: facade.getVolcanoDispScale(),
        disp_freq: facade.getVolcanoDispFreq(),
        fels_farbe: facade.getVolcanoRockColor(),
        riss_farbe: facade.getVolcanoCrackColor(),
    };
    bind(volcano_folder.add(volcano_params, 'sichtbar'))
        .name('Sichtbar')
        .onChange(v => facade.setVolcanoVisible(v));
    bind(volcano_folder.add(volcano_params, 'disp_scale', 0.0, 6.0, 0.05))
        .name('Risstiefe')
        .onChange(v => facade.setVolcanoDispScale(v));
    bind(volcano_folder.add(volcano_params, 'disp_freq', 0.1, 2.0, 0.05))
        .name('Rissfrequenz')
        .onChange(v => facade.setVolcanoDispFreq(v));
    bind(volcano_folder.addColor(volcano_params, 'fels_farbe'))
        .name('Felsfarbe')
        .onChange(v => facade.setVolcanoRockColor(v));
    bind(volcano_folder.addColor(volcano_params, 'riss_farbe'))
        .name('Rissfarbe')
        .onChange(v => facade.setVolcanoCrackColor(v));
    volcano_folder.open();

    const pos_folder = gui.addFolder('Position (Vulkan + Lava)');
    const pos_params = {
        x: facade.getOffsetX(),
        y: facade.getOffsetY(),
        z: facade.getOffsetZ(),
    };
    bind(pos_folder.add(pos_params, 'x', -10, 10, 0.1))
        .name('X')
        .onChange(v => facade.setOffsetX(v));
    bind(pos_folder.add(pos_params, 'y', -6, 6, 0.1))
        .name('Y-Versatz')
        .onChange(v => facade.setOffsetY(v));
    bind(pos_folder.add(pos_params, 'z', -10, 10, 0.1))
        .name('Z')
        .onChange(v => facade.setOffsetZ(v));
    pos_folder.open();

    const bloom_folder = gui.addFolder('Bloom');
    const bloom_params = facade.getBloom();
    bind(bloom_folder.add(bloom_params, 'enabled'))
        .name('Aktiviert')
        .onChange(v => facade.setBloom({ enabled: v }));
    bind(bloom_folder.add(bloom_params, 'strength', 0.0, 4.0, 0.05))
        .name('Stärke')
        .onChange(v => facade.setBloom({ strength: v }));
    bind(bloom_folder.add(bloom_params, 'radius', 0.0, 1.5, 0.01))
        .name('Radius')
        .onChange(v => facade.setBloom({ radius: v }));
    bind(bloom_folder.add(bloom_params, 'threshold', 0.0, 1.0, 0.01))
        .name('Schwellenwert')
        .onChange(v => facade.setBloom({ threshold: v }));
    bloom_folder.open();

    function refresh_display() {
        root_params.paused = facade.isPaused();
        metaballs_vm.count = facade.getMetaballCount();
        metaballs_vm.isolation = facade.getMetaballIsolation();
        metaballs_vm.spread = facade.getMetaballSpread();
        metaballs_vm.speed_factor = facade.getMetaballSpeed();
        metaballs_vm.hoehe = facade.getMetaballHeight();
        metaballs_vm.flow_z_radius = facade.getFlowRadius();
        color_params.farbe_hell = facade.getColorHot();
        color_params.farbe_dunkel = facade.getColorCool();
        color_params.gluehen = facade.getGlowEnabled();
        color_params.glueh_farbe = facade.getGlowColor();
        noise_params.noise = facade.getNoiseEnabled();
        noise_params.noise_farbe_1 = facade.getNoiseColor1();
        noise_params.noise_farbe_2 = facade.getNoiseColor2();
        noise_params.bumping = facade.getBumpEnabled();
        disp_params.displacement = facade.getDisplacementEnabled();
        disp_params.staerke = facade.getDisplacementStrength();
        ground_params.sichtbar = facade.getGroundVisible();
        ground_params.farbe = facade.getGroundColor();
        ground_params.hoehe = facade.getGroundHeight();
        volcano_params.sichtbar = facade.getVolcanoVisible();
        volcano_params.disp_scale = facade.getVolcanoDispScale();
        volcano_params.disp_freq = facade.getVolcanoDispFreq();
        volcano_params.fels_farbe = facade.getVolcanoRockColor();
        volcano_params.riss_farbe = facade.getVolcanoCrackColor();
        pos_params.x = facade.getOffsetX();
        pos_params.y = facade.getOffsetY();
        pos_params.z = facade.getOffsetZ();
        Object.assign(bloom_params, facade.getBloom());

        all_controllers.forEach(c => c.updateDisplay());
    }

    const persistence_actions = {
        speichern: () => {
            const data = facade.getSnapshot();
            save_to_local_storage(data);
            download_json(data);
        },
        laden: () => upload_json(data => { facade.applySnapshot(data); refresh_display(); }),
        standard: () => { facade.resetToDefaults(); refresh_display(); },
    };

    const persistence_folder = gui.addFolder('Speichern / Laden');
    persistence_folder.add(persistence_actions, 'speichern').name('💾 Speichern');
    persistence_folder.add(persistence_actions, 'laden').name('📂 Laden');
    persistence_folder.add(persistence_actions, 'standard').name('🔄 Standard');
    persistence_folder.open();

    const saved = load_from_local_storage();
    if (saved) { facade.applySnapshot(saved); refresh_display(); }

    window.addEventListener('beforeunload', () => save_to_local_storage(facade.getSnapshot()));

    return gui;
}
