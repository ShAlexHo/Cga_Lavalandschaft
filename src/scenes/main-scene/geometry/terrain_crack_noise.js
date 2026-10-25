function toFloat32(value) {
    return Math.fround(value);
}

function floatAdd(left, right) {
    return toFloat32(left + right);
}

function floatSubtract(left, right) {
    return toFloat32(left - right);
}

function floatMultiply(left, right) {
    return toFloat32(left * right);
}

function floatFloor(value) {
    return toFloat32(Math.floor(value));
}

function floatAbs(value) {
    return toFloat32(Math.abs(value));
}

function floatMin(left, right) {
    return toFloat32(Math.min(left, right));
}

function floatMax(left, right) {
    return toFloat32(Math.max(left, right));
}

function floatStep(edge, x) {
    return x >= edge ? toFloat32(1.0) : toFloat32(0.0);
}

function selfDot(x, y, z) {
    return floatAdd(floatAdd(floatMultiply(x, x), floatMultiply(y, y)), floatMultiply(z, z));
}

const SKEW_X = toFloat32(1.0 / 6.0);
const SKEW_Y = toFloat32(1.0 / 3.0);
const ONE_SEVENTH = toFloat32(0.142857142857);

function modulo289(value) {
    return floatSubtract(value, floatMultiply(floatFloor(floatMultiply(value, toFloat32(1.0 / 289.0))), toFloat32(289.0)));
}

function permute(value) {
    return modulo289(floatMultiply(floatAdd(floatMultiply(value, toFloat32(34.0)), toFloat32(10.0)), value));
}

function taylorInverseSqrt(value) {
    return floatSubtract(toFloat32(1.79284291400159), floatMultiply(toFloat32(0.85373472095314), value));
}

function gradientIndexOf(permutation, gradient_scale_z) {
    return floatSubtract(permutation, floatMultiply(toFloat32(49.0), floatFloor(floatMultiply(permutation, floatMultiply(gradient_scale_z, gradient_scale_z)))));
}

