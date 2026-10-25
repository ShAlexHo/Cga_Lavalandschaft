import * as THREE from 'three';
import { settings, registerTouch, stepInteractionAnimation, stepInteractionSmoke, resetTouchSession, isOnLava } from '../animation/interaction_animation.js';
import { random } from '../random.js';
import { INTERACTION_AUTO_TOUCH_MIN_INTERVAL, INTERACTION_AUTO_TOUCH_MAX_INTERVAL, INTERACTION_AUTO_TOUCH_HOLD_DURATION } from '../config.js';

function randomAutoTouchInterval() {
    return random(INTERACTION_AUTO_TOUCH_MIN_INTERVAL, INTERACTION_AUTO_TOUCH_MAX_INTERVAL);
}

function applyTouch(time, point, metaballs, camera_position, squeezeMetaballNear) {
    const metaball_squeeze = registerTouch(time, point, metaballs, camera_position);
    if (metaball_squeeze) squeezeMetaballNear(metaball_squeeze);
}

export function createInteractionController(renderer, volcano_mesh, { signal } = {}) {
    const raycaster = new THREE.Raycaster();
    const pointer_ndc = new THREE.Vector2();
    let is_mouse_down = false;
    let was_enabled = settings.enabled;
    let seconds_until_auto_touch = randomAutoTouchInterval();
    let auto_touch_active = false;
    let auto_touch_elapsed = 0;
    let auto_touch_target = null;

    function updatePointerNdc(event) {
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer_ndc.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer_ndc.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    }

    renderer.domElement.addEventListener('mousedown', event => {
        if (event.button !== 0) return;
        is_mouse_down = true;
        resetTouchSession();
        updatePointerNdc(event);
    });
    renderer.domElement.addEventListener('mousemove', updatePointerNdc);
    window.addEventListener('mouseup', () => { is_mouse_down = false; }, { signal });

    return {
        step(time, camera, getMetaballWorldPositions, squeezeMetaballNear, real_delta_seconds) {
            if (!settings.enabled && was_enabled) {
                seconds_until_auto_touch = randomAutoTouchInterval();
                auto_touch_active = false;
            }
            was_enabled = settings.enabled;

            let is_touching_lava = false;
            if (settings.enabled) {
                raycaster.setFromCamera(pointer_ndc, camera);
                const hits = raycaster.intersectObject(volcano_mesh, false);
                const metaballs = hits.length > 0 ? getMetaballWorldPositions() : null;
                const on_lava = Boolean(metaballs && isOnLava(hits[0].point, metaballs));

                renderer.domElement.style.cursor = on_lava ? 'pointer' : '';

                if (is_mouse_down && hits.length > 0) {
                    applyTouch(time, hits[0].point, metaballs, camera.position, squeezeMetaballNear);
                    is_touching_lava = on_lava;
                }
            } else {
                renderer.domElement.style.cursor = '';

                if (!auto_touch_active) {
                    seconds_until_auto_touch -= real_delta_seconds;
                    if (seconds_until_auto_touch <= 0) {
                        const metaballs = getMetaballWorldPositions();
                        if (metaballs.length > 0) {
                            auto_touch_target = metaballs[Math.floor(random(0, metaballs.length))];
                            resetTouchSession();
                            auto_touch_active = true;
                            auto_touch_elapsed = 0;
                        } else {
                            seconds_until_auto_touch = randomAutoTouchInterval();
                        }
                    }
                }

                if (auto_touch_active) {
                    applyTouch(time, auto_touch_target, getMetaballWorldPositions(), camera.position, squeezeMetaballNear);
                    is_touching_lava = true;

                    auto_touch_elapsed += real_delta_seconds;
                    if (auto_touch_elapsed >= INTERACTION_AUTO_TOUCH_HOLD_DURATION) {
                        auto_touch_active = false;
                        seconds_until_auto_touch = randomAutoTouchInterval();
                    }
                }
            }
            return {
                touch_points: stepInteractionAnimation(time),
                smoke_bursts: stepInteractionSmoke(time),
                is_touching_lava,
            };
        },
        getEnabled: () => settings.enabled,
        setEnabled(value) {
            settings.enabled = value;
            if (!value) renderer.domElement.style.cursor = '';
        },
    };
}
