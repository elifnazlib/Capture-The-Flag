import * as THREE from 'three'

export function setupLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

    directionalLight.position.set(10, 20, 10)

    scene.add(directionalLight)
}