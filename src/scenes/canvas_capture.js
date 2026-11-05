const CAPTURE_TYPE = 'image/jpeg';
const CAPTURE_QUALITY = 0.9;

export function captureCanvas(canvas) {
    return canvas.toDataURL(CAPTURE_TYPE, CAPTURE_QUALITY);
}
