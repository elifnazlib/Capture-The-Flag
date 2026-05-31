import * as THREE from 'three'

export function setupScene() {
    const scene = new THREE.Scene()

    const skyColor = 0x87ceeb

    scene.background =
        new THREE.Color(skyColor)

    scene.fog =
        new THREE.Fog(
            skyColor,
            40,   // start distance
            120   // end distance
        )

    return scene
}