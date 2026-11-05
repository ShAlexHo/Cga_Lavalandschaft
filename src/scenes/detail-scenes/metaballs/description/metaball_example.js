import { fieldValue } from './metaball_field_contour.js';

export const THRESHOLD = 0.7;
export const FIRST_BALL = { x: 0, y: 0 };
export const SECOND_BALL = { x: 3, y: 0 };
export const TEST_POINT = { x: 1.5, y: 0 };
export const SINGLE_BALL = [FIRST_BALL];
export const TWO_BALLS = [FIRST_BALL, SECOND_BALL];
export const FIRST_DISTANCE = Math.hypot(TEST_POINT.x - FIRST_BALL.x, TEST_POINT.y - FIRST_BALL.y);
export const SECOND_DISTANCE = Math.hypot(TEST_POINT.x - SECOND_BALL.x, TEST_POINT.y - SECOND_BALL.y);
export const SINGLE_BALL_POTENTIAL = fieldValue(TEST_POINT, SINGLE_BALL);
export const TWO_BALLS_POTENTIAL = fieldValue(TEST_POINT, TWO_BALLS);
