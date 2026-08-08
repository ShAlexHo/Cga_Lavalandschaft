#include <common>
#include <shadowmap_pars_vertex>

uniform float u_displacement_scale;
uniform float u_displacement_frequency;
uniform vec3  u_volcano_position;
uniform float u_proximity_radius;
uniform float u_volcano_crack_scale;
uniform float u_volcano_crack_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;
varying float v_bump;

void main() {
    vec3 flat_world_position = (modelMatrix * vec4(position, 1.0)).xyz;
    float volcano_distance = length(flat_world_position.xz - u_volcano_position.xz);
    float proximity = 1.0 - smoothstep(0.0, u_proximity_radius, volcano_distance);

    // symmetric around zero (unlike the volcano's one-sided crack dents), so the average height stays put
    float bump = warpedFractalBrownianMotion(position * u_displacement_frequency, 0.6) * 2.0 - 1.0;

    // re-centered the same way as `bump`, so blending it in changes character, not average height
    float volcano_style_bump = crackDisplacementNoise(flat_world_position, u_volcano_crack_frequency) * 2.0 - 1.0;
    bump = mix(bump, volcano_style_bump, proximity);

    vec3 displaced = position + normal * bump * mix(u_displacement_scale, u_volcano_crack_scale, proximity);
    v_bump = bump;

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    v_world_position = worldPosition.xyz;
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;

    // Names must match THREE's shadowmap_vertex chunk exactly.
    vec3 transformedNormal = v_normal;
    #include <shadowmap_vertex>

    gl_Position = projectionMatrix * view_position;
}
