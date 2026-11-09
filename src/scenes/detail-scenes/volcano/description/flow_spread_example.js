export const SPREAD_BALL_COUNT = 6;
export const INNER_RING_RADIUS = 2;
export const OUTER_RING_RADIUS = 6;
export const BALL_RADIUS = 1.2;
const FIELD_REACH = 3;
const THRESHOLD = 1 / BALL_RADIUS ** 2 - 1 / FIELD_REACH ** 2;

export function ringBalls(radius, count = SPREAD_BALL_COUNT) {
    return Array.from({ length: count }, (_, i) => {
        const angle = (2 * Math.PI * i) / count;
        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    });
}

export function fieldValue(point, balls) {
    return balls.reduce((sum, ball) => {
        const distance_squared = Math.max((point.x - ball.x) ** 2 + (point.y - ball.y) ** 2, 1e-6);
        return sum + Math.max(0, 1 / distance_squared - 1 / FIELD_REACH ** 2);
    }, 0);
}

export function isInside(point, balls) {
    return fieldValue(point, balls) >= THRESHOLD;
}

function edgePoint(corner_a, corner_b) {
    const fraction = (THRESHOLD - corner_a.value) / (corner_b.value - corner_a.value);
    return { x: corner_a.x + (corner_b.x - corner_a.x) * fraction, y: corner_a.y + (corner_b.y - corner_a.y) * fraction };
}

export function contourSegments(balls, extent, cell_size) {
    const cell_count = Math.round((2 * extent) / cell_size);
    const valueAt = (i, j) => {
        const x = -extent + i * cell_size;
        const y = -extent + j * cell_size;
        return { x, y, value: fieldValue({ x, y }, balls) };
    };
    const segments = [];
    for (let i = 0; i < cell_count; i++) {
        for (let j = 0; j < cell_count; j++) {
            const corners = [valueAt(i, j), valueAt(i + 1, j), valueAt(i + 1, j + 1), valueAt(i, j + 1)];
            const crossings = [];
            for (let k = 0; k < 4; k++) {
                const corner_a = corners[k];
                const corner_b = corners[(k + 1) % 4];
                if ((corner_a.value >= THRESHOLD) !== (corner_b.value >= THRESHOLD)) crossings.push(edgePoint(corner_a, corner_b));
            }
            for (let k = 0; k + 1 < crossings.length; k += 2) segments.push({ start: crossings[k], end: crossings[k + 1] });
        }
    }
    return segments;
}
