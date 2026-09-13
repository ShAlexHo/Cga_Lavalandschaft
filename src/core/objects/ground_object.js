import { createGroundGeometry, bakeGroundDisplacement } from '../geometry/ground_geometry.js';
import { createGroundMaterial, updateGroundLight } from '../rendering/ground_material.js';
import { toHexColor } from '../rendering/color_utils.js';
import { bindSunUniforms } from './sun_uniform_utils.js';
import { bindDisplacementUniforms, bindCrackColorUniforms, bindSunFocusUniform } from './terrain_uniform_utils.js';

export function createGround(scene) {
    const material = createGroundMaterial();
    const mesh = createGroundGeometry(scene, material);

    let last_volcano_position = { x: 0, y: 0, z: 0 };

    const rebakeDisplacement = (volcano_position = last_volcano_position) => {
        last_volcano_position = volcano_position;
        bakeGroundDisplacement(mesh, {
            frequency: material.uniforms.u_displacement_frequency.value,
            scale: material.uniforms.u_displacement_scale.value,
            volcano_crack_frequency: material.uniforms.u_volcano_crack_frequency.value,
            volcano_crack_scale: material.uniforms.u_volcano_crack_scale.value,
            volcano_position,
            proximity_radius: material.uniforms.u_proximity_radius.value,
        });
    };

    return {
        mesh,
        rebakeDisplacement,
        update(camera, volcano_world_position, sun_world_position, time, sky_color) {
            last_volcano_position = volcano_world_position;
            updateGroundLight(material, camera, volcano_world_position, sun_world_position, time, sky_color);
        },

        getVisible: () => mesh.visible,
        setVisible: value => { mesh.visible = value; },
        getColor: () => toHexColor(material.uniforms.u_rock_color.value),
        setColor: value => material.uniforms.u_rock_color.value.set(value),
        getColor2: () => toHexColor(material.uniforms.u_rock_color_2.value),
        setColor2: value => material.uniforms.u_rock_color_2.value.set(value),
        getColor3: () => toHexColor(material.uniforms.u_rock_color_3.value),
        setColor3: value => material.uniforms.u_rock_color_3.value.set(value),
        getColor4: () => toHexColor(material.uniforms.u_rock_color_4.value),
        setColor4: value => material.uniforms.u_rock_color_4.value.set(value),
        getCrackSoftness: () => material.uniforms.u_crack_softness.value,
        setCrackSoftness: value => { material.uniforms.u_crack_softness.value = value; },
        getProximityColor: () => toHexColor(material.uniforms.u_proximity_color.value),
        setProximityColor: value => material.uniforms.u_proximity_color.value.set(value),
        getProximityNoiseColor: () => toHexColor(material.uniforms.u_proximity_noise_color.value),
        setProximityNoiseColor: value => material.uniforms.u_proximity_noise_color.value.set(value),
        getProximityRadius: () => material.uniforms.u_proximity_radius.value,
        setProximityRadius: value => { material.uniforms.u_proximity_radius.value = value; rebakeDisplacement(); },
        getSunFocusRadius: () => material.uniforms.u_sun_focus_radius.value,
        setSunFocusRadius: value => { material.uniforms.u_sun_focus_radius.value = value; },
        getRockVarianceRadius: () => material.uniforms.u_rock_variance_radius.value,
        setRockVarianceRadius: value => { material.uniforms.u_rock_variance_radius.value = value; },
        getVolcanoCrackScale: () => material.uniforms.u_volcano_crack_scale.value,
        setVolcanoCrackScale: value => { material.uniforms.u_volcano_crack_scale.value = value; rebakeDisplacement(); },
        getVolcanoCrackFrequency: () => material.uniforms.u_volcano_crack_frequency.value,
        setVolcanoCrackFrequency: value => { material.uniforms.u_volcano_crack_frequency.value = value; rebakeDisplacement(); },
        ...bindCrackColorUniforms(material),
        ...bindDisplacementUniforms(material, rebakeDisplacement),
        ...bindSunUniforms(material),
        ...bindSunFocusUniform(material),
    };
}
