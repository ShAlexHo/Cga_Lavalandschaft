import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createGodRaysPass } from './god_rays_pass.js';
import { BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD, BLOOM_TINT_COLOR } from '../config.js';

export function createPostProcessing({ renderer, scene, camera }) {
    const bloom_pass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        BLOOM_STRENGTH,
        BLOOM_RADIUS,
        BLOOM_THRESHOLD
    );
    bloom_pass.bloomTintColors.fill(new THREE.Vector3(BLOOM_TINT_COLOR.x, BLOOM_TINT_COLOR.y, BLOOM_TINT_COLOR.z));

    const god_rays_pass = createGodRaysPass({ scene, camera });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(god_rays_pass);
    composer.addPass(bloom_pass);

    return {
        composer,
        bloom_pass,
        god_rays_pass,
        setOccluders: ({ sun_mesh, occluder_meshes }) => god_rays_pass.setTargets({ sun_mesh, occluder_meshes }),
        resize: (width, height) => composer.setSize(width, height),
        render: () => composer.render(),
    };
}
