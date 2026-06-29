import * as THREE from 'three'
import { assetLoader } from '../world/AssetManager.js'

export function createPlayer() {
    const playerGroup = new THREE.Group()
    playerGroup.position.set(-10, 1, -60)

    // temporary placeholder while loading
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        wireframe: true
    })
    const placeholder = new THREE.Mesh(geometry, material)
    placeholder.castShadow = true
    placeholder.receiveShadow = true
    playerGroup.add(placeholder)

    // store a reference to the active rolling mesh
    playerGroup.ballMesh = placeholder

    // load the beachBall_red.glb
    assetLoader.loadModel('./beachBall_red.glb').then((model) => {
        // remove placeholder
        playerGroup.remove(placeholder)

        // sscale the model so it matches the expected radius of 1 unit
        // and compute bounding box to scale it appropriately
        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scaleFactor = 2.0 / maxDim
        model.scale.set(scaleFactor, scaleFactor, scaleFactor)

        // center the model geometry inside its local group
        model.position.set(0, 0, 0)

        playerGroup.add(model)
        playerGroup.ballMesh = model
    }).catch((err) => {
        console.error('Failed to load player beach ball model:', err)
    })

    return playerGroup
}