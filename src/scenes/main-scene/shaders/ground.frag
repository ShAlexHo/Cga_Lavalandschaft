uniform bool receiveShadow;

#include <common>
#include <packing>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform float u_time;
uniform vec3  u_light_position;
uniform vec3  u_sun_position;
uniform vec3  u_sun_color;
uniform float u_sun_enabled;
uniform float u_sun_strength;
uniform float u_sun_focus;
uniform float u_crack_frequency;
uniform float u_crack_softness;
uniform float u_displacement_frequency;
uniform vec3  u_rock_color;
uniform vec3  u_rock_color_2;
uniform vec3  u_rock_color_3;
uniform vec3  u_rock_color_4;
uniform vec3  u_crack_color;
uniform vec3  u_crack_color_2;
uniform vec3  u_crack_color_3;
uniform vec3  u_crack_color_4;
uniform vec3  u_volcano_position;
uniform vec3  u_proximity_color;
uniform vec3  u_proximity_noise_color;
uniform float u_proximity_radius;
uniform float u_sun_focus_radius;
uniform float u_rock_variance_radius;
uniform float u_crack_density_fade_start;
uniform float u_crack_density_fade_end;
uniform vec3  u_sky_color;
uniform float u_edge_fade_start;
uniform float u_edge_fade_end;

varying vec3 v_world_position;
varying vec3 v_view_position;
varying vec3 v_normal;
varying float v_bump;

void main() {
    vec3 normal = normalize(v_normal);
    if (!gl_FrontFacing) normal = -normal;

    // normal perturbation, so bumps show under lighting
    normal = normalize(normal + bumpOffset(v_world_position, 3.0) * 0.1);

    float shadow_mask = getShadowMask();

    vec3 view_direction = normalize(-v_view_position);
    vec3 sun_direction  = normalize(u_sun_position - v_view_position);
    float diffuse = max(dot(normal, normalize(u_light_position - v_view_position)), 0.0) * shadow_mask;

    float volcano_distance = length(v_world_position.xz - u_volcano_position.xz);
    float proximity = 1.0 - smoothstep(0.0, u_proximity_radius, volcano_distance);

    float sun_focus_proximity = sunFocusTrapezoidMask(v_world_position, u_volcano_position, u_sun_focus_radius);
    float sun_focus_near_volcano = mix(u_sun_focus, u_sun_focus * 1.8, sun_focus_proximity);
    float sun_diffuse = sunDiffuseTerm(normal, view_direction, sun_direction, sun_focus_near_volcano) * mix(1.0, 1.6, sun_focus_proximity);

    // each hill-sized patch gets its own rock tone; faded out near the volcano over its own radius
    // so the scorched ground close to it stays a plain, uniform u_rock_color
    float rock_variance_strength = smoothstep(0.0, u_rock_variance_radius, volcano_distance);
    vec3 rock_base_color = blendTerrainColors(u_rock_color, u_rock_color_2, u_rock_color_3, u_rock_color_4, v_world_position, u_displacement_frequency);
    rock_base_color = mix(u_rock_color, rock_base_color, rock_variance_strength);
    float color_variation = normalizedFractalBrownianMotion(v_world_position * 1.5);
    vec3 varied_color = mix(rock_base_color * 0.6, rock_base_color, color_variation);

    float crack_mask = crackPattern(v_world_position, u_crack_frequency, u_crack_softness);
    // hides whole vein patches farther from the volcano, rather than eroding crack_mask directly -
    // erosion breaks a continuous vein into isolated dots long before it fully disappears, since
    // its depth varies along its own length
    float patch_noise = simplexNoise(v_world_position * 0.02) * 0.5 + 0.5;
    float patch_hide_threshold = smoothstep(u_crack_density_fade_start, u_crack_density_fade_end, volcano_distance);
    if (patch_noise < patch_hide_threshold) crack_mask = 1.0;
    vec3 crack_color = blendCrackColors(u_crack_color, u_crack_color_2, u_crack_color_3, v_world_position);
    // partial amplitude keeps per-crack variety visible instead of washing to one color at the peak
    float crack_time_pulse = 0.5 + 0.5 * sin(u_time * 0.9);
    crack_color = mix(crack_color, u_crack_color_3, crack_time_pulse * 0.5);
    // mismatched frequencies only align into a peak occasionally (beat period), not every cycle
    float flare_a = sin(u_time * 0.37);
    float flare_b = sin(u_time * 0.53 + 1.7);
    float red_flare = pow(max(flare_a * flare_b, 0.0), 8.0);
    // narrow threshold + high frequency -> isolated dots; time offset varies which ones light up
    float sparkle_noise = simplexNoise(v_world_position * 18.0 + vec3(0.0, u_time * 0.15, 0.0));
    float sparkle_mask = smoothstep(0.93, 0.97, sparkle_noise) * (1.0 - crack_mask);
    crack_color = mix(crack_color, u_crack_color_4, red_flare * sparkle_mask);
    // applied last so it isn't diluted by the mixes above; anisotropic + warp for hair-like strands
    vec3 hair_warp = vec3(simplexNoise(v_world_position * 4.0 + vec3(6.1, 0.0, 2.4)), 0.0, 0.0) * 4.0;
    vec3 hair_coordinate = (v_world_position + hair_warp) * vec3(3.0, 12.0, 30.0) + vec3(3.7, 1.2, 5.5);
    float crack_detail_noise = normalizedFractalBrownianMotion(hair_coordinate);
    crack_color *= mix(0.3, 1.8, crack_detail_noise);
    vec3 color = mix(crack_color, varied_color, crack_mask);

    // tiny: ground, not polished rock
    vec3 halfway_direction = normalize(normalize(u_light_position - v_view_position) + view_direction);
    float specular = pow(max(dot(halfway_direction, normal), 0.0), 24.0) * 0.002 * shadow_mask;

    // matches the scene's AmbientLight (main.js)
    color = color * (1.8 + diffuse * 0.55) + vec3(specular);

    // capped below 1.0 so the rock's own color/hill variance still shows through at the volcano's foot
    color = mix(color, u_proximity_color, proximity * 0.6);

    // crack_mask keeps this off the lava crack veins
    float proximity_noise = clamp(normalizedFractalBrownianMotion(v_world_position * 2.5) * 1.8, 0.0, 1.0) * proximity * crack_mask;
    color = mix(color, u_proximity_noise_color, proximity_noise);

    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;

    color *= heightAmbientOcclusion(v_bump);

    // self-illumination so cracks push past the bloom threshold; strength drifts over position/time
    float glow_variation = normalizedFractalBrownianMotion(v_world_position * 5.0 + vec3(0.0, u_time * 0.3, 0.0));
    float crack_glow_strength = mix(0.4, 1.2, glow_variation);
    color += crack_color * (1.0 - crack_mask) * crack_glow_strength;

    // fades to the sky color toward the plane's own radius, so its rectangular edge
    // (corners included, since this uses radial rather than per-axis distance) never
    // shows a hard silhouette against the sky at the horizon
    float edge_distance = length(v_world_position.xz);
    float edge_fade = smoothstep(u_edge_fade_start, u_edge_fade_end, edge_distance);
    color = mix(color, u_sky_color, edge_fade);

    gl_FragColor = vec4(color, 1.0);
}
