import { createImpactSmokeGeometry } from '../geometry/impact_smoke_geometry.js';
import { createImpactSmokeMaterial, updateImpactSmoke } from '../rendering/impact_smoke_material.js';
import { particle_seeds } from '../animation/impact_smoke_particles.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindVisibility } from './visibility_utils.js';

export function createImpactSmoke(scene) {
    const material = createImpactSmokeMaterial();
    const mesh = createImpactSmokeGeometry(scene, material, particle_seeds);

    return {
        mesh,
        update(camera, sun_world_position, bursts) {
            updateImpactSmoke(material, camera, sun_world_position, bursts);
        },
        ...bindVisibility(mesh),
        ...bindSunUniforms(material),
    };
}
