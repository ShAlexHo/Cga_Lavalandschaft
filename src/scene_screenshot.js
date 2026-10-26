import { reactive } from 'vue';

const SCREENSHOT_TYPE = 'image/jpeg';
const SCREENSHOT_QUALITY = 0.9;

export const scene_screenshots = reactive({});

export function captureCanvas(canvas) {
    return canvas.toDataURL(SCREENSHOT_TYPE, SCREENSHOT_QUALITY);
}
