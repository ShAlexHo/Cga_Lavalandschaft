vec3 modulo289Vec3(vec3 value) {
    return value - floor(value * (1.0 / 289.0)) * 289.0;
}

vec4 modulo289Vec4(vec4 value) {
    return value - floor(value * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 value) {
    return modulo289Vec4(((value * 34.0) + 10.0) * value);
}

vec4 taylorInverseSqrt(vec4 value) {
    return 1.79284291400159 - 0.85373472095314 * value;
}

float simplexNoise(vec3 position) {
    const vec2 SKEW_CONSTANTS  = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 HELPER_CONSTANTS = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 lattice_point = floor(position + dot(position, SKEW_CONSTANTS.yyy));
    vec3 offset_0 = position - lattice_point + dot(lattice_point, SKEW_CONSTANTS.xxx);

    vec3 greater_mask = step(offset_0.yzx, offset_0.xyz);
    vec3 lesser_mask = 1.0 - greater_mask;
    vec3 corner_offset_1 = min(greater_mask.xyz, lesser_mask.zxy);
    vec3 corner_offset_2 = max(greater_mask.xyz, lesser_mask.zxy);

    vec3 offset_1 = offset_0 - corner_offset_1 + SKEW_CONSTANTS.xxx;
    vec3 offset_2 = offset_0 - corner_offset_2 + SKEW_CONSTANTS.yyy;
    vec3 offset_3 = offset_0 - HELPER_CONSTANTS.yyy;

    lattice_point = modulo289Vec3(lattice_point);
    vec4 permutation = permute(permute(permute(
        lattice_point.z + vec4(0.0, corner_offset_1.z, corner_offset_2.z, 1.0)) +
        lattice_point.y + vec4(0.0, corner_offset_1.y, corner_offset_2.y, 1.0)) +
        lattice_point.x + vec4(0.0, corner_offset_1.x, corner_offset_2.x, 1.0));

    float one_seventh = 0.142857142857;
    vec3  gradient_scale = one_seventh * HELPER_CONSTANTS.wyz - HELPER_CONSTANTS.xzx;

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

    vec4 normalization = taylorInverseSqrt(vec4(
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

float fractalBrownianMotion(vec3 position) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
        value += amplitude * simplexNoise(position);
        position  *= 2.1;
        amplitude *= 0.5;
    }
    return value;
}

// fractalBrownianMotion() output is in [-1, 1]; this remaps it to [0, 1] for direct use as a
// mix/smoothstep factor - the normalization every caller needs, so it lives here once.
float normalizedFractalBrownianMotion(vec3 position) {
    return fractalBrownianMotion(position) * 0.5 + 0.5;
}

// Second fractal-brownian-motion pass over a copy of `position` displaced by an extra simplex layer,
// so the result reads as churning, higher-frequency turbulence instead of one smooth layer. Shared by
// the lava crust (metaball) and the sun's plasma surface, which pass their own warp_strength/scale/speed.
float warpedFractalBrownianMotion(vec3 position, float warp_strength) {
    vec3 warped = position + warp_strength * vec3(
        simplexNoise(position + vec3(1.7, 9.2, 0.0)),
        simplexNoise(position + vec3(8.3, 2.8, 0.0)),
        simplexNoise(position + vec3(0.0, 5.1, 3.4))
    );
    return normalizedFractalBrownianMotion(warped);
}

// abs() folds the noise around zero into a valley; `softness` (the pow() exponent) controls whether
// that reads as a thin crisp line (low, e.g. the volcano's 0.18) or a wide washed-out band (high).
float crackPattern(vec3 position, float frequency, float softness) {
    vec3 warp = vec3(
        simplexNoise(position * frequency * 0.6 + vec3(1.7, 9.2, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(8.3, 2.8, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(3.1, 0.0, 5.4))
    );
    return pow(abs(simplexNoise((position + warp * 1.2) * frequency)), softness);
}

// Blends towards a second crack color at a much lower frequency than the crack pattern itself, so
// different crack regions read as more red or more yellow instead of one flat, uniform tone. Shared
// by the ground and volcano terrain, which pass their own crack_color/crack_color_2 pair.
vec3 blendCrackColors(vec3 crack_color, vec3 crack_color_2, vec3 world_position) {
    return mix(crack_color, crack_color_2, normalizedFractalBrownianMotion(world_position * 0.15));
}

// Soft wash across the whole sun-facing side, boosted by a rim/fresnel highlight right
// at the silhouette - reads as "this side is lit by the sun", with the grazing edge
// popping brighter like a sunset rim light, instead of either a flat wash alone or an
// easy-to-miss thin edge line alone. Shared by the ground and volcano terrain, which pass
// their own normal/view/sun directions and focus.
float sunDiffuseTerm(vec3 normal, vec3 view_direction, vec3 sun_direction, float sun_focus) {
    float sun_facing = max(dot(normal, sun_direction), 0.0);
    float sun_wash = pow(sun_facing, 1.5) * 0.4;
    float sun_rim = pow(1.0 - max(dot(normal, view_direction), 0.0), sun_focus) * sun_facing;
    return sun_wash + sun_rim;
}
