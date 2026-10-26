import { GUI } from 'dat.gui';
import { translate, onLanguageChange } from '../ui/language.js';

const GUI_WIDTH = 340;
const RIGHT_ALIGNED_PANEL_CLASS = 'a';
const PLAYBACK_SPEED_RANGE = { min: 0, max: 3, step: 0.05 };

export function createSceneGui(facade, { signal } = {}) {
    const gui = new GUI({ autoPlace: false, closed: false, width: GUI_WIDTH });
    gui.domElement.classList.add(RIGHT_ALIGNED_PANEL_CLASS);
    const container = document.createElement('div');
    container.className = 'dg ac';
    container.style.position = 'absolute';
    container.appendChild(gui.domElement);

    const all_controllers = [];
    const relabel_callbacks = [];

    function label(controller, message_key) {
        controller.name(translate(message_key));
        relabel_callbacks.push(() => controller.name(translate(message_key)));
        return controller;
    }

    function relabel() {
        GUI.TEXT_OPEN = translate('gui.open_controls');
        GUI.TEXT_CLOSED = translate('gui.close_controls');
        gui.closed = gui.closed;
        relabel_callbacks.forEach(callback => callback());
    }

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

        addPlaybackControls() {
            const parameters = liveParameters({
                paused: [facade.isPaused, facade.setPaused],
                speed: [facade.getSpeed, facade.setSpeed],
            });
            const { min, max, step } = PLAYBACK_SPEED_RANGE;
            bind(gui.add(parameters, 'paused'), 'gui.paused');
            bind(gui.add(parameters, 'speed', min, max, step), 'gui.metaballs.speed');
        },

        addFolder(message_key) {
            const folder = gui.addFolder(translate(message_key));
            relabel_callbacks.push(() => { folder.name = translate(message_key); });
            return folder;
        },

        finish() {
            const reset_actions = {
                reset() {
                    facade.resetToDefaults();
                    all_controllers.forEach(controller => controller.updateDisplay());
                },
            };
            label(gui.add(reset_actions, 'reset'), 'gui.reset.all');

            relabel();
            const stopRelabelling = onLanguageChange(relabel);
            signal?.addEventListener('abort', () => {
                stopRelabelling();
                gui.destroy();
                container.remove();
            }, { once: true });

            return { gui, container };
        },
    };
}
