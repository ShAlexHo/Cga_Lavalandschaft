const f = Math.fround;
const fadd = (a, b) => f(a + b);
const fsub = (a, b) => f(a - b);
const fmul = (a, b) => f(a * b);
const ffloor = a => f(Math.floor(a));
const fabs = a => f(Math.abs(a));
const fmin = (a, b) => f(Math.min(a, b));
const fmax = (a, b) => f(Math.max(a, b));
const fstep = (edge, x) => (x >= edge ? f(1.0) : f(0.0));
const selfDot = (x, y, z) => fadd(fadd(fmul(x, x), fmul(y, y)), fmul(z, z));

const SKEW_X = f(1.0 / 6.0);
const SKEW_Y = f(1.0 / 3.0);
const ONE_SEVENTH = f(0.142857142857);

function modulo289(value) {
    return fsub(value, fmul(ffloor(fmul(value, f(1.0 / 289.0))), f(289.0)));
}

function permute(value) {
    return modulo289(fmul(fadd(fmul(value, f(34.0)), f(10.0)), value));
}

function taylorInverseSqrt(value) {
    return fsub(f(1.79284291400159), fmul(f(0.85373472095314), value));
}

function gradientIndexOf(permutation, gradient_scale_z) {
    return fsub(permutation, fmul(f(49.0), ffloor(fmul(permutation, fmul(gradient_scale_z, gradient_scale_z)))));
}

