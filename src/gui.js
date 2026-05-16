import { GUI } from 'dat.gui';

export function setup_gui(effect, material, settings, rebuild) {
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
    metaballs_folder.open();

    const color_params = {
        farbe_hell:   '#' + material.uniforms.u_color_hot.value.getHexString(),
        farbe_dunkel: '#' + material.uniforms.u_color_cool.value.getHexString(),
    };

    const colors_folder = gui.addFolder('Farben');
    colors_folder.addColor(color_params, 'farbe_hell')
        .name('Hell (beleuchtet)')
        .onChange(value => material.uniforms.u_color_hot.value.set(value));
    colors_folder.addColor(color_params, 'farbe_dunkel')
        .name('Dunkel (Schatten)')
        .onChange(value => material.uniforms.u_color_cool.value.set(value));
    colors_folder.open();

    return gui;
}
