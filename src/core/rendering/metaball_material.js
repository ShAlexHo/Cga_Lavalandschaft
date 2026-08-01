import * as THREE from 'three';
import vertex_glsl from '../shaders/metaball.vert?raw';
import noise_glsl from '../shaders/noise.glsl?raw';
import fragment_glsl from '../shaders/metaball.frag?raw';
import { METABALL_LIGHT_POSITION, METABALL_DEFAULT_ISOLATION, METABALL_RAYMARCH_BALL_CAP } from '../config.js';
import { computeLightViewPosition } from './light_utils.js';

const LIGHT_WORLD_POSITION = new THREE.Vector3(METABALL_LIGHT_POSITION.x, METABALL_LIGHT_POSITION.y, METABALL_LIGHT_POSITION.z);
const _light_view_position = new THREE.Vector3();
const _inverse_model_matrix = new THREE.Matrix4();
const _world_ball_position = new THREE.Vector3();
const _ranked_balls = [];

export function createMetaballMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        glslVersion: THREE.GLSL3,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_time: { value: 0.0 },
            u_glow_enabled: { value: 1.0 },
            u_glow_color: { value: new THREE.Color(0xff3f00) },
            u_color_hot: { value: new THREE.Color(0xa01500) },
            u_color_cool: { value: new THREE.Color(0x7c3027) },
            u_noise_enabled: { value: 1.0 },
            u_noise_color_1: { value: new THREE.Color(0x7c3027) },
            u_noise_color_2: { value: new THREE.Color(0xea6927) },
            u_bump_enabled: { value: 1.0 },
            u_displacement: { value: 0.00005 },
            u_isolation: { value: METABALL_DEFAULT_ISOLATION },
            u_inverse_model_matrix: { value: new THREE.Matrix4() },
            u_ball_count: { value: 0 },
            u_ball_position: { value: new Float32Array(METABALL_RAYMARCH_BALL_CAP * 3) },
            u_ball_strength: { value: new Float32Array(METABALL_RAYMARCH_BALL_CAP) },
            u_ball_subtract: { value: new Float32Array(METABALL_RAYMARCH_BALL_CAP) },
            u_ball_radius2: { value: new Float32Array(METABALL_RAYMARCH_BALL_CAP) },
        },
        side: THREE.DoubleSide,
    });
}

export function updateMetaballLight(material, camera, time) {
    computeLightViewPosition(camera, LIGHT_WORLD_POSITION, _light_view_position);
    material.uniforms.u_light_position.value.copy(_light_view_position);
    material.uniforms.u_time.value = time;
}

// Uploads only the METABALL_RAYMARCH_BALL_CAP balls nearest the camera - the raymarcher sums every
// ball at every step, so an unbounded count would scale directly with active ball count instead of
// staying fixed. Ball positions are remapped from the animation's [0, 1] field space into the
// effect mesh's own local space (matching three.js MarchingCubes' internal x*2-1 convention), and
// strength is scaled x4 to compensate (see metaball.frag's metaballPotential for the derivation).
export function updateMetaballBalls(material, mesh, balls, camera) {
    _inverse_model_matrix.copy(mesh.matrixWorld).invert();
    material.uniforms.u_inverse_model_matrix.value.copy(_inverse_model_matrix);

    _ranked_balls.length = 0;
    for (const ball of balls) {
        _world_ball_position.set(ball.x, ball.y, ball.z).applyMatrix4(mesh.matrixWorld);
        _ranked_balls.push({ ball, distance_sq: _world_ball_position.distanceToSquared(camera.position) });
    }
    _ranked_balls.sort((a, b) => a.distance_sq - b.distance_sq);

    const position_array = material.uniforms.u_ball_position.value;
    const strength_array = material.uniforms.u_ball_strength.value;
    const subtract_array = material.uniforms.u_ball_subtract.value;
    const radius2_array = material.uniforms.u_ball_radius2.value;
    const count = Math.min(_ranked_balls.length, METABALL_RAYMARCH_BALL_CAP);

    for (let i = 0; i < count; i++) {
        const ball = _ranked_balls[i].ball;
        const strength_local = ball.strength * 4.0;
        position_array[i * 3 + 0] = ball.x * 2.0 - 1.0;
        position_array[i * 3 + 1] = ball.y * 2.0 - 1.0;
        position_array[i * 3 + 2] = ball.z * 2.0 - 1.0;
        strength_array[i] = strength_local;
        subtract_array[i] = ball.subtract;
        radius2_array[i] = strength_local / ball.subtract;
    }
    material.uniforms.u_ball_count.value = count;
}