function simplexNoise(x, y, z) {
    x = toFloat32(x);
    y = toFloat32(y);
    z = toFloat32(z);

    const skew_offset = floatMultiply(floatAdd(floatAdd(x, y), z), SKEW_Y);
    const lattice_point_x = floatFloor(floatAdd(x, skew_offset));
    const lattice_point_y = floatFloor(floatAdd(y, skew_offset));
    const lattice_point_z = floatFloor(floatAdd(z, skew_offset));

    const unskew_offset = floatMultiply(floatAdd(floatAdd(lattice_point_x, lattice_point_y), lattice_point_z), SKEW_X);
    const offset_0_x = floatAdd(floatSubtract(x, lattice_point_x), unskew_offset);
    const offset_0_y = floatAdd(floatSubtract(y, lattice_point_y), unskew_offset);
    const offset_0_z = floatAdd(floatSubtract(z, lattice_point_z), unskew_offset);

    const greater_mask_x = floatStep(offset_0_y, offset_0_x);
    const greater_mask_y = floatStep(offset_0_z, offset_0_y);
    const greater_mask_z = floatStep(offset_0_x, offset_0_z);
    const lesser_mask_x = floatSubtract(toFloat32(1.0), greater_mask_x);
    const lesser_mask_y = floatSubtract(toFloat32(1.0), greater_mask_y);
    const lesser_mask_z = floatSubtract(toFloat32(1.0), greater_mask_z);

    const corner_offset_1_x = floatMin(greater_mask_x, lesser_mask_z);
    const corner_offset_1_y = floatMin(greater_mask_y, lesser_mask_x);
    const corner_offset_1_z = floatMin(greater_mask_z, lesser_mask_y);
    const corner_offset_2_x = floatMax(greater_mask_x, lesser_mask_z);
    const corner_offset_2_y = floatMax(greater_mask_y, lesser_mask_x);
    const corner_offset_2_z = floatMax(greater_mask_z, lesser_mask_y);

    const offset_1_x = floatAdd(floatSubtract(offset_0_x, corner_offset_1_x), SKEW_X);
    const offset_1_y = floatAdd(floatSubtract(offset_0_y, corner_offset_1_y), SKEW_X);
    const offset_1_z = floatAdd(floatSubtract(offset_0_z, corner_offset_1_z), SKEW_X);
    const offset_2_x = floatAdd(floatSubtract(offset_0_x, corner_offset_2_x), SKEW_Y);
    const offset_2_y = floatAdd(floatSubtract(offset_0_y, corner_offset_2_y), SKEW_Y);
    const offset_2_z = floatAdd(floatSubtract(offset_0_z, corner_offset_2_z), SKEW_Y);
    const offset_3_x = floatSubtract(offset_0_x, toFloat32(0.5));
    const offset_3_y = floatSubtract(offset_0_y, toFloat32(0.5));
    const offset_3_z = floatSubtract(offset_0_z, toFloat32(0.5));

    const lattice_point_modulo_x = modulo289(lattice_point_x);
    const lattice_point_modulo_y = modulo289(lattice_point_y);
    const lattice_point_modulo_z = modulo289(lattice_point_z);

    let permutation_0 = permute(floatAdd(lattice_point_modulo_z, toFloat32(0.0)));
    let permutation_1 = permute(floatAdd(lattice_point_modulo_z, corner_offset_1_z));
    let permutation_2 = permute(floatAdd(lattice_point_modulo_z, corner_offset_2_z));
    let permutation_3 = permute(floatAdd(lattice_point_modulo_z, toFloat32(1.0)));

    permutation_0 = permute(floatAdd(floatAdd(permutation_0, lattice_point_modulo_y), toFloat32(0.0)));
    permutation_1 = permute(floatAdd(floatAdd(permutation_1, lattice_point_modulo_y), corner_offset_1_y));
    permutation_2 = permute(floatAdd(floatAdd(permutation_2, lattice_point_modulo_y), corner_offset_2_y));
    permutation_3 = permute(floatAdd(floatAdd(permutation_3, lattice_point_modulo_y), toFloat32(1.0)));

    permutation_0 = permute(floatAdd(floatAdd(permutation_0, lattice_point_modulo_x), toFloat32(0.0)));
    permutation_1 = permute(floatAdd(floatAdd(permutation_1, lattice_point_modulo_x), corner_offset_1_x));
    permutation_2 = permute(floatAdd(floatAdd(permutation_2, lattice_point_modulo_x), corner_offset_2_x));
    permutation_3 = permute(floatAdd(floatAdd(permutation_3, lattice_point_modulo_x), toFloat32(1.0)));

    const gradient_scale_x = floatSubtract(floatMultiply(ONE_SEVENTH, toFloat32(2.0)), toFloat32(0.0));
    const gradient_scale_y = floatSubtract(floatMultiply(ONE_SEVENTH, toFloat32(0.5)), toFloat32(1.0));
    const gradient_scale_z = floatSubtract(floatMultiply(ONE_SEVENTH, toFloat32(1.0)), toFloat32(0.0));

    const gradient_index_0 = gradientIndexOf(permutation_0, gradient_scale_z);
    const gradient_index_1 = gradientIndexOf(permutation_1, gradient_scale_z);
    const gradient_index_2 = gradientIndexOf(permutation_2, gradient_scale_z);
    const gradient_index_3 = gradientIndexOf(permutation_3, gradient_scale_z);

    const floor_x_0 = floatFloor(floatMultiply(gradient_index_0, gradient_scale_z));
    const floor_x_1 = floatFloor(floatMultiply(gradient_index_1, gradient_scale_z));
    const floor_x_2 = floatFloor(floatMultiply(gradient_index_2, gradient_scale_z));
    const floor_x_3 = floatFloor(floatMultiply(gradient_index_3, gradient_scale_z));

    const floor_y_0 = floatFloor(floatSubtract(gradient_index_0, floatMultiply(toFloat32(7.0), floor_x_0)));
    const floor_y_1 = floatFloor(floatSubtract(gradient_index_1, floatMultiply(toFloat32(7.0), floor_x_1)));
    const floor_y_2 = floatFloor(floatSubtract(gradient_index_2, floatMultiply(toFloat32(7.0), floor_x_2)));
    const floor_y_3 = floatFloor(floatSubtract(gradient_index_3, floatMultiply(toFloat32(7.0), floor_x_3)));

    const gradient_x_0 = floatAdd(floatMultiply(floor_x_0, gradient_scale_x), gradient_scale_y);
    const gradient_x_1 = floatAdd(floatMultiply(floor_x_1, gradient_scale_x), gradient_scale_y);
    const gradient_x_2 = floatAdd(floatMultiply(floor_x_2, gradient_scale_x), gradient_scale_y);
    const gradient_x_3 = floatAdd(floatMultiply(floor_x_3, gradient_scale_x), gradient_scale_y);

    const gradient_y_0 = floatAdd(floatMultiply(floor_y_0, gradient_scale_x), gradient_scale_y);
    const gradient_y_1 = floatAdd(floatMultiply(floor_y_1, gradient_scale_x), gradient_scale_y);
    const gradient_y_2 = floatAdd(floatMultiply(floor_y_2, gradient_scale_x), gradient_scale_y);
    const gradient_y_3 = floatAdd(floatMultiply(floor_y_3, gradient_scale_x), gradient_scale_y);

    const gradient_z_0 = floatSubtract(floatSubtract(toFloat32(1.0), floatAbs(gradient_x_0)), floatAbs(gradient_y_0));
    const gradient_z_1 = floatSubtract(floatSubtract(toFloat32(1.0), floatAbs(gradient_x_1)), floatAbs(gradient_y_1));
    const gradient_z_2 = floatSubtract(floatSubtract(toFloat32(1.0), floatAbs(gradient_x_2)), floatAbs(gradient_y_2));
    const gradient_z_3 = floatSubtract(floatSubtract(toFloat32(1.0), floatAbs(gradient_x_3)), floatAbs(gradient_y_3));

    const sign_correction_0_0 = floatAdd(floatMultiply(floatFloor(gradient_x_0), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_0_1 = floatAdd(floatMultiply(floatFloor(gradient_x_1), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_0_2 = floatAdd(floatMultiply(floatFloor(gradient_y_0), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_0_3 = floatAdd(floatMultiply(floatFloor(gradient_y_1), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_1_0 = floatAdd(floatMultiply(floatFloor(gradient_x_2), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_1_1 = floatAdd(floatMultiply(floatFloor(gradient_x_3), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_1_2 = floatAdd(floatMultiply(floatFloor(gradient_y_2), toFloat32(2.0)), toFloat32(1.0));
    const sign_correction_1_3 = floatAdd(floatMultiply(floatFloor(gradient_y_3), toFloat32(2.0)), toFloat32(1.0));

    const height_sign_0 = gradient_z_0 <= 0.0 ? toFloat32(-1.0) : toFloat32(0.0);
    const height_sign_1 = gradient_z_1 <= 0.0 ? toFloat32(-1.0) : toFloat32(0.0);
    const height_sign_2 = gradient_z_2 <= 0.0 ? toFloat32(-1.0) : toFloat32(0.0);
    const height_sign_3 = gradient_z_3 <= 0.0 ? toFloat32(-1.0) : toFloat32(0.0);

    const adjusted_gradient_0_x = floatAdd(gradient_x_0, floatMultiply(sign_correction_0_0, height_sign_0));
    const adjusted_gradient_0_y = floatAdd(gradient_y_0, floatMultiply(sign_correction_0_2, height_sign_0));
    const adjusted_gradient_0_z = floatAdd(gradient_x_1, floatMultiply(sign_correction_0_1, height_sign_1));
    const adjusted_gradient_0_w = floatAdd(gradient_y_1, floatMultiply(sign_correction_0_3, height_sign_1));

    const adjusted_gradient_1_x = floatAdd(gradient_x_2, floatMultiply(sign_correction_1_0, height_sign_2));
    const adjusted_gradient_1_y = floatAdd(gradient_y_2, floatMultiply(sign_correction_1_2, height_sign_2));
    const adjusted_gradient_1_z = floatAdd(gradient_x_3, floatMultiply(sign_correction_1_1, height_sign_3));
    const adjusted_gradient_1_w = floatAdd(gradient_y_3, floatMultiply(sign_correction_1_3, height_sign_3));

    const normalization_0 = taylorInverseSqrt(selfDot(adjusted_gradient_0_x, adjusted_gradient_0_y, gradient_z_0));
    const normalization_1 = taylorInverseSqrt(selfDot(adjusted_gradient_0_z, adjusted_gradient_0_w, gradient_z_1));
    const normalization_2 = taylorInverseSqrt(selfDot(adjusted_gradient_1_x, adjusted_gradient_1_y, gradient_z_2));
    const normalization_3 = taylorInverseSqrt(selfDot(adjusted_gradient_1_z, adjusted_gradient_1_w, gradient_z_3));

    const corner_gradient_0_x = floatMultiply(adjusted_gradient_0_x, normalization_0);
    const corner_gradient_0_y = floatMultiply(adjusted_gradient_0_y, normalization_0);
    const corner_gradient_0_z = floatMultiply(gradient_z_0, normalization_0);
    const corner_gradient_1_x = floatMultiply(adjusted_gradient_0_z, normalization_1);
    const corner_gradient_1_y = floatMultiply(adjusted_gradient_0_w, normalization_1);
    const corner_gradient_1_z = floatMultiply(gradient_z_1, normalization_1);
    const corner_gradient_2_x = floatMultiply(adjusted_gradient_1_x, normalization_2);
    const corner_gradient_2_y = floatMultiply(adjusted_gradient_1_y, normalization_2);
    const corner_gradient_2_z = floatMultiply(gradient_z_2, normalization_2);
    const corner_gradient_3_x = floatMultiply(adjusted_gradient_1_z, normalization_3);
    const corner_gradient_3_y = floatMultiply(adjusted_gradient_1_w, normalization_3);
    const corner_gradient_3_z = floatMultiply(gradient_z_3, normalization_3);

    const offset_dot_0 = selfDot(offset_0_x, offset_0_y, offset_0_z);
    const offset_dot_1 = selfDot(offset_1_x, offset_1_y, offset_1_z);
    const offset_dot_2 = selfDot(offset_2_x, offset_2_y, offset_2_z);
    const offset_dot_3 = selfDot(offset_3_x, offset_3_y, offset_3_z);

    let falloff_0 = floatMax(floatSubtract(toFloat32(0.6), offset_dot_0), toFloat32(0.0));
    let falloff_1 = floatMax(floatSubtract(toFloat32(0.6), offset_dot_1), toFloat32(0.0));
    let falloff_2 = floatMax(floatSubtract(toFloat32(0.6), offset_dot_2), toFloat32(0.0));
    let falloff_3 = floatMax(floatSubtract(toFloat32(0.6), offset_dot_3), toFloat32(0.0));
    falloff_0 = floatMultiply(falloff_0, falloff_0);
    falloff_1 = floatMultiply(falloff_1, falloff_1);
    falloff_2 = floatMultiply(falloff_2, falloff_2);
    falloff_3 = floatMultiply(falloff_3, falloff_3);

    const gradient_dot_0 = floatAdd(floatAdd(floatMultiply(corner_gradient_0_x, offset_0_x), floatMultiply(corner_gradient_0_y, offset_0_y)), floatMultiply(corner_gradient_0_z, offset_0_z));
    const gradient_dot_1 = floatAdd(floatAdd(floatMultiply(corner_gradient_1_x, offset_1_x), floatMultiply(corner_gradient_1_y, offset_1_y)), floatMultiply(corner_gradient_1_z, offset_1_z));
    const gradient_dot_2 = floatAdd(floatAdd(floatMultiply(corner_gradient_2_x, offset_2_x), floatMultiply(corner_gradient_2_y, offset_2_y)), floatMultiply(corner_gradient_2_z, offset_2_z));
    const gradient_dot_3 = floatAdd(floatAdd(floatMultiply(corner_gradient_3_x, offset_3_x), floatMultiply(corner_gradient_3_y, offset_3_y)), floatMultiply(corner_gradient_3_z, offset_3_z));

    const weighted_sum = floatAdd(
        floatAdd(floatMultiply(floatMultiply(falloff_0, falloff_0), gradient_dot_0), floatMultiply(floatMultiply(falloff_1, falloff_1), gradient_dot_1)),
        floatAdd(floatMultiply(floatMultiply(falloff_2, falloff_2), gradient_dot_2), floatMultiply(floatMultiply(falloff_3, falloff_3), gradient_dot_3)),
    );
    return floatMultiply(toFloat32(42.0), weighted_sum);
}

function fractalBrownianMotion(x, y, z) {
    let value = toFloat32(0.0);
    let amplitude = toFloat32(0.5);
    let sample_x = x;
    let sample_y = y;
    let sample_z = z;
    for (let octave = 0; octave < 4; octave++) {
        value = floatAdd(value, floatMultiply(amplitude, simplexNoise(sample_x, sample_y, sample_z)));
        sample_x = floatMultiply(sample_x, toFloat32(2.1));
        sample_y = floatMultiply(sample_y, toFloat32(2.1));
        sample_z = floatMultiply(sample_z, toFloat32(2.1));
        amplitude = floatMultiply(amplitude, toFloat32(0.5));
    }
    return value;
}

function normalizedFractalBrownianMotion(x, y, z) {
    return floatAdd(floatMultiply(fractalBrownianMotion(x, y, z), toFloat32(0.5)), toFloat32(0.5));
}

export function warpedFractalBrownianMotion(x, y, z, warp_strength) {
    x = toFloat32(x);
    y = toFloat32(y);
    z = toFloat32(z);
    warp_strength = toFloat32(warp_strength);
    const warp_x = simplexNoise(floatAdd(x, toFloat32(1.7)), floatAdd(y, toFloat32(9.2)), floatAdd(z, toFloat32(0.0)));
    const warp_y = simplexNoise(floatAdd(x, toFloat32(8.3)), floatAdd(y, toFloat32(2.8)), floatAdd(z, toFloat32(0.0)));
    const warp_z = simplexNoise(floatAdd(x, toFloat32(0.0)), floatAdd(y, toFloat32(5.1)), floatAdd(z, toFloat32(3.4)));
    const warped_x = floatAdd(x, floatMultiply(warp_strength, warp_x));
    const warped_y = floatAdd(y, floatMultiply(warp_strength, warp_y));
    const warped_z = floatAdd(z, floatMultiply(warp_strength, warp_z));
    return normalizedFractalBrownianMotion(warped_x, warped_y, warped_z);
}

function crackWarpOffset(x, y, z, frequency) {
    const scale = floatMultiply(frequency, toFloat32(0.6));
    return [
        simplexNoise(floatAdd(floatMultiply(x, scale), toFloat32(1.7)), floatAdd(floatMultiply(y, scale), toFloat32(9.2)), floatAdd(floatMultiply(z, scale), toFloat32(0.0))),
        simplexNoise(floatAdd(floatMultiply(x, scale), toFloat32(8.3)), floatAdd(floatMultiply(y, scale), toFloat32(2.8)), floatAdd(floatMultiply(z, scale), toFloat32(0.0))),
        simplexNoise(floatAdd(floatMultiply(x, scale), toFloat32(3.1)), floatAdd(floatMultiply(y, scale), toFloat32(0.0)), floatAdd(floatMultiply(z, scale), toFloat32(5.4))),
    ];
}

function crackDisplacementLayer(x, y, z, frequency) {
    const [warp_x, warp_y, warp_z] = crackWarpOffset(x, y, z, frequency);
    const noise_value = floatAbs(simplexNoise(
        floatMultiply(floatAdd(x, floatMultiply(warp_x, toFloat32(1.2))), frequency),
        floatMultiply(floatAdd(y, floatMultiply(warp_y, toFloat32(1.2))), frequency),
        floatMultiply(floatAdd(z, floatMultiply(warp_z, toFloat32(1.2))), frequency),
    ));
    return toFloat32(Math.pow(noise_value, 0.18));
}

export function crackDisplacementNoise(x, y, z, frequency) {
    let accumulated_noise = toFloat32(0.0);
    let amplitude = toFloat32(1.0);
    let weight_total = toFloat32(0.0);
    let sample_x = toFloat32(x);
    let sample_y = toFloat32(y);
    let sample_z = toFloat32(z);
    frequency = toFloat32(frequency);
    for (let i = 0; i < 3; i++) {
        accumulated_noise = floatAdd(accumulated_noise, floatMultiply(crackDisplacementLayer(sample_x, sample_y, sample_z, frequency), amplitude));
        weight_total = floatAdd(weight_total, amplitude);
        sample_x = floatMultiply(sample_x, toFloat32(2.1));
        sample_y = floatMultiply(sample_y, toFloat32(2.1));
        sample_z = floatMultiply(sample_z, toFloat32(2.1));
        amplitude = floatMultiply(amplitude, toFloat32(0.45));
    }
    return toFloat32(accumulated_noise / weight_total);
}
