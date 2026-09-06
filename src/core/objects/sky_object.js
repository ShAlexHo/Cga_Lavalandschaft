import { toHexColor } from '../rendering/color_utils.js';

export function createSky(scene) {
    return {
        getColor: () => toHexColor(scene.background),
        setColor: value => scene.background.set(value),
    };
}
