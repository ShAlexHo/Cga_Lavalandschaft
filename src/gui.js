import { GUI } from 'dat.gui';

export function setup_gui(effect, material, settings, rebuild, ground, volcano) {
    const gui = new GUI();

    const effect_offset  = volcano ? effect.position.y - volcano.position.y : 0;
    const pos_params     = { x: 0, y: 0, z: 0 };
    let   metaball_y_off = 0;

    function apply_y(ground_y) {
        if (ground)  ground.position.y  = ground_y;
        if (volcano) {
            volcano.position.y = ground_y + pos_params.y;
            effect.position.y  = ground_y + pos_params.y + effect_offset + metaball_y_off;
        }
    }

    gui.add(settings, 'paused').name('⏸ Pausiert');

    const metaballs_folder = gui.addFolder('Metaballs');
    metaballs_folder.add(settings, 'count', 1, settings.max_count, 1)
        .name('Anzahl')
        .onChange(() => rebuild(effect));
    metaballs_folder.add(effect, 'isolation', 1, 100, 1)
        .name('Threshold')
        .onChange(() => rebuild(effect));
    metaballs_folder.add(settings, 'spread', 0.1, 2.0, 0.01)
        .name('Verteilung');
    metaballs_folder.add(settings, 'speed_factor', 0.0, 2.0, 0.01)
        .name('Geschwindigkeit');
    metaballs_folder.add({ hoehe: 0 }, 'hoehe', 0, 5, 0.05)
        .name('Höhe')
        .onChange(v => { metaball_y_off = v; apply_y(ground ? ground.position.y : 0); });
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
    colors_folder.addColor(color_params, 'farbe_hell')
        .name('Hell (beleuchtet)')
        .onChange(value => material.uniforms.u_color_hot.value.set(value));
    colors_folder.addColor(color_params, 'farbe_dunkel')
        .name('Dunkel (Schatten)')
        .onChange(value => material.uniforms.u_color_cool.value.set(value));
    colors_folder.add(color_params, 'gluehen')
        .name('Glühen')
        .onChange(value => { material.uniforms.u_glow_enabled.value = value ? 1.0 : 0.0; });
    colors_folder.addColor(color_params, 'glueh_farbe')
        .name('Glühfarbe')
        .onChange(value => material.uniforms.u_glow_color.value.set(value));
    colors_folder.open();

    const noise_folder = gui.addFolder('Noise');
    noise_folder.add(noise_params, 'noise')
        .name('Aktiviert')
        .onChange(value => { material.uniforms.u_noise_enabled.value = value ? 1.0 : 0.0; });
    noise_folder.addColor(noise_params, 'noise_farbe_1')
        .name('primäre Farbe')
        .onChange(value => material.uniforms.u_noise_color_1.value.set(value));
    noise_folder.addColor(noise_params, 'noise_farbe_2')
        .name('sekundäre Farbe')
        .onChange(value => material.uniforms.u_noise_color_2.value.set(value));
    noise_folder.add(noise_params, 'bumping')
        .name('Bumping')
        .onChange(value => { material.uniforms.u_bump_enabled.value = value ? 1.0 : 0.0; });
    const disp_params = { displacement: true, _last: material.uniforms.u_displacement.value };
    noise_folder.add(disp_params, 'displacement')
        .name('Displacement')
        .onChange(value => {
            if (value) {
                material.uniforms.u_displacement.value = disp_params._last;
            } else {
                disp_params._last = material.uniforms.u_displacement.value;
                material.uniforms.u_displacement.value = 0.0;
            }
        });
    noise_folder.add(material.uniforms.u_displacement, 'value', 0.0, 0.004, 0.0001)
        .name('Displacement Stärke');
    noise_folder.open();

    if (ground) {
        const ground_params = {
            sichtbar: ground.visible,
            farbe: '#' + ground.material.color.getHexString(),
            hoehe: ground.position.y,
        };

        const ground_folder = gui.addFolder('Boden');
        ground_folder.add(ground_params, 'sichtbar')
            .name('sichtbar')
            .onChange(value => { ground.visible = value; });
        ground_folder.addColor(ground_params, 'farbe')
            .name('Farbe')
            .onChange(value => {
                ground.material.color.set(value);
                ground.material.emissive.set(value).multiplyScalar(0.25);
            });
        ground_folder.add(ground_params, 'hoehe', -10, 0, 0.01)
            .name('Höhe')
            .onChange(value => apply_y(value));
        ground_folder.open();
    }

    if (volcano) {
        const volcano_folder = gui.addFolder('Vulkan');
        volcano_folder.add({ sichtbar: true }, 'sichtbar')
            .name('Sichtbar')
            .onChange(value => { volcano.visible = value; });
        volcano_folder.open();

        const pos_folder = gui.addFolder('Position (Vulkan + Lava)');
        pos_folder.add(pos_params, 'x', -10, 10, 0.1)
            .name('X')
            .onChange(v => {
                volcano.position.x = v;
                effect.position.x  = v;
            });
        pos_folder.add(pos_params, 'y', -6, 6, 0.1)
            .name('Y-Versatz')
            .onChange(() => apply_y(ground ? ground.position.y : 0));
        pos_folder.add(pos_params, 'z', -10, 10, 0.1)
            .name('Z')
            .onChange(v => {
                volcano.position.z = v;
                effect.position.z  = v;
            });
        pos_folder.open();
    }

    apply_y(ground ? ground.position.y : 0);

    return gui;
}
