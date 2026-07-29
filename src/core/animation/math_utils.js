export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function smoothstep(edge0, edge1, x) {
    const normalized = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return normalized * normalized * (3 - 2 * normalized);
}
