import { GUI } from 'dat.gui';
import { save_to_local_storage, load_from_local_storage, download_json, upload_json } from './persistence.js';
import default_settings from './default_settings.json';

export function setup_gui(effect, material, settings, rebuild, ground, volcano, bloom_pass, volcano_material) {
    const gui = new GUI();
    const controllers = {};

    const effect_offset  = volcano ? effect.position.y - volcano.position.y : 0;
    const pos_params     = { x: 0, y: 0, z: 0 };
    let   metaball_y_off = 1.6;

    function apply_y(ground_y) {
        if (ground)  ground.position.y  = ground_y;
        if (volcano) {
            volcano.position.y = ground_y + pos_params.y;
            effect.position.y  = ground_y + pos_params.y + effect_offset + metaball_y_off;
        }
    }

    controllers.paused = gui.add(settings, 'paused').name('⏸ Pausiert');

    const metaballs_folder = gui.addFolder('Metaballs');
    controllers.count = metaballs_folder.add(settings, 'count', 1, settings.max_count, 1)
        .name('Limit')
        .onChange(() => rebuild(effect));
    controllers.isolation = metaballs_folder.add(effect, 'isolation', 1, 100, 1)
        .name('Threshold')
        .onChange(() => rebuild(effect));
    controllers.spread = metaballs_folder.add(settings, 'spread', 0.1, 2.0, 0.01)
        .name('Verteilung');
    controllers.speed_factor = metaballs_folder.add(settings, 'speed_factor', 0.0, 0.01, 0.0001)
        .name('Geschwindigkeit');
    controllers.metaball_hoehe = metaballs_folder.add({ hoehe: 1.6 }, 'hoehe', 0, 5, 0.05)
        .name('Höhe')
        .onChange(v => { metaball_y_off = v; apply_y(ground ? ground.position.y : 0); });
    controllers.flow_z_radius = metaballs_folder.add(settings, 'flow_z_radius', 0, 20, 0.1)
        .name('Steigung');
    metaballs_folder.open();

    const color_params = {
        farbe_hell: '#' + material.uniforms.u_color_hot.value.getHexString(),
        farbe_dunkel: '#' + material.uniforms.u_color_cool.value.getHexString(),
        gluehen: true,
        glueh_farbe: '#' + material.uniforms.u_glow_color.value.getHexString(),
    };

    const noise_params = {
        noise: true,
        noise_farbe_1: '#' + material.uniforms.u_noise_color_1.value.getHexString(),
        noise_farbe_2: '#' + material.uniforms.u_noise_color_2.value.getHexString(),
        bumping: true,
    };

    const colors_folder = gui.addFolder('Lavafarbe');
    controllers.farbe_hell = colors_folder.addColor(color_params, 'farbe_hell')
        .name('Hell (beleuchtet)')
        .onChange(value => material.uniforms.u_color_hot.value.set(value));
    controllers.farbe_dunkel = colors_folder.addColor(color_params, 'farbe_dunkel')
        .name('Dunkel (Schatten)')
        .onChange(value => material.uniforms.u_color_cool.value.set(value));
    controllers.gluehen = colors_folder.add(color_params, 'gluehen')
        .name('Glühen')
        .onChange(value => { material.uniforms.u_glow_enabled.value = value ? 1.0 : 0.0; });
    controllers.glueh_farbe = colors_folder.addColor(color_params, 'glueh_farbe')
        .name('Glühfarbe')
        .onChange(value => material.uniforms.u_glow_color.value.set(value));
    colors_folder.open();

    const noise_folder = gui.addFolder('Noise');
    controllers.noise = noise_folder.add(noise_params, 'noise')
        .name('Aktiviert')
        .onChange(value => { material.uniforms.u_noise_enabled.value = value ? 1.0 : 0.0; });
    controllers.noise_farbe_1 = noise_folder.addColor(noise_params, 'noise_farbe_1')
        .name('primäre Farbe')
        .onChange(value => material.uniforms.u_noise_color_1.value.set(value));
    controllers.noise_farbe_2 = noise_folder.addColor(noise_params, 'noise_farbe_2')
        .name('sekundäre Farbe')
        .onChange(value => material.uniforms.u_noise_color_2.value.set(value));
    controllers.bumping = noise_folder.add(noise_params, 'bumping')
        .name('Bumping')
        .onChange(value => { material.uniforms.u_bump_enabled.value = value ? 1.0 : 0.0; });
    const disp_params = { displacement: true, _last: material.uniforms.u_displacement.value };
    controllers.displacement = noise_folder.add(disp_params, 'displacement')
        .name('Displacement')
        .onChange(value => {
            if (value) {
                material.uniforms.u_displacement.value = disp_params._last;
            } else {
                disp_params._last = material.uniforms.u_displacement.value;
                material.uniforms.u_displacement.value = 0.0;
            }
        });
    controllers.displacement_staerke = noise_folder.add(material.uniforms.u_displacement, 'value', 0.0, 0.004, 0.0001)
        .name('Displacement Stärke');
    noise_folder.open();

    if (ground) {
        const ground_params = {
            sichtbar: ground.visible,
            farbe: '#' + ground.material.color.getHexString(),
            hoehe: ground.position.y,
        };

        const ground_folder = gui.addFolder('Boden');
        controllers.boden_sichtbar = ground_folder.add(ground_params, 'sichtbar')
            .name('sichtbar')
            .onChange(value => { ground.visible = value; });
        controllers.boden_farbe = ground_folder.addColor(ground_params, 'farbe')
            .name('Farbe')
            .onChange(value => {
                ground.material.color.set(value);
                ground.material.emissive.set(value).multiplyScalar(0.25);
            });
        controllers.boden_hoehe = ground_folder.add(ground_params, 'hoehe', -10, 0, 0.01)
            .name('Höhe')
            .onChange(value => apply_y(value));
        ground_folder.open();
    }

    if (volcano) {
        const volcano_params = {
            sichtbar:    true,
            fels_farbe:  volcano_material ? '#' + volcano_material.uniforms.u_rock_color.value.getHexString()  : '#afafaf',
            riss_farbe:  volcano_material ? '#' + volcano_material.uniforms.u_crack_color.value.getHexString() : '#010101',
        };

        const volcano_folder = gui.addFolder('Vulkan');
        controllers.vulkan_sichtbar = volcano_folder.add(volcano_params, 'sichtbar')
            .name('Sichtbar')
            .onChange(value => { volcano.visible = value; });
        if (volcano_material) {
            controllers.vulkan_disp_scale = volcano_folder.add(volcano_material.uniforms.u_disp_scale, 'value', 0.0, 6.0, 0.05)
                .name('Risstiefe');
            controllers.vulkan_disp_freq = volcano_folder.add(volcano_material.uniforms.u_disp_freq, 'value', 0.1, 2.0, 0.05)
                .name('Rissfrequenz');
            controllers.vulkan_fels_farbe = volcano_folder.addColor(volcano_params, 'fels_farbe')
                .name('Felsfarbe')
                .onChange(value => volcano_material.uniforms.u_rock_color.value.set(value));
            controllers.vulkan_riss_farbe = volcano_folder.addColor(volcano_params, 'riss_farbe')
                .name('Rissfarbe')
                .onChange(value => volcano_material.uniforms.u_crack_color.value.set(value));
        }
        volcano_folder.open();

        const pos_folder = gui.addFolder('Position (Vulkan + Lava)');
        controllers.pos_x = pos_folder.add(pos_params, 'x', -10, 10, 0.1)
            .name('X')
            .onChange(v => {
                volcano.position.x = v;
                effect.position.x  = v;
            });
        controllers.pos_y = pos_folder.add(pos_params, 'y', -6, 6, 0.1)
            .name('Y-Versatz')
            .onChange(() => apply_y(ground ? ground.position.y : 0));
        controllers.pos_z = pos_folder.add(pos_params, 'z', -10, 10, 0.1)
            .name('Z')
            .onChange(v => {
                volcano.position.z = v;
                effect.position.z  = v;
            });
        pos_folder.open();
    }

    apply_y(ground ? ground.position.y : 0);

    if (bloom_pass) {
        const bloom_folder = gui.addFolder('Bloom');
        controllers.bloom_enabled = bloom_folder.add(bloom_pass, 'enabled').name('Aktiviert');
        controllers.bloom_strength = bloom_folder.add(bloom_pass, 'strength', 0.0, 4.0, 0.05).name('Stärke');
        controllers.bloom_radius = bloom_folder.add(bloom_pass, 'radius', 0.0, 1.5, 0.01).name('Radius');
        controllers.bloom_threshold = bloom_folder.add(bloom_pass, 'threshold', 0.0, 1.0, 0.01).name('Schwellenwert');
        bloom_folder.open();
    }

    function collect_settings() {
        const data = {};
        for (const [key, controller] of Object.entries(controllers)) {
            data[key] = controller.getValue();
        }
        return data;
    }

    function apply_settings(data) {
        for (const [key, value] of Object.entries(data)) {
            if (controllers[key]) controllers[key].setValue(value);
        }
    }

    const persistence_actions = {
        speichern: () => {
            const data = collect_settings();
            save_to_local_storage(data);
            download_json(data);
        },
        laden: () => {
            upload_json(data => apply_settings(data));
        },
        standard: () => apply_settings(default_settings),
    };

    const persistence_folder = gui.addFolder('Speichern / Laden');
    persistence_folder.add(persistence_actions, 'speichern').name('💾 Speichern');
    persistence_folder.add(persistence_actions, 'laden').name('📂 Laden');
    persistence_folder.add(persistence_actions, 'standard').name('🔄 Standard');
    persistence_folder.open();

    const saved = load_from_local_storage();
    if (saved) apply_settings(saved);

    window.addEventListener('beforeunload', () => save_to_local_storage(collect_settings()));

    return gui;
}
