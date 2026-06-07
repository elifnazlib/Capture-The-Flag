import * as THREE from 'three'

// Creates simple colored team bases
export function createBase(color, x, z) {
    const group = new THREE.Group()

    // base platform
    const platformGeometry = new THREE.CylinderGeometry(
        4,
        4,
        1,
        32
    )

    const platformMaterial =
        new THREE.MeshStandardMaterial({
            color
        })

    const platform = new THREE.Mesh(
        platformGeometry,
        platformMaterial
    )

    platform.position.y = 0.5

    group.add(platform)

    // flag pole
    const poleGeometry = new THREE.CylinderGeometry(
        0.1,
        0.1,
        5
    )

    const poleMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        })

    const pole = new THREE.Mesh(
        poleGeometry,
        poleMaterial
    )

    pole.position.y = 3

    // flag
    const flagGeometry = new THREE.BoxGeometry(
        1.5,
        1,
        0.1
    )

    const flagMaterial =
        new THREE.MeshStandardMaterial({
            color
        })

    const flag = new THREE.Mesh(
        flagGeometry,
        flagMaterial
    )

    flag.position.set(0.8, 4, 0)

    group.position.set(x, 0, z)

    return group
}