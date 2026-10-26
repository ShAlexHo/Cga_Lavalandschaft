export function toGlslFloat(value) {
    return Number.isInteger(value) ? value.toFixed(1) : String(value);
}
