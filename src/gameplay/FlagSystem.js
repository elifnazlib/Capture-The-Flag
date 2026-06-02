import * as THREE from 'three'

export class FlagSystem {
    constructor(player, enemy, flag, scoreUI) {
        this.player = player
        this.enemy = enemy
        this.flag = flag
        this.scoreUI = scoreUI

        this.score = 0

        this.carrier = null

        this.stealProtectionUntil = 0

        // Blue base position from arena.js
        this.captureBase = new THREE.Vector3(
            0,
            0,
            35
        )
    }

    update() {

        const playerPos = this.player.position
        const enemyPos = this.enemy.position

        // Pickup dropped flag
        if (!this.carrier) {

            if (
                playerPos.distanceTo(this.flag.position) < 2
            ) {
                this.setCarrier(this.player)
            }

            else if (
                enemyPos.distanceTo(this.flag.position) < 2
            ) {
                this.setCarrier(this.enemy)
            }
        }

        // Follow carrier
        if (this.carrier) {

            this.flag.position.copy(
                this.carrier.position
            )

            this.flag.position.y = 3
        }

        // Steal logic
        const distance =
            playerPos.distanceTo(enemyPos)

        if (
            distance < 2 &&
            this.canSteal()
        ) {

            if (this.enemyHasFlag()) {

                console.log(
                    'Player stole flag'
                )

                this.setCarrier(this.player)
            }

            else if (this.playerHasFlag()) {

                console.log(
                    'Enemy stole flag'
                )

                this.setCarrier(this.enemy)
            }
        }

        // Player score
        if (this.playerHasFlag()) {

            const distanceToBase =
                playerPos.distanceTo(
                    this.captureBase
                )

            if (distanceToBase < 5) {

                console.log(
                    'Player scored'
                )

                this.score++

                this.scoreUI.textContent =
                    `Score: ${this.score}`

                this.resetFlag()
            }
        }

        // Enemy score
        if (this.enemyHasFlag()) {

            const distanceToBase =
                enemyPos.distanceTo(
                    this.captureBase
                )

            if (distanceToBase < 5) {

                console.log(
                    'Enemy scored'
                )

                this.resetFlag()
            }
        }
    }

    resetFlag() {

        console.log('Flag reset to neutral state')
        this.carrier = null
        this.flag.position.set(
            0,
            0,
            -35
        )

        this.flag.position.y = 0
    }

    playerHasFlag() {
        return this.carrier === this.player
    }

    enemyHasFlag() {
        return this.carrier === this.enemy
    }

    canSteal() {
        return Date.now() > this.stealProtectionUntil
    }

    setCarrier(carrier) {

        this.carrier = carrier

        this.stealProtectionUntil =
            Date.now() + 2500

        if (carrier === this.player) {
            console.log('Player has flag')
        }

        if (carrier === this.enemy) {
            console.log('Enemy has flag')
        }
    }

    dropFlag(position) {

        console.log('Flag dropped')

        this.carrier = null

        this.flag.position.copy(position)

        this.flag.position.y = 0
    }
}