#include <common>
#include <shadowmap_pars_vertex>

uniform float u_displacement_scale;
uniform float u_displacement_frequency;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;
varying float v_bump;

void main() {
    // Symmetric around zero (unlike the volcano's one-sided crack dents), so the ground's average
    // height stays put while the surface itself becomes uneven.
    float bump = warpedFractalBrownianMotion(position * u_displacement_frequency, 0.6) * 2.0 - 1.0;
    vec3 displaced = position + normal * bump * u_displacement_scale;
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
