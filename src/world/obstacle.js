import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

const crateTexture = textureLoader.load('/public/crate.jpg')

crateTexture.wrapS = THREE.RepeatWrapping
crateTexture.wrapT = THREE.RepeatWrapping

export function createObstacle({
                                   width = 2,
                                   height = 2,
                                   depth = 2,
                                   x = 0,
                                   y = 1,
                                   z = 0
                               }) {

    const geometry = new THREE.BoxGeometry(width, height, depth)

    const material = new THREE.MeshStandardMaterial({
        map: crateTexture
    })

    const obstacle = new THREE.Mesh(geometry, material)

    obstacle.position.set(x, y, z)

    obstacle.castShadow = true
    obstacle.receiveShadow = true

    return obstacle
}