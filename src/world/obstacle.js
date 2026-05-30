import * as THREE from 'three'

// Reusable obstacle function
export function createObstacle({
                                   width = 2,
                                   height = 2,
                                   depth = 2,
                                   color = 0x666666,
                                   x = 0,
                                   y = 1,
                                   z = 0
                               }) {
    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    )

    const material = new THREE.MeshStandardMaterial({
        color
    })

    const obstacle = new THREE.Mesh(
        geometry,
        material
    )

    obstacle.position.set(x, y, z)

    obstacle.castShadow = true
    obstacle.receiveShadow = true

    return obstacle
}