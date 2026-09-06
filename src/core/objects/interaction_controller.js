import * as THREE from 'three';
import { settings, registerTouch, stepInteractionAnimation, stepInteractionSmoke, resetTouchSession, isOnLava } from '../animation/interaction_animation.js';

export function createInteractionController(renderer, volcano_mesh) {
    const raycaster = new THREE.Raycaster();
    const pointer_ndc = new THREE.Vector2();
    let is_mouse_down = false;

    function updatePointerNdc(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer_ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer_ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    renderer.domElement.addEventListener('mousedown', event => {
        if (event.button !== 0) return;
        is_mouse_down = true;
        resetTouchSession();
        updatePointerNdc(event);
    });
    renderer.domElement.addEventListener('mousemove', updatePointerNdc);
    window.addEventListener('mouseup', () => { is_mouse_down = false; });

    return {
        // getMetaballWorldPositions/squeezeMetaballNear are thunks, only invoked on an actual hit.
        step(time, camera, getMetaballWorldPositions, squeezeMetaballNear) {
            if (settings.enabled) {
                raycaster.setFromCamera(pointer_ndc, camera);
                const hits = raycaster.intersectObject(volcano_mesh, false);
                const metaballs = hits.length > 0 ? getMetaballWorldPositions() : null;

                // Hovering (not just pressing) over a metaball hints that it's interactive, whether
                // or not the mouse is currently held down.
                renderer.domElement.style.cursor = metaballs && isOnLava(hits[0].point, metaballs) ? 'pointer' : '';

                if (is_mouse_down && hits.length > 0) {
                    const metaball_squeeze = registerTouch(time, hits[0].point, metaballs, camera.position);
                    if (metaball_squeeze) squeezeMetaballNear(metaball_squeeze);
                }
            } else {
                renderer.domElement.style.cursor = '';
            }
            return {
                touch_points: stepInteractionAnimation(time),
                smoke_bursts: stepInteractionSmoke(time),
            };
        },
        getEnabled: () => settings.enabled,
        setEnabled: value => {
            settings.enabled = value;
            if (!value) renderer.domElement.style.cursor = '';
        },
    };
}
