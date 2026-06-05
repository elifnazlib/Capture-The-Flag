import * as THREE from 'three'
import { assetLoader } from '../world/AssetManager.js'

export function createEnemy() {
    const enemyGroup = new THREE.Group()
    enemyGroup.position.set(10, 1, 30)

    // Temporary placeholder while loading
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshStandardMaterial({
        color: 0x3333ff,
        wireframe: true
    })
    const placeholder = new THREE.Mesh(geometry, material)
    placeholder.castShadow = true
    placeholder.receiveShadow = true
    enemyGroup.add(placeholder)

    // Store a reference to the active rolling mesh
    enemyGroup.ballMesh = placeholder

    // Load the beachBall_blue.glb
    assetLoader.loadModel('/public/beachBall_blue.glb').then((model) => {
        // Remove placeholder
        enemyGroup.remove(placeholder)

        // Scale the model so it matches the expected radius (1.0)
        // Let's compute bounding box to scale it appropriately
        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scaleFactor = 2.0 / maxDim // target diameter = 2 (radius = 1)
        model.scale.set(scaleFactor, scaleFactor, scaleFactor)

        // Center the model geometry inside its local group
        model.position.set(0, 0, 0)

        enemyGroup.add(model)
        enemyGroup.ballMesh = model
    }).catch((err) => {
        console.error('Failed to load enemy beach ball model:', err)
    })

    return enemyGroup
}