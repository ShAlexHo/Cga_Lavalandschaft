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

    const float ONE_SEVENTH = 0.142857142857;
    vec3  gradient_scale = ONE_SEVENTH * HELPER_CONSTANTS.wyz - HELPER_CONSTANTS.xzx;

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

float normalizedFractalBrownianMotion(vec3 position) {
    return fractalBrownianMotion(position) * 0.5 + 0.5;
}

float warpedFractalBrownianMotion(vec3 position, float warp_strength) {
    vec3 warped = position + warp_strength * vec3(
        simplexNoise(position + vec3(1.7, 9.2, 0.0)),
        simplexNoise(position + vec3(8.3, 2.8, 0.0)),
        simplexNoise(position + vec3(0.0, 5.1, 3.4))
    );
    return normalizedFractalBrownianMotion(warped);
}

vec3 crackWarpOffset(vec3 position, float frequency) {
    return vec3(
        simplexNoise(position * frequency * 0.6 + vec3(1.7, 9.2, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(8.3, 2.8, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(3.1, 0.0, 5.4))
    );
}

float crackPattern(vec3 position, float frequency, float crack_width) {
    const float FREQUENCY_MODULATION_BASE  = 0.6;
    const float FREQUENCY_MODULATION_RANGE = 0.8;
    const float CRACK_EDGE_RATIO = 0.15;

    float scale_variation = simplexNoise(position * 0.05) * 0.5 + 0.5;
    float local_frequency = frequency * (FREQUENCY_MODULATION_BASE + FREQUENCY_MODULATION_RANGE * scale_variation);
    vec3 warp = crackWarpOffset(position, local_frequency);
    float distance_from_crack = abs(simplexNoise((position + warp * 1.2) * local_frequency));
    float edge = crack_width * CRACK_EDGE_RATIO;
    return smoothstep(crack_width - edge, crack_width + edge, distance_from_crack);
}

vec3 blendCrackColors(vec3 crack_color, vec3 crack_color_2, vec3 crack_color_3, vec3 world_position) {
    float base_blend = normalizedFractalBrownianMotion(world_position * 0.6);
    vec3 base_color = mix(crack_color, crack_color_2, base_blend);

    float accent_blend = normalizedFractalBrownianMotion(world_position * 1.1 + vec3(52.1, 14.7, 8.3));
    return mix(base_color, crack_color_3, accent_blend * accent_blend);
}

vec3 blendTerrainColors(vec3 rock_color, vec3 rock_color_2, vec3 rock_color_3, vec3 rock_color_4, vec3 world_position, float frequency) {
    float base_blend = normalizedFractalBrownianMotion(world_position * frequency);
    vec3 color = mix(rock_color, rock_color_2, smoothstep(0.4, 0.6, base_blend));

    float accent_blend = normalizedFractalBrownianMotion(world_position * frequency * 1.8 + vec3(52.1, 14.7, 8.3));
    color = mix(color, rock_color_3, smoothstep(0.4, 0.6, accent_blend));

    float fourth_blend = normalizedFractalBrownianMotion(world_position * frequency * 1.4 + vec3(-33.7, 21.3, 9.6));
    return mix(color, rock_color_4, smoothstep(0.72, 0.82, fourth_blend));
}

float sunFocusTrapezoidMask(vec3 world_position, vec3 volcano_position, float radius) {
    vec2 trapezoid_forward = vec2(1.0, 0.0);
    vec2 trapezoid_right = vec2(-trapezoid_forward.y, trapezoid_forward.x);
    vec2 volcano_relative_position = world_position.xz - volcano_position.xz;
    float trapezoid_forward_distance = dot(volcano_relative_position, trapezoid_forward);
    float trapezoid_lateral_distance = abs(dot(volcano_relative_position, trapezoid_right));
    float trapezoid_edge_softness = max(radius * 0.15, 0.3);
    float trapezoid_length_mask = smoothstep(-trapezoid_edge_softness, trapezoid_edge_softness, trapezoid_forward_distance)
        * (1.0 - smoothstep(radius - trapezoid_edge_softness, radius + trapezoid_edge_softness, trapezoid_forward_distance));
    float trapezoid_progress = clamp(trapezoid_forward_distance / radius, 0.0, 1.0);
    float trapezoid_half_width = mix(radius * 0.25, radius, trapezoid_progress);
    float trapezoid_width_mask = 1.0 - smoothstep(trapezoid_half_width - trapezoid_edge_softness, trapezoid_half_width + trapezoid_edge_softness, trapezoid_lateral_distance);
    return trapezoid_length_mask * trapezoid_width_mask;
}

float sunDiffuseTerm(vec3 normal, vec3 view_direction, vec3 sun_direction, float sun_focus) {
    float sun_facing = max(dot(normal, sun_direction), 0.0);
    float sun_wash = pow(sun_facing, sun_focus) * 0.2;
    float sun_rim = pow(1.0 - max(dot(normal, view_direction), 0.0), sun_focus) * sun_facing * 0.2;
    return sun_wash + sun_rim;
}

float heightAmbientOcclusion(float height) {
    const float MINIMUM_OCCLUSION = 0.6;
    const float CONTRAST_BAND = 0.35;
    return mix(MINIMUM_OCCLUSION, 1.0, smoothstep(-CONTRAST_BAND, CONTRAST_BAND, height));
}

float pointSizeAttenuation(vec3 view_position) {
    const float REFERENCE_DISTANCE = 10.0;
    return REFERENCE_DISTANCE / max(-view_position.z, 0.001);
}

vec3 bumpOffset(vec3 world_position, float scale) {
    vec3 coordinate = world_position * scale;
    return vec3(
        simplexNoise(coordinate + vec3(0.0, 0.0, 1.7)),
        simplexNoise(coordinate + vec3(1.3, 0.0, 0.0)),
        simplexNoise(coordinate + vec3(0.0, 2.1, 0.0))
    );
}
