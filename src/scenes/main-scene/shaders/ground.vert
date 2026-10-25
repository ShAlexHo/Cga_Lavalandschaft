#include <common>
#include <shadowmap_pars_vertex>

attribute float a_bump;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;
varying float v_bump;

void main() {
    v_bump = a_bump;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    v_world_position = worldPosition.xyz;
    vec4 view_position = modelViewMatrix * vec4(position, 1.0);
    v_view_position = view_position.xyz;
    v_normal = normalMatrix * normal;

    vec3 transformedNormal = v_normal;
    #include <shadowmap_vertex>

    gl_Position = projectionMatrix * view_position;
}
