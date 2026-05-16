import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import vertexShader   from './shaders/metaball.vert?raw';
import fragmentShader from './shaders/metaball.frag?raw';

export const METABALLS = [
    { x: 0.50, y: 0.50, z: 0.50, strength: 1.2, subtract: 12 },
    { x: 0.65, y: 0.45, z: 0.45, strength: 1.0, subtract: 12 },
    { x: 0.30, y: 0.40, z: 0.60, strength: 1.0, subtract: 12 },
    { x: 0.55, y: 0.65, z: 0.35, strength: 0.9, subtract: 12 },
];

const LIGHT_WORLD_POSITION  = new THREE.Vector3(6, 8, 6);
const _light_view_position  = new THREE.Vector3();

export function create_metaballs(scene) {
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_color_hot:      { value: new THREE.Color(1.00, 0.08, 0.08) },
            u_color_cool:     { value: new THREE.Color(0.45, 0.00, 0.00) },
        },
        side: THREE.DoubleSide,
    });

    const resolution        = 32;
    const max_polygon_count = 100_000;
    const effect = new MarchingCubes(resolution, material, false, false, max_polygon_count);
    effect.scale.setScalar(3.0);
    scene.add(effect);

    rebuild_field(effect);

    return { effect, material };
}

export function rebuild_field(effect) {
    effect.reset();
    for (const ball of METABALLS) {
        effect.addBall(ball.x, ball.y, ball.z, ball.strength, ball.subtract);
    }
    effect.update();
}

export function update_light(material, camera) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
}
