uniform float u_displacement_scale;
uniform float u_displacement_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;

float crackLayer(vec3 position, float frequency) {
    vec3 warp = vec3(
        simplexNoise(position * frequency * 0.6 + vec3(1.7, 9.2, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(8.3, 2.8, 0.0)),
        simplexNoise(position * frequency * 0.6 + vec3(3.1, 0.0, 5.4))
    );
    float noise_value = abs(simplexNoise((position + warp * 1.2) * frequency));
    return pow(noise_value, 0.18);
}

float crackNoise(vec3 position, float frequency) {
    float accumulated_noise = 0.0, amplitude = 1.0, weight_total = 0.0;
    for (int i = 0; i < 3; i++) {
        accumulated_noise += crackLayer(position, frequency) * amplitude;
        weight_total += amplitude;
        position  *= 2.1;
        amplitude *= 0.45;
    }
    return accumulated_noise / weight_total;
}

void main() {
    vec3 world_position = (modelMatrix * vec4(position, 1.0)).xyz;

    float displacement = -max(0.0, 0.85 - crackNoise(world_position, u_displacement_frequency));
    vec3 displaced = position + normal * displacement * u_displacement_scale;

    v_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * view_position;
}
