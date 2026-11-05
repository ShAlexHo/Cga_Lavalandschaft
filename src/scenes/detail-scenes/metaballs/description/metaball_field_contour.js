const CONTOUR_SEGMENTS = 240;
const CONTOUR_MAX_RADIUS = 12;
const CONTOUR_MARCH_STEP = 0.01;
const CONTOUR_BISECTION_STEPS = 30;

export function fieldValue(point, balls) {
    return balls.reduce((sum, ball) => sum + 1 / Math.hypot(point.x - ball.x, point.y - ball.y), 0);
}

function centroid(balls) {
    return {
        x: balls.reduce((sum, ball) => sum + ball.x, 0) / balls.length,
        y: balls.reduce((sum, ball) => sum + ball.y, 0) / balls.length,
    };
}

function boundaryAlongRay(center, direction, balls, threshold) {
    const pointAt = distance => ({ x: center.x + direction.x * distance, y: center.y + direction.y * distance });
    let outside_distance = CONTOUR_MAX_RADIUS;
    while (outside_distance > 0 && fieldValue(pointAt(outside_distance - CONTOUR_MARCH_STEP), balls) < threshold) {
        outside_distance -= CONTOUR_MARCH_STEP;
    }
    let inside_distance = outside_distance - CONTOUR_MARCH_STEP;
    for (let i = 0; i < CONTOUR_BISECTION_STEPS; i++) {
        const middle_distance = (inside_distance + outside_distance) / 2;
        if (fieldValue(pointAt(middle_distance), balls) >= threshold) inside_distance = middle_distance;
        else outside_distance = middle_distance;
    }
    return pointAt((inside_distance + outside_distance) / 2);
}

export function isoContour(balls, threshold) {
    const center = centroid(balls);
    return Array.from({ length: CONTOUR_SEGMENTS }, (_, i) => {
        const angle = (2 * Math.PI * i) / CONTOUR_SEGMENTS;
        return boundaryAlongRay(center, { x: Math.cos(angle), y: Math.sin(angle) }, balls, threshold);
    });
}