function simplexNoise(px, py, pz) {
    px = f(px); py = f(py); pz = f(pz);

    const skew_offset = fmul(fadd(fadd(px, py), pz), SKEW_Y);
    const lattice_point_x = ffloor(fadd(px, skew_offset));
    const lattice_point_y = ffloor(fadd(py, skew_offset));
    const lattice_point_z = ffloor(fadd(pz, skew_offset));

    const unskew_offset = fmul(fadd(fadd(lattice_point_x, lattice_point_y), lattice_point_z), SKEW_X);
    const offset_0_x = fadd(fsub(px, lattice_point_x), unskew_offset);
    const offset_0_y = fadd(fsub(py, lattice_point_y), unskew_offset);
    const offset_0_z = fadd(fsub(pz, lattice_point_z), unskew_offset);

    const greater_mask_x = fstep(offset_0_y, offset_0_x);
    const greater_mask_y = fstep(offset_0_z, offset_0_y);
    const greater_mask_z = fstep(offset_0_x, offset_0_z);
    const lesser_mask_x = fsub(f(1.0), greater_mask_x);
    const lesser_mask_y = fsub(f(1.0), greater_mask_y);
    const lesser_mask_z = fsub(f(1.0), greater_mask_z);

    const corner_offset_1_x = fmin(greater_mask_x, lesser_mask_z);
    const corner_offset_1_y = fmin(greater_mask_y, lesser_mask_x);
    const corner_offset_1_z = fmin(greater_mask_z, lesser_mask_y);
    const corner_offset_2_x = fmax(greater_mask_x, lesser_mask_z);
    const corner_offset_2_y = fmax(greater_mask_y, lesser_mask_x);
    const corner_offset_2_z = fmax(greater_mask_z, lesser_mask_y);

    const offset_1_x = fadd(fsub(offset_0_x, corner_offset_1_x), SKEW_X);
    const offset_1_y = fadd(fsub(offset_0_y, corner_offset_1_y), SKEW_X);
    const offset_1_z = fadd(fsub(offset_0_z, corner_offset_1_z), SKEW_X);
    const offset_2_x = fadd(fsub(offset_0_x, corner_offset_2_x), SKEW_Y);
    const offset_2_y = fadd(fsub(offset_0_y, corner_offset_2_y), SKEW_Y);
    const offset_2_z = fadd(fsub(offset_0_z, corner_offset_2_z), SKEW_Y);
    const offset_3_x = fsub(offset_0_x, f(0.5));
    const offset_3_y = fsub(offset_0_y, f(0.5));
    const offset_3_z = fsub(offset_0_z, f(0.5));

    const lattice_point_mod_x = modulo289(lattice_point_x);
    const lattice_point_mod_y = modulo289(lattice_point_y);
    const lattice_point_mod_z = modulo289(lattice_point_z);

    let permutation_0 = permute(fadd(lattice_point_mod_z, f(0.0)));
    let permutation_1 = permute(fadd(lattice_point_mod_z, corner_offset_1_z));
    let permutation_2 = permute(fadd(lattice_point_mod_z, corner_offset_2_z));
    let permutation_3 = permute(fadd(lattice_point_mod_z, f(1.0)));

    permutation_0 = permute(fadd(fadd(permutation_0, lattice_point_mod_y), f(0.0)));
    permutation_1 = permute(fadd(fadd(permutation_1, lattice_point_mod_y), corner_offset_1_y));
    permutation_2 = permute(fadd(fadd(permutation_2, lattice_point_mod_y), corner_offset_2_y));
    permutation_3 = permute(fadd(fadd(permutation_3, lattice_point_mod_y), f(1.0)));

    permutation_0 = permute(fadd(fadd(permutation_0, lattice_point_mod_x), f(0.0)));
    permutation_1 = permute(fadd(fadd(permutation_1, lattice_point_mod_x), corner_offset_1_x));
    permutation_2 = permute(fadd(fadd(permutation_2, lattice_point_mod_x), corner_offset_2_x));
    permutation_3 = permute(fadd(fadd(permutation_3, lattice_point_mod_x), f(1.0)));

    const gradient_scale_x = fsub(fmul(ONE_SEVENTH, f(2.0)), f(0.0));
    const gradient_scale_y = fsub(fmul(ONE_SEVENTH, f(0.5)), f(1.0));
    const gradient_scale_z = fsub(fmul(ONE_SEVENTH, f(1.0)), f(0.0));

    const gradient_index_0 = gradientIndexOf(permutation_0, gradient_scale_z);
    const gradient_index_1 = gradientIndexOf(permutation_1, gradient_scale_z);
    const gradient_index_2 = gradientIndexOf(permutation_2, gradient_scale_z);
    const gradient_index_3 = gradientIndexOf(permutation_3, gradient_scale_z);

    const floor_x_0 = ffloor(fmul(gradient_index_0, gradient_scale_z));
    const floor_x_1 = ffloor(fmul(gradient_index_1, gradient_scale_z));
    const floor_x_2 = ffloor(fmul(gradient_index_2, gradient_scale_z));
    const floor_x_3 = ffloor(fmul(gradient_index_3, gradient_scale_z));

    const floor_y_0 = ffloor(fsub(gradient_index_0, fmul(f(7.0), floor_x_0)));
    const floor_y_1 = ffloor(fsub(gradient_index_1, fmul(f(7.0), floor_x_1)));
    const floor_y_2 = ffloor(fsub(gradient_index_2, fmul(f(7.0), floor_x_2)));
    const floor_y_3 = ffloor(fsub(gradient_index_3, fmul(f(7.0), floor_x_3)));

    const gradient_x_0 = fadd(fmul(floor_x_0, gradient_scale_x), gradient_scale_y);
    const gradient_x_1 = fadd(fmul(floor_x_1, gradient_scale_x), gradient_scale_y);
    const gradient_x_2 = fadd(fmul(floor_x_2, gradient_scale_x), gradient_scale_y);
    const gradient_x_3 = fadd(fmul(floor_x_3, gradient_scale_x), gradient_scale_y);

    const gradient_y_0 = fadd(fmul(floor_y_0, gradient_scale_x), gradient_scale_y);
    const gradient_y_1 = fadd(fmul(floor_y_1, gradient_scale_x), gradient_scale_y);
    const gradient_y_2 = fadd(fmul(floor_y_2, gradient_scale_x), gradient_scale_y);
    const gradient_y_3 = fadd(fmul(floor_y_3, gradient_scale_x), gradient_scale_y);

    const gradient_z_0 = fsub(fsub(f(1.0), fabs(gradient_x_0)), fabs(gradient_y_0));
    const gradient_z_1 = fsub(fsub(f(1.0), fabs(gradient_x_1)), fabs(gradient_y_1));
    const gradient_z_2 = fsub(fsub(f(1.0), fabs(gradient_x_2)), fabs(gradient_y_2));
    const gradient_z_3 = fsub(fsub(f(1.0), fabs(gradient_x_3)), fabs(gradient_y_3));

    const sign_correction_0_0 = fadd(fmul(ffloor(gradient_x_0), f(2.0)), f(1.0));
    const sign_correction_0_1 = fadd(fmul(ffloor(gradient_x_1), f(2.0)), f(1.0));
    const sign_correction_0_2 = fadd(fmul(ffloor(gradient_y_0), f(2.0)), f(1.0));
    const sign_correction_0_3 = fadd(fmul(ffloor(gradient_y_1), f(2.0)), f(1.0));
    const sign_correction_1_0 = fadd(fmul(ffloor(gradient_x_2), f(2.0)), f(1.0));
    const sign_correction_1_1 = fadd(fmul(ffloor(gradient_x_3), f(2.0)), f(1.0));
    const sign_correction_1_2 = fadd(fmul(ffloor(gradient_y_2), f(2.0)), f(1.0));
    const sign_correction_1_3 = fadd(fmul(ffloor(gradient_y_3), f(2.0)), f(1.0));

    const height_sign_0 = gradient_z_0 <= 0.0 ? f(-1.0) : f(0.0);
    const height_sign_1 = gradient_z_1 <= 0.0 ? f(-1.0) : f(0.0);
    const height_sign_2 = gradient_z_2 <= 0.0 ? f(-1.0) : f(0.0);
    const height_sign_3 = gradient_z_3 <= 0.0 ? f(-1.0) : f(0.0);

    const adjusted_gradient_0_x = fadd(gradient_x_0, fmul(sign_correction_0_0, height_sign_0));
    const adjusted_gradient_0_y = fadd(gradient_y_0, fmul(sign_correction_0_2, height_sign_0));
    const adjusted_gradient_0_z = fadd(gradient_x_1, fmul(sign_correction_0_1, height_sign_1));
    const adjusted_gradient_0_w = fadd(gradient_y_1, fmul(sign_correction_0_3, height_sign_1));

    const adjusted_gradient_1_x = fadd(gradient_x_2, fmul(sign_correction_1_0, height_sign_2));
    const adjusted_gradient_1_y = fadd(gradient_y_2, fmul(sign_correction_1_2, height_sign_2));
    const adjusted_gradient_1_z = fadd(gradient_x_3, fmul(sign_correction_1_1, height_sign_3));
    const adjusted_gradient_1_w = fadd(gradient_y_3, fmul(sign_correction_1_3, height_sign_3));

    const normalization_0 = taylorInverseSqrt(selfDot(adjusted_gradient_0_x, adjusted_gradient_0_y, gradient_z_0));
    const normalization_1 = taylorInverseSqrt(selfDot(adjusted_gradient_0_z, adjusted_gradient_0_w, gradient_z_1));
    const normalization_2 = taylorInverseSqrt(selfDot(adjusted_gradient_1_x, adjusted_gradient_1_y, gradient_z_2));
    const normalization_3 = taylorInverseSqrt(selfDot(adjusted_gradient_1_z, adjusted_gradient_1_w, gradient_z_3));

    const corner_gradient_0_x = fmul(adjusted_gradient_0_x, normalization_0);
    const corner_gradient_0_y = fmul(adjusted_gradient_0_y, normalization_0);
    const corner_gradient_0_z = fmul(gradient_z_0, normalization_0);
    const corner_gradient_1_x = fmul(adjusted_gradient_0_z, normalization_1);
    const corner_gradient_1_y = fmul(adjusted_gradient_0_w, normalization_1);
    const corner_gradient_1_z = fmul(gradient_z_1, normalization_1);
    const corner_gradient_2_x = fmul(adjusted_gradient_1_x, normalization_2);
    const corner_gradient_2_y = fmul(adjusted_gradient_1_y, normalization_2);
    const corner_gradient_2_z = fmul(gradient_z_2, normalization_2);
    const corner_gradient_3_x = fmul(adjusted_gradient_1_z, normalization_3);
    const corner_gradient_3_y = fmul(adjusted_gradient_1_w, normalization_3);
    const corner_gradient_3_z = fmul(gradient_z_3, normalization_3);

    const offset_dot_0 = selfDot(offset_0_x, offset_0_y, offset_0_z);
    const offset_dot_1 = selfDot(offset_1_x, offset_1_y, offset_1_z);
    const offset_dot_2 = selfDot(offset_2_x, offset_2_y, offset_2_z);
    const offset_dot_3 = selfDot(offset_3_x, offset_3_y, offset_3_z);

    let falloff_0 = fmax(fsub(f(0.6), offset_dot_0), f(0.0));
    let falloff_1 = fmax(fsub(f(0.6), offset_dot_1), f(0.0));
    let falloff_2 = fmax(fsub(f(0.6), offset_dot_2), f(0.0));
    let falloff_3 = fmax(fsub(f(0.6), offset_dot_3), f(0.0));
    falloff_0 = fmul(falloff_0, falloff_0);
    falloff_1 = fmul(falloff_1, falloff_1);
    falloff_2 = fmul(falloff_2, falloff_2);
    falloff_3 = fmul(falloff_3, falloff_3);

    const gradient_dot_0 = fadd(fadd(fmul(corner_gradient_0_x, offset_0_x), fmul(corner_gradient_0_y, offset_0_y)), fmul(corner_gradient_0_z, offset_0_z));
    const gradient_dot_1 = fadd(fadd(fmul(corner_gradient_1_x, offset_1_x), fmul(corner_gradient_1_y, offset_1_y)), fmul(corner_gradient_1_z, offset_1_z));
    const gradient_dot_2 = fadd(fadd(fmul(corner_gradient_2_x, offset_2_x), fmul(corner_gradient_2_y, offset_2_y)), fmul(corner_gradient_2_z, offset_2_z));
    const gradient_dot_3 = fadd(fadd(fmul(corner_gradient_3_x, offset_3_x), fmul(corner_gradient_3_y, offset_3_y)), fmul(corner_gradient_3_z, offset_3_z));

    const weighted_sum = fadd(
        fadd(fmul(fmul(falloff_0, falloff_0), gradient_dot_0), fmul(fmul(falloff_1, falloff_1), gradient_dot_1)),
        fadd(fmul(fmul(falloff_2, falloff_2), gradient_dot_2), fmul(fmul(falloff_3, falloff_3), gradient_dot_3)),
    );
    return fmul(f(42.0), weighted_sum);
}

