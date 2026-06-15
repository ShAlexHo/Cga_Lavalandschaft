import { GUI } from 'dat.gui';

export function setup_gui(effect, material, settings, rebuild, ground) {
    const gui = new GUI();

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
        ground_folder.add(ground_params, 'hoehe', -2.5, -1.0, 0.01)
            .name('Höhe')
            .onChange(value => { ground.position.y = value; });
        ground_folder.open();
    }

    // YouTube Hintergrund-Player (Video als Audioquelle)
    try {
        let ytPlayer = null;
        let ytReady = false;
        const videoId = 'kTpglKDyn4s';

        function loadYouTubeAPI() {
            return new Promise((resolve, reject) => {
                if (window.YT && window.YT.Player) return resolve(window.YT);
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.async = true;
                document.head.appendChild(tag);
                const prev = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = function() {
                    if (prev) try { prev(); } catch (e) {}
                    resolve(window.YT);
                };
                setTimeout(() => reject(new Error('YT API load timeout')), 10000);
            });
        }

        function ensurePlayer() {
            if (ytPlayer) return Promise.resolve(ytPlayer);
            return loadYouTubeAPI().then(YT => {
                const div = document.createElement('div');
                div.id = 'yt-hidden-player';
                div.style.width = '1px'; div.style.height = '1px'; div.style.position = 'fixed'; div.style.left = '0'; div.style.top = '0'; div.style.opacity = '0'; div.style.pointerEvents = 'none';
                document.body.appendChild(div);
                return new Promise((resolve) => {
                    ytPlayer = new YT.Player(div.id, {
                        height: '1', width: '1', videoId: videoId,
                        playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, loop: 1, playlist: videoId },
                        events: { onReady: () => { ytReady = true; resolve(ytPlayer); } }
                    });
                });
            });
        }

        function playYouTube() {
            ensurePlayer().then(p => { try { p.playVideo(); } catch (e) {} });
        }
        function pauseYouTube() {
            if (ytPlayer) try { ytPlayer.pauseVideo(); } catch (e) {}
        }

        const yt_folder = gui.addFolder('Hintergrund Sound');
        const yt_ctrl = { play: () => playYouTube(), pause: () => pauseYouTube() };
        yt_folder.add(yt_ctrl, 'play').name('▶ YouTube Play');
        yt_folder.add(yt_ctrl, 'pause').name('⏸ YouTube Pause');
        yt_folder.open();
    } catch (e) {}

    return gui;
}
