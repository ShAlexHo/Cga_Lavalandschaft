import { createImpactSmokeGeometry } from '../geometry/impact_smoke_geometry.js';
import { createImpactSmokeMaterial, updateImpactSmoke } from '../rendering/impact_smoke_material.js';
import { bindSunUniforms } from './sun_uniform_utils.js';

export function createImpactSmoke(scene) {
    const material = createImpactSmokeMaterial();
    const mesh = createImpactSmokeGeometry(scene, material);

    return {
        mesh,
        update(bursts) {
            updateImpactSmoke(material, bursts);
        },
        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        ...bindSunUniforms(material),
    };
}
