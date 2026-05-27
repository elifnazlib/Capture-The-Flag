import * as THREE from 'three'

// This creates: a simple cube player

export function createPlayer() {
    const geometry = new THREE.BoxGeometry(1, 2, 1)

    const material = new THREE.MeshStandardMaterial({
        color: 0xff4444
    })

    const player = new THREE.Mesh(geometry, material)

    player.position.y = 1

    return player
}