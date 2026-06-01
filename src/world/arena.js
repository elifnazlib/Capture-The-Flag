import * as THREE from 'three'

import { createObstacle } from './obstacle'
import { createBase } from './base'

// This builds the full arena
export function createArena(scene) {

    const colliders = []

    // Arena walls
    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x444444
        })

    const wallData = [
        { x: 0, z: -50, w: 100, d: 2 },
        { x: 0, z: 50, w: 100, d: 2 },
        { x: -50, z: 0, w: 2, d: 100 },
        { x: 50, z: 0, w: 2, d: 100 }
    ]

    wallData.forEach((wall) => {
        const geometry = new THREE.BoxGeometry(
            wall.w,
            6,
            wall.d
        )

        const mesh = new THREE.Mesh(
            geometry,
            wallMaterial
        )

        mesh.position.set(wall.x, 3, wall.z)

        scene.add(mesh)

        mesh.userData.boundingBox =
            new THREE.Box3().setFromObject(mesh)

        colliders.push(mesh)
    })

    // Red base
    const redBase = createBase(0xff3333, 0, -35)
    scene.add(redBase)

    // Blue base
    const blueBase = createBase(0x3333ff, 0, 35)
    scene.add(blueBase)

    // Obstacles
    const obstacles = [
        { x: -10, z: -10 },
        { x: 10, z: -10 },
        { x: -10, z: 10 },
        { x: 10, z: 10 },

        { x: -20, z: 0, width: 3, height: 5 },
        { x: 20, z: 0, width: 3, height: 5 },

        // { x: 0, z: 0, width: 8, height: 3, depth: 8 }
    ]

    obstacles.forEach((data) => {
        const obstacle = createObstacle({
            width: data.width || 4,
            height: data.height || 4,
            depth: data.depth || 4,
            x: data.x,
            y: (data.height || 4) / 2,
            z: data.z
        })

        scene.add(obstacle)

        obstacle.userData.boundingBox =
            new THREE.Box3().setFromObject(obstacle)

        colliders.push(obstacle)
    })

    return colliders
}