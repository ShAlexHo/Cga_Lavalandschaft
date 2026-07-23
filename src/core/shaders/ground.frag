uniform bool receiveShadow;

#include <common>
#include <packing>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform vec3  u_light_position;
uniform vec3  u_sun_position;
uniform vec3  u_sun_color;
uniform float u_sun_enabled;
uniform float u_sun_strength;
uniform float u_sun_focus;
uniform float u_crack_frequency;
uniform float u_crack_softness;
uniform vec3  u_rock_color;
uniform vec3  u_crack_color;
uniform vec3  u_crack_color_2;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;
varying float v_bump;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    // Perturb the otherwise-flat shading normal, so the displaced terrain's bumps actually show under lighting.
    vec3 bump = vec3(
        simplexNoise(v_world_position * 3.0 + vec3(0.0, 0.0, 1.7)),
        simplexNoise(v_world_position * 3.0 + vec3(1.3, 0.0, 0.0)),
        simplexNoise(v_world_position * 3.0 + vec3(0.0, 2.1, 0.0))
    );
    normal = normalize(normal + bump * 0.1);

    float shadow_mask = getShadowMask();

    vec3 view_direction = normalize(-v_view_position);
    vec3 sun_direction  = normalize(u_sun_position - v_view_position);
    float diffuse = max(dot(normal, normalize(u_light_position - v_view_position)), 0.0) * shadow_mask;
    float sun_diffuse = sunDiffuseTerm(normal, view_direction, sun_direction, u_sun_focus);

    float color_var = normalizedFractalBrownianMotion(v_world_position * 1.5);
    vec3 varied_color = mix(u_rock_color * 0.6, u_rock_color, color_var);

    float crack_mask = crackPattern(v_world_position, u_crack_frequency, u_crack_softness);
    vec3 crack_color = blendCrackColors(u_crack_color, u_crack_color_2, v_world_position);
    vec3 color = mix(crack_color, varied_color, crack_mask);

    // Barely-there specular - it's ground, not polished rock, so only the faintest highlight should show.
    vec3 halfway_direction = normalize(normalize(u_light_position - v_view_position) + view_direction);
    float specular = pow(max(dot(halfway_direction, normal), 0.0), 24.0) * 0.002 * shadow_mask;

    // Ambient term matching the scene's AmbientLight (main.js) - not self-emission, just the same
    // ambient fill every other lit object gets, without which the ground reads as near-black.
    color = color * (1.8 + diffuse * 0.55) + vec3(specular);
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;

    color *= heightAmbientOcclusion(v_bump);

    gl_FragColor = vec4(color, 1.0);
}
