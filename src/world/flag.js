import * as THREE from 'three'

export function createFlag() {
    const group = new THREE.Group()

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    )

    pole.position.y = 1.5

    const cloth = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.6, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
    )

    cloth.position.set(0.5, 2.5, 0)

    group.add(pole)
    group.add(cloth)

    return group
}