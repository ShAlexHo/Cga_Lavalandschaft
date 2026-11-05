import { GUI } from 'dat.gui';
import { createGuiLabels } from '../../../ui/gui_labels.js';

const GUI_WIDTH = 340;
const RIGHT_ALIGNED_PANEL_CLASS = 'a';
const WIDE_LABEL_CLASS = 'wide-label';
const PLAYBACK_SPEED_RANGE = { min: 0, max: 3, step: 0.05 };

export function createSceneGui(facade, { signal } = {}) {
    const gui = new GUI({ autoPlace: false, closed: false, width: GUI_WIDTH });
    gui.domElement.classList.add(RIGHT_ALIGNED_PANEL_CLASS);
    const container = document.createElement('div');
    container.className = 'dg ac';
    container.style.position = 'absolute';
    container.appendChild(gui.domElement);

    const all_controllers = [];
    const { label, addFolder, followLanguage } = createGuiLabels(gui);

    function liveParameters(accessors) {
        const parameters = {};
        for (const [key, [get, set]] of Object.entries(accessors)) {
            Object.defineProperty(parameters, key, { get, set, enumerable: true });
        }
        return parameters;
    }

    function bind(controller, message_key) {
        all_controllers.push(controller);
        return label(controller, message_key);
    }

    return {
        gui,
        liveParameters,
        bind,

        addPlaybackControls({ speed_range = PLAYBACK_SPEED_RANGE } = {}) {
            const parameters = liveParameters({
                paused: [facade.isPaused, facade.setPaused],
                speed: [facade.getSpeed, facade.setSpeed],
            });
            const { min, max, step } = speed_range;
            bind(gui.add(parameters, 'paused'), 'gui.paused');
            bind(gui.add(parameters, 'speed', min, max, step), 'gui.speed');
        },

        addFolder(message_key, { open = true } = {}) {
            const folder = addFolder(message_key);
            if (open) folder.open();
            return folder;
        },

        addSlider(folder, parameters, key, { min, max, step }, message_key) {
            return bind(folder.add(parameters, key, min, max, step), message_key);
        },

        widenLabel(controller) {
            controller.domElement.closest('li').classList.add(WIDE_LABEL_CLASS);
            return controller;
        },

        finish() {
            const reset_actions = {
                reset() {
                    facade.resetToDefaults();
                    all_controllers.forEach(controller => controller.updateDisplay());
                },
            };
            label(gui.add(reset_actions, 'reset'), 'gui.reset.all');

            const stopRelabelling = followLanguage();
            signal?.addEventListener('abort', () => {
                stopRelabelling();
                gui.destroy();
                container.remove();
            }, { once: true });

            return { gui, container };
        },
    };
}
