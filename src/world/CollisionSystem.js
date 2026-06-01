import * as THREE from 'three'

export class CollisionSystem {
    constructor(colliders) {
        this.colliders = colliders

        this.tempBox = new THREE.Box3()
    }

    canMove(position, size = 0.5) {
        this.tempBox.setFromCenterAndSize(
            position,
            new THREE.Vector3(
                size * 2,
                2,
                size * 2
            )
        )

        for (const collider of this.colliders) {
            if (
                this.tempBox.intersectsBox(
                    collider.userData.boundingBox
                )
            ) {
                return false
            }
        }

        return true
    }
}