import * as THREE from 'three'

import { createObstacle } from './obstacle'
import { createBase } from './base'
import assetLoader from "./AssetManager.js";

// This builds the full arena
export function createArena(scene) {

    const colliders = []

    const arenaSize = 50

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.0,
            depthWrite: false
        })

    const wallData = [
        { x: 0, z: -85, w: 200, d: 2 },
        { x: 0, z: 85, w: 200, d: 2 },
        { x: -85, z: 0, w: 2, d: 200 },
        { x: 85, z: 0, w: 2, d: 200 }
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
    const redBase = createBase(0xff3333, 0, -70)
    scene.add(redBase)

    // Blue base
    const blueBase = createBase(0x3333ff, 0, 70)
    scene.add(blueBase)

    // Obstacles
    const obstacleCount = 30

    for (let i = 0; i < obstacleCount; i++) {
        const safeZone = 25

        const x = randomRange(-arenaSize, arenaSize)
        const z = randomRange(-arenaSize, arenaSize)

        if (Math.abs(x) < safeZone && Math.abs(z) < safeZone) continue

        const width = randomRange(2, 5)
        const height = randomRange(2, 6)
        const depth = randomRange(2, 5)

        const obstacle = createObstacle({
            width,
            height,
            depth,
            x,
            y: height / 2,
            z
        })

        scene.add(obstacle)

        obstacle.userData.boundingBox =
            new THREE.Box3().setFromObject(obstacle)

        colliders.push(obstacle)
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min
    }

    function chance(prob) {
        return Math.random() < prob
    }

    const rows = 4
    const rowSpacing = 4
    const spacing = 5

    for (let offset = -90; offset <= 90; offset += spacing) {

        for (let row = 0; row < rows; row++) {

            const d = row * rowSpacing

            // Dış sıra büyük, iç sıra küçük
            const minScale = 0.6 - row * 0.1
            const maxScale = 1.0 - row * 0.1

            const treePositions = [
                { x: offset, z: -90 - d },
                { x: offset, z: 90 + d },
                { x: -90 - d, z: offset },
                { x: 90 + d, z: offset }
            ]

            treePositions.forEach(pos => {

                const baseX = pos.x + randomRange(-2, 2)
                const baseZ = pos.z + randomRange(-2, 2)

                const position = {
                    x: baseX,
                    y: 0,
                    z: baseZ
                }

                const scale = randomRange(minScale, maxScale)
                const rotation = randomRange(0, Math.PI * 2)

                // 1) AĞAÇ
                assetLoader.load(
                    '/palmTree.glb',
                    scene,
                    position,
                    scale,
                    rotation
                )

                // 2) ARAYA KAYA (her ağaç noktasında değil, %15 ihtimal)
                if (chance(0.15)) {

                    assetLoader.load(
                        '/rock.glb',
                        scene,
                        {
                            x: baseX + randomRange(-3, 3),
                            y: -0.2,
                            z: baseZ + randomRange(-3, 3)
                        },
                        randomRange(1, 1.5),
                        randomRange(0, Math.PI * 2)
                    )
                }
            })
        }
    }

    return colliders
}

// if (index < 3) {
//     obstacle.name = `Cube ${index + 1}`
// }