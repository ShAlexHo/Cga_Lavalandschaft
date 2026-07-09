import * as THREE from 'three';
import { SMOKE_MAX_PARTICLES } from '../config.js';

export function createSmokeGeometry(scene, material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES * 3), 3));
    geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES), 1));
    geometry.setAttribute('a_color_mix', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES), 1));
    geometry.setAttribute('a_accent_mix', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES), 1));
    geometry.setAttribute('a_size_mult', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES), 1));
    geometry.setAttribute('a_shape_seed', new THREE.BufferAttribute(new Float32Array(SMOKE_MAX_PARTICLES), 1));

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, 0);
    scene.add(points);

    return points;
}

export function updateSmokeGeometry(points, particles) {
    const position_attribute = points.geometry.attributes.position;
    const opacity_attribute = points.geometry.attributes.a_opacity;
    const color_mix_attribute = points.geometry.attributes.a_color_mix;
    const accent_mix_attribute = points.geometry.attributes.a_accent_mix;
    const size_mult_attribute = points.geometry.attributes.a_size_mult;
    const shape_seed_attribute = points.geometry.attributes.a_shape_seed;

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        position_attribute.setXYZ(i, particle.x, particle.y, particle.z);
        opacity_attribute.setX(i, particle.opacity);
        color_mix_attribute.setX(i, particle.colorMix);
        accent_mix_attribute.setX(i, particle.accentMix);
        size_mult_attribute.setX(i, particle.sizeMult);
        shape_seed_attribute.setX(i, particle.shapeSeed);
    }

    position_attribute.needsUpdate = true;
    opacity_attribute.needsUpdate = true;
    color_mix_attribute.needsUpdate = true;
    accent_mix_attribute.needsUpdate = true;
    size_mult_attribute.needsUpdate = true;
    shape_seed_attribute.needsUpdate = true;
    points.geometry.setDrawRange(0, particles.length);
}
