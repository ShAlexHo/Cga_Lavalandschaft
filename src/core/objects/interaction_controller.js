import * as THREE from 'three';
import { settings, registerTouch, stepInteractionAnimation, resetDwellTracking } from '../animation/interaction_animation.js';

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
        resetDwellTracking();
        updatePointerNdc(event);
    });
    renderer.domElement.addEventListener('mousemove', updatePointerNdc);
    window.addEventListener('mouseup', () => { is_mouse_down = false; });

    return {
        // getMetaballWorldPositions/removeMetaballNear are thunks, only invoked on an actual hit.
        step(time, camera, getMetaballWorldPositions, removeMetaballNear) {
            if (settings.enabled && is_mouse_down) {
                raycaster.setFromCamera(pointer_ndc, camera);
                const hits = raycaster.intersectObject(volcano_mesh, false);
                if (hits.length > 0) {
                    const metaball_to_remove = registerTouch(time, hits[0].point, getMetaballWorldPositions(), camera.position);
                    if (metaball_to_remove) removeMetaballNear(metaball_to_remove);
                }
            }
            return stepInteractionAnimation(time);
        },
        getEnabled: () => settings.enabled,
        setEnabled: value => { settings.enabled = value; },
    };
}
