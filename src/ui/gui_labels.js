import { GUI } from 'dat.gui';
import { translate, onLanguageChange } from './language.js';

export function createGuiLabels(gui) {
    const relabel_callbacks = [];

    function relabel() {
        GUI.TEXT_OPEN = translate('gui.open_controls');
        GUI.TEXT_CLOSED = translate('gui.close_controls');
        gui.closed = gui.closed;
        relabel_callbacks.forEach(callback => callback());
    }

    return {
        label(controller, message_key) {
            controller.name(translate(message_key));
            relabel_callbacks.push(() => controller.name(translate(message_key)));
            return controller;
        },

        addFolder(message_key) {
            const folder = gui.addFolder(translate(message_key));
            relabel_callbacks.push(() => { folder.name = translate(message_key); });
            return folder;
        },

        followLanguage() {
            relabel();
            return onLanguageChange(relabel);
        },
    };
}
