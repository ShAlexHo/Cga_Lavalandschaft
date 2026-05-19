import { GUI } from 'dat.gui';

export function setup_gui(effect, material, settings, rebuild, ground) {
    const gui = new GUI();

    const metaballs_folder = gui.addFolder('Metaballs');
    metaballs_folder.add(settings, 'count', 1, settings.max_count, 1)
        .name('Anzahl')
        .onChange(() => rebuild(effect));
    metaballs_folder.add(effect, 'isolation', 1, 100, 1)
        .name('Threshold')
        .onChange(() => rebuild(effect));
    metaballs_folder.add(settings, 'spread', 0.1, 2.0, 0.01)
        .name('Verteilung');
    metaballs_folder.add(settings, 'speed_factor', 0.0, 4.0, 0.01)
        .name('Geschwindigkeit');
    metaballs_folder.add(settings, 'agitation', 0.0, 5.0, 0.01)
        .name('Agitation');
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
    noise_folder.open();

    if (ground) {
        const ground_params = {
            sichtbar: ground.visible,
            farbe: '#' + ground.material.color.getHexString(),
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
        ground_folder.open();
    }

    return gui;
}
