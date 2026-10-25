uniform sampler2D u_base;
uniform sampler2D u_god_rays;
uniform sampler2D u_depth;
uniform vec3 u_tint;
varying vec2 v_uv;

void main() {
    float depth = texture2D(u_depth, v_uv).r;
    float open_air = step(0.9999, depth);
    vec3 god_rays = texture2D(u_god_rays, v_uv).rgb * u_tint * open_air;
    gl_FragColor = vec4(texture2D(u_base, v_uv).rgb + god_rays, 1.0);
}