function fractalBrownianMotion(x, y, z) {
    let value = f(0.0);
    let amplitude = f(0.5);
    let px = x, py = y, pz = z;
    for (let octave = 0; octave < 4; octave++) {
        value = fadd(value, fmul(amplitude, simplexNoise(px, py, pz)));
        px = fmul(px, f(2.1)); py = fmul(py, f(2.1)); pz = fmul(pz, f(2.1));
        amplitude = fmul(amplitude, f(0.5));
    }
    return value;
}

function normalizedFractalBrownianMotion(x, y, z) {
    return fadd(fmul(fractalBrownianMotion(x, y, z), f(0.5)), f(0.5));
}

export function warpedFractalBrownianMotion(x, y, z, warp_strength) {
    x = f(x); y = f(y); z = f(z); warp_strength = f(warp_strength);
    const warp_x = simplexNoise(fadd(x, f(1.7)), fadd(y, f(9.2)), fadd(z, f(0.0)));
    const warp_y = simplexNoise(fadd(x, f(8.3)), fadd(y, f(2.8)), fadd(z, f(0.0)));
    const warp_z = simplexNoise(fadd(x, f(0.0)), fadd(y, f(5.1)), fadd(z, f(3.4)));
    const warped_x = fadd(x, fmul(warp_strength, warp_x));
    const warped_y = fadd(y, fmul(warp_strength, warp_y));
    const warped_z = fadd(z, fmul(warp_strength, warp_z));
    return normalizedFractalBrownianMotion(warped_x, warped_y, warped_z);
}

