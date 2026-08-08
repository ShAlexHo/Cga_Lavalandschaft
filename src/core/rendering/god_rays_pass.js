import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { GOD_RAYS_RESOLUTION_SCALE } from '../config.js';
import { toHexColor } from '../objects/color_utils.js';
import {
    createGodRaysOcclusionMaterial, createGodRaysSunDiscMaterial, createGodRaysGenerateMaterial,
    createGodRaysCombineMaterial,
} from './god_rays_material.js';

const _sun_ndc = new THREE.Vector3();
const _camera_forward = new THREE.Vector3();
const _to_sun = new THREE.Vector3();
const _old_clear_color = new THREE.Color();

function smoothstep(edge0, edge1, x) {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
}

class GodRaysPass extends Pass {
    constructor({ scene, camera }) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.sun_mesh = null;
        this.occluder_meshes = [];

        this.occlusion_material = createGodRaysOcclusionMaterial();
        this.sun_disc_material = createGodRaysSunDiscMaterial();
        this.generate_material = createGodRaysGenerateMaterial();
        this.combine_material = createGodRaysCombineMaterial();

        // depthTexture lets combine reuse this depth to tell solid ground/volcano from open sky
        this.occlusion_target = new THREE.WebGLRenderTarget(1, 1, { depthTexture: new THREE.DepthTexture(1, 1) });
        this.god_rays_target = new THREE.WebGLRenderTarget(1, 1);

        this._quad = new FullScreenQuad(this.generate_material);
    }

    setTargets({ sun_mesh, occluder_meshes }) {
        this.sun_mesh = sun_mesh;
        this.occluder_meshes = occluder_meshes;
    }

    getWeight() { return this.generate_material.uniforms.u_weight.value; }
    setWeight(value) { this.generate_material.uniforms.u_weight.value = value; }
    getExposure() { return this.generate_material.uniforms.u_exposure.value; }
    setExposure(value) { this.generate_material.uniforms.u_exposure.value = value; }
    getDecay() { return this.generate_material.uniforms.u_decay.value; }
    setDecay(value) { this.generate_material.uniforms.u_decay.value = value; }
    getDensity() { return this.generate_material.uniforms.u_density.value; }
    setDensity(value) { this.generate_material.uniforms.u_density.value = value; }
    getTintColor() { return toHexColor(this.combine_material.uniforms.u_tint.value); }
    setTintColor(value) { this.combine_material.uniforms.u_tint.value.set(value); }

    setSize(width, height) {
        const target_width = Math.max(1, Math.floor(width * GOD_RAYS_RESOLUTION_SCALE));
        const target_height = Math.max(1, Math.floor(height * GOD_RAYS_RESOLUTION_SCALE));
        this.occlusion_target.setSize(target_width, target_height);
        this.god_rays_target.setSize(target_width, target_height);
        this.generate_material.uniforms.u_aspect.value = width / height;
    }

    render(renderer, write_buffer, read_buffer) {
        // faded out before the sun leaves the frustum, or a point behind the camera mirrors on-screen
        this.camera.getWorldDirection(_camera_forward);
        _to_sun.subVectors(this.sun_mesh.position, this.camera.position).normalize();
        const facing = _camera_forward.dot(_to_sun);
        const visibility = smoothstep(-0.1, 0.3, facing);
        this.generate_material.uniforms.u_visibility.value = visibility;

        _sun_ndc.copy(this.sun_mesh.position).project(this.camera);
        this.generate_material.uniforms.u_light_uv.value.set(_sun_ndc.x * 0.5 + 0.5, _sun_ndc.y * 0.5 + 0.5);

        const old_auto_clear = renderer.autoClear;
        const old_render_target = renderer.getRenderTarget();
        renderer.getClearColor(_old_clear_color);
        const old_clear_alpha = renderer.getClearAlpha();
        renderer.autoClear = false;

        // occlusion mask: hide all but ground/volcano, draw black, then add the sun as a depth-tested disc
        const visibility_backup = this.scene.children.map(child => child.visible);
        this.scene.children.forEach(child => { child.visible = this.occluder_meshes.includes(child); });

        // bypasses overrideMaterial, so it must be hidden or it floods the mask
        const original_background = this.scene.background;
        this.scene.background = null;

        this.scene.overrideMaterial = this.occlusion_material;
        renderer.setRenderTarget(this.occlusion_target);
        renderer.setClearColor(0x000000, 1);
        renderer.clear(true, true, true);
        renderer.render(this.scene, this.camera);

        this.scene.overrideMaterial = null;
        this.scene.background = original_background;

        const original_sun_material = this.sun_mesh.material;
        const original_sun_visible = this.sun_mesh.visible;
        this.sun_mesh.material = this.sun_disc_material;
        this.sun_mesh.visible = true;
        renderer.setRenderTarget(this.occlusion_target);
        renderer.render(this.sun_mesh, this.camera);
        this.sun_mesh.material = original_sun_material;
        this.sun_mesh.visible = original_sun_visible;

        this.scene.children.forEach((child, index) => { child.visible = visibility_backup[index]; });

        this.generate_material.uniforms.u_occlusion.value = this.occlusion_target.texture;
        renderer.setRenderTarget(this.god_rays_target);
        renderer.clear();
        this._quad.material = this.generate_material;
        this._quad.render(renderer);

        this.combine_material.uniforms.u_base.value = read_buffer.texture;
        this.combine_material.uniforms.u_god_rays.value = this.god_rays_target.texture;
        this.combine_material.uniforms.u_depth.value = this.occlusion_target.depthTexture;
        renderer.setRenderTarget(this.renderToScreen ? null : write_buffer);
        if (this.clear) renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
        this._quad.material = this.combine_material;
        this._quad.render(renderer);

        renderer.setClearColor(_old_clear_color, old_clear_alpha);
        renderer.setRenderTarget(old_render_target);
        renderer.autoClear = old_auto_clear;
    }

    dispose() {
        this.occlusion_target.dispose();
        this.god_rays_target.dispose();
        this.occlusion_material.dispose();
        this.sun_disc_material.dispose();
        this.generate_material.dispose();
        this.combine_material.dispose();
        this._quad.dispose();
    }
}

export function createGodRaysPass(options) {
    return new GodRaysPass(options);
}
