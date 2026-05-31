import * as THREE from 'three'

export function setupLights(scene) {

    // Soft ambient light
    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.45
        )

    scene.add(ambientLight)

    // Sun light
    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1.5
        )

    sun.position.set(
        30,
        40,
        20
    )

    sun.castShadow = true

    // Shadow quality
    sun.shadow.mapSize.width = 1024
    sun.shadow.mapSize.height = 1024

    // Shadow camera area
    sun.shadow.camera.left = -60
    sun.shadow.camera.right = 60
    sun.shadow.camera.top = 60
    sun.shadow.camera.bottom = -60

    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 120

    scene.add(sun)
}