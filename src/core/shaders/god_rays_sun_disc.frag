varying vec3 v_normal;

// A hard edge here produces a visible ring once radially resampled, so this fades instead of cutting off.
void main() {
    float intensity = pow(clamp(v_normal.z, 0.0, 1.0), 1.5);
    gl_FragColor = vec4(vec3(intensity), 1.0);
}
