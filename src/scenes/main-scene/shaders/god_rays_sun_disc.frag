varying vec3 v_normal;

// fades instead of a hard edge, or radial resampling produces a visible ring
void main() {
    float intensity = pow(clamp(v_normal.z, 0.0, 1.0), 1.5);
    gl_FragColor = vec4(vec3(intensity), 1.0);
}
