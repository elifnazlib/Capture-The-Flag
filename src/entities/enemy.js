import * as THREE from 'three'

// Simple blue cube enemy
export function createEnemy() {
    const enemy = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 1),
        new THREE.MeshStandardMaterial({
            color: 0x3333ff
        })
    )

    enemy.position.set(10, 1, 30)

    return enemy
}