import { GUI } from 'dat.gui';

export function setup_gui(effect, material, metaballs, rebuild) {
    const gui = new GUI();

    const marching_cubes_folder = gui.addFolder('Marching Cubes');
    marching_cubes_folder.add(effect, 'isolation', 1, 300, 1)
        .name('Isolation')
        .onChange(() => rebuild(effect));
    marching_cubes_folder.open();

    const metaballs_folder = gui.addFolder('Metaballs');
    metaballs.forEach((ball, index) => {
        const ball_folder = metaballs_folder.addFolder(`Ball ${index + 1}`);
        ball_folder.add(ball, 'strength', 0.1, 3.0, 0.01)
            .name('Stärke')
            .onChange(() => rebuild(effect));
        ball_folder.add(ball, 'subtract', 1, 30, 0.5)
            .name('Radius')
            .onChange(() => rebuild(effect));
    });
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
