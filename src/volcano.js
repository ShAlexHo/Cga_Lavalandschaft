import * as THREE from 'three';
import noiseGlsl  from './shaders/noise.glsl?raw';
import vertexGlsl from './shaders/volcano.vert?raw';
import fragGlsl   from './shaders/volcano.frag?raw';

const PROFILE = [
    new THREE.Vector2(14.0, 0.0),
    new THREE.Vector2(2.5,  5.0),
    new THREE.Vector2(1.0,  4.2),
];

function subdivide_profile(profile, steps) {
    const out = [];
    for (let i = 0; i < profile.length - 1; i++) {
        const a = profile[i], b = profile[i + 1];
        for (let s = 0; s < steps; s++) {
            const t = s / steps;
            out.push(new THREE.Vector2(
                a.x + (b.x - a.x) * t,
                a.y + (b.y - a.y) * t,
            ));
        }
    }
    out.push(profile[profile.length - 1]);
    return out;
}

const LIGHT_WORLD_POS  = new THREE.Vector3(5, 8, 5);
const _light_view_pos  = new THREE.Vector3();

export function create_volcano(scene) {
    const fine_profile = subdivide_profile(PROFILE, 24);
    const geometry = new THREE.LatheGeometry(fine_profile, 96);

    const material = new THREE.ShaderMaterial({
        vertexShader:   noiseGlsl + vertexGlsl,
        fragmentShader: noiseGlsl + fragGlsl,
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

export function update_volcano_light(material, camera) {
    _light_view_pos.copy(LIGHT_WORLD_POS).applyMatrix4(camera.matrixWorldInverse);
    material.uniforms.u_light_position.value.copy(_light_view_pos);
}
