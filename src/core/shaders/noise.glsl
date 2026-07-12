vec3 modulo289_vec3(vec3 value) { 
    return value - floor(value * (1.0 / 289.0)) * 289.0; 
}

vec4 modulo289_vec4(vec4 value) { 
    return value - floor(value * (1.0 / 289.0)) * 289.0; 
}

vec4 permute(vec4 value) { 
    return modulo289_vec4(((value * 34.0) + 10.0) * value); 
}

vec4 taylor_inverse_sqrt(vec4 value) { 
    return 1.79284291400159 - 0.85373472095314 * value; 
}

float simplex_noise(vec3 position) {
    const vec2 skew_constants  = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 helper_constants = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 lattice_point = floor(position + dot(position, skew_constants.yyy));
    vec3 offset_0 = position - lattice_point + dot(lattice_point, skew_constants.xxx);

    vec3 greater_mask = step(offset_0.yzx, offset_0.xyz);
    vec3 lesser_mask = 1.0 - greater_mask;
    vec3 corner_offset_1 = min(greater_mask.xyz, lesser_mask.zxy);
    vec3 corner_offset_2 = max(greater_mask.xyz, lesser_mask.zxy);

    vec3 offset_1 = offset_0 - corner_offset_1 + skew_constants.xxx;
    vec3 offset_2 = offset_0 - corner_offset_2 + skew_constants.yyy;
    vec3 offset_3 = offset_0 - helper_constants.yyy;

    lattice_point = modulo289_vec3(lattice_point);
    vec4 permutation = permute(permute(permute(
        lattice_point.z + vec4(0.0, corner_offset_1.z, corner_offset_2.z, 1.0)) +
        lattice_point.y + vec4(0.0, corner_offset_1.y, corner_offset_2.y, 1.0)) +
        lattice_point.x + vec4(0.0, corner_offset_1.x, corner_offset_2.x, 1.0));

    float one_seventh = 0.142857142857;
    vec3  gradient_scale = one_seventh * helper_constants.wyz - helper_constants.xzx;

    vec4 gradient_index = permutation - 49.0 * floor(permutation * gradient_scale.z * gradient_scale.z);
    vec4 floor_x = floor(gradient_index * gradient_scale.z);
    vec4 floor_y = floor(gradient_index - 7.0 * floor_x);

    vec4 gradient_x = floor_x * gradient_scale.x + gradient_scale.yyyy;
    vec4 gradient_y = floor_y * gradient_scale.x + gradient_scale.yyyy;
    vec4 gradient_z = 1.0 - abs(gradient_x) - abs(gradient_y);

    vec4 base_gradient_0 = vec4(gradient_x.xy, gradient_y.xy);
    vec4 base_gradient_1 = vec4(gradient_x.zw, gradient_y.zw);

    vec4 sign_correction_0 = floor(base_gradient_0) * 2.0 + 1.0;
    vec4 sign_correction_1 = floor(base_gradient_1) * 2.0 + 1.0;
    vec4 height_sign = -step(gradient_z, vec4(0.0));

    vec4 adjusted_gradient_0 = base_gradient_0.xzyw + sign_correction_0.xzyw * height_sign.xxyy;
    vec4 adjusted_gradient_1 = base_gradient_1.xzyw + sign_correction_1.xzyw * height_sign.zzww;

    vec3 corner_gradient_0 = vec3(adjusted_gradient_0.xy, gradient_z.x);
    vec3 corner_gradient_1 = vec3(adjusted_gradient_0.zw, gradient_z.y);
    vec3 corner_gradient_2 = vec3(adjusted_gradient_1.xy, gradient_z.z);
    vec3 corner_gradient_3 = vec3(adjusted_gradient_1.zw, gradient_z.w);

    vec4 normalization = taylor_inverse_sqrt(vec4(
        dot(corner_gradient_0, corner_gradient_0),
        dot(corner_gradient_1, corner_gradient_1),
        dot(corner_gradient_2, corner_gradient_2),
        dot(corner_gradient_3, corner_gradient_3)));
    corner_gradient_0 *= normalization.x;
    corner_gradient_1 *= normalization.y;
    corner_gradient_2 *= normalization.z;
    corner_gradient_3 *= normalization.w;

    vec4 falloff = max(0.6 - vec4(
        dot(offset_0, offset_0),
        dot(offset_1, offset_1),
        dot(offset_2, offset_2),
        dot(offset_3, offset_3)), 0.0);
    falloff = falloff * falloff;
    return 42.0 * dot(falloff * falloff, vec4(
        dot(corner_gradient_0, offset_0),
        dot(corner_gradient_1, offset_1),
        dot(corner_gradient_2, offset_2),
        dot(corner_gradient_3, offset_3)));
}

float fractal_brownian_motion(vec3 position) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
        value += amplitude * simplex_noise(position);
        position  *= 2.1;
        amplitude *= 0.5;
    }
    return value;
}

// fractal_brownian_motion() output is in [-1, 1]; this remaps it to [0, 1] for direct use as a
// mix/smoothstep factor - the normalization every caller needs, so it lives here once.
float normalized_fractal_brownian_motion(vec3 position) {
    return fractal_brownian_motion(position) * 0.5 + 0.5;
}

// Second fractal-brownian-motion pass over a copy of `position` displaced by an extra simplex layer,
// so the result reads as churning, higher-frequency turbulence instead of one smooth layer. Shared by
// the lava crust (metaball) and the sun's plasma surface, which pass their own warp_strength/scale/speed.
float warped_fractal_brownian_motion(vec3 position, float warp_strength) {
    vec3 warped = position + warp_strength * vec3(
        simplex_noise(position + vec3(1.7, 9.2, 0.0)),
        simplex_noise(position + vec3(8.3, 2.8, 0.0)),
        simplex_noise(position + vec3(0.0, 5.1, 3.4))
    );
    return normalized_fractal_brownian_motion(warped);
}
