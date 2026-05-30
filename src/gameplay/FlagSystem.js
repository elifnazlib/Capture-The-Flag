import * as THREE from 'three'

export class FlagSystem {
    constructor(player, flag, scoreUI) {
        this.player = player
        this.flag = flag
        this.scoreUI = scoreUI

        this.score = 0

        this.isCarryingFlag = false

        // Blue base position from arena.js
        this.captureBase = new THREE.Vector3(
            0,
            0,
            35
        )
    }

    update() {
        const playerPos = this.player.position

        // Pickup
        if (!this.isCarryingFlag) {
            const distanceToFlag =
                playerPos.distanceTo(
                    this.flag.position
                )

            if (distanceToFlag < 2) {
                this.isCarryingFlag = true
            }
        }

        // Follow player
        if (this.isCarryingFlag) {
            this.flag.position.copy(playerPos)

            this.flag.position.y = 3

            const distanceToBase =
                playerPos.distanceTo(
                    this.captureBase
                )

            if (distanceToBase < 5) {
                this.score++

                this.scoreUI.textContent =
                    `Score: ${this.score}`

                this.resetFlag()
            }
        }
    }

    resetFlag() {
        this.isCarryingFlag = false

        this.flag.position.set(
            0,
            0,
            -35
        )
    }
}