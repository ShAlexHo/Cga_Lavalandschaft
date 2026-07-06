import * as THREE from 'three';
import noise_glsl   from './shaders/noise.glsl?raw';
import vertex_glsl  from './shaders/volcano.vert?raw';
import fragment_glsl from './shaders/volcano.frag?raw';

const PROFILE = [
    new THREE.Vector2(14.0, 0.0),
    new THREE.Vector2(2.5,  5.0),
    new THREE.Vector2(1.0,  4.2),
];

function subdivideProfile(profile, steps) {
    const interpolated_points = [];
    for (let i = 0; i < profile.length - 1; i++) {
        const point_a = profile[i], point_b = profile[i + 1];
        for (let step = 0; step < steps; step++) {
            const interpolation_factor = step / steps;
            interpolated_points.push(new THREE.Vector2(
                point_a.x + (point_b.x - point_a.x) * interpolation_factor,
                point_a.y + (point_b.y - point_a.y) * interpolation_factor,
            ));
        }
    }
    interpolated_points.push(profile[profile.length - 1]);
    return interpolated_points;
}

const LIGHT_WORLD_POSITION = new THREE.Vector3(5, 8, 5);
const _light_view_position = new THREE.Vector3();

export function createVolcano(scene) {
    const fine_profile = subdivideProfile(PROFILE, 24);
    const geometry = new THREE.LatheGeometry(fine_profile, 96);

    const material = new THREE.ShaderMaterial({
        vertexShader:   noise_glsl + vertex_glsl,
        fragmentShader: noise_glsl + fragment_glsl,
        uniforms: {
            u_light_position: { value: new THREE.Vector3() },
            u_disp_scale:     { value: 2.5  },  // Risstiefe in Welteinheiten
            u_disp_freq:      { value: 0.5  },  // Rissabstand (niedriger = groessere Risse)
            u_crack_freq:     { value: 1.0  },  // Rissfarb-Frequenz (Faerbungsmaske)
            u_rock_color:     { value: new THREE.Color(0xafafaf) },
            u_crack_color:    { value: new THREE.Color(0.003, 0.003, 0.003) },
        },
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    return { mesh, material };
}

export function updateVolcanoLight(material, camera) {
    _light_view_position.copy(LIGHT_WORLD_POSITION).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_position);
}