function crackWarpOffset(x, y, z, frequency) {
    const scale = fmul(frequency, f(0.6));
    return [
        simplexNoise(fadd(fmul(x, scale), f(1.7)), fadd(fmul(y, scale), f(9.2)), fadd(fmul(z, scale), f(0.0))),
        simplexNoise(fadd(fmul(x, scale), f(8.3)), fadd(fmul(y, scale), f(2.8)), fadd(fmul(z, scale), f(0.0))),
        simplexNoise(fadd(fmul(x, scale), f(3.1)), fadd(fmul(y, scale), f(0.0)), fadd(fmul(z, scale), f(5.4))),
    ];
}

function crackDisplacementLayer(x, y, z, frequency) {
    const [warp_x, warp_y, warp_z] = crackWarpOffset(x, y, z, frequency);
    const noise_value = fabs(simplexNoise(
        fmul(fadd(x, fmul(warp_x, f(1.2))), frequency),
        fmul(fadd(y, fmul(warp_y, f(1.2))), frequency),
        fmul(fadd(z, fmul(warp_z, f(1.2))), frequency),
    ));
    return f(Math.pow(noise_value, 0.18));
}

export function crackDisplacementNoise(x, y, z, frequency) {
    let accumulated_noise = f(0.0), amplitude = f(1.0), weight_total = f(0.0);
    let px = f(x), py = f(y), pz = f(z);
    frequency = f(frequency);
    for (let i = 0; i < 3; i++) {
        accumulated_noise = fadd(accumulated_noise, fmul(crackDisplacementLayer(px, py, pz, frequency), amplitude));
        weight_total = fadd(weight_total, amplitude);
        px = fmul(px, f(2.1)); py = fmul(py, f(2.1)); pz = fmul(pz, f(2.1));
        amplitude = fmul(amplitude, f(0.45));
    }
    return f(accumulated_noise / weight_total);
}
