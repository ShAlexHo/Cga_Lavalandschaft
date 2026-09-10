const FPS_UPDATE_INTERVAL_MS = 500;

export function createFpsMeter() {
    const element = document.createElement('div');
    element.style.position = 'fixed';
    element.style.top = '8px';
    element.style.left = '8px';
    element.style.padding = '2px 6px';
    element.style.background = 'rgba(0, 0, 0, 0.5)';
    element.style.color = '#0f0';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '14px';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    document.body.appendChild(element);

    let frame_count = 0;
    let last_update_time = performance.now();

    return {
        tick() {
            frame_count++;
            const now = performance.now();
            const elapsed = now - last_update_time;
            if (elapsed >= FPS_UPDATE_INTERVAL_MS) {
                const fps = (frame_count * 1000) / elapsed;
                element.textContent = `${fps.toFixed(0)} FPS`;
                frame_count = 0;
                last_update_time = now;
            }
        },
    };
}
