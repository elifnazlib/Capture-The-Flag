import * as THREE from 'three'

export class FlagSystem {
    constructor(player, enemy, flag, scoreUI) {
        this.player = player
        this.enemy = enemy
        this.flag = flag
        this.scoreUI = scoreUI

        this.score = 0
        this.enemyScore = 0

        this.scoreUI.textContent =
            `Player: 0 | Enemy: 0`

        this.winScore = 5
        this.gameOver = false

        this.carrier = null

        this.stealProtectionUntil = 0

        this.centerPosition = new THREE.Vector3(0, 0, 0)

        // Blue base (enemy's)
        this.enemyBase = new THREE.Vector3(0, 0, 35)

        // Red base (player's)
        this.playerBase = new THREE.Vector3(0, 0, -35)

        this.winText = document.createElement('div')

        this.winText.style.position = 'absolute'
        this.winText.style.top = '50%'
        this.winText.style.left = '50%'
        this.winText.style.transform = 'translate(-50%, -50%)'
        this.winText.style.fontSize = '48px'
        this.winText.style.color = 'white'
        this.winText.style.fontWeight = 'bold'
        this.winText.style.display = 'none'
        this.winText.style.textShadow = '0 0 10px black'

        document.body.appendChild(this.winText)

        this.restartButton = document.createElement('button')

        this.restartButton.textContent = 'Restart'
        this.restartButton.style.position = 'absolute'
        this.restartButton.style.top = '60%'
        this.restartButton.style.left = '50%'
        this.restartButton.style.transform = 'translate(-50%, -50%)'
        this.restartButton.style.fontSize = '24px'
        this.restartButton.style.padding = '10px 20px'
        this.restartButton.style.cursor = 'pointer'
        this.restartButton.style.display = 'none'

        document.body.appendChild(this.restartButton)

        this.restartButton.addEventListener('click', () => {
            window.location.reload()
        })
    }

    update() {
        if (this.gameOver) return

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
                    this.playerBase
                )

            if (distanceToBase < 5) {

                console.log(
                    'Player scored'
                )

                this.score++
                this.checkWin()

                this.scoreUI.textContent =
                    `Player: ${this.score} | Enemy: ${this.enemyScore}`

                this.resetFlag()
            }
        }

        // Enemy score
        if (this.enemyHasFlag()) {

            const distanceToBase =
                enemyPos.distanceTo(
                    this.enemyBase
                )

            if (distanceToBase < 5) {

                console.log(
                    'Enemy scored'
                )

                this.enemyScore++
                this.checkWin()

                this.scoreUI.textContent =
                    `Player: ${this.score} | Enemy: ${this.enemyScore}`

                this.resetFlag()
            }
        }
    }

    resetFlag() {

        console.log('Flag reset to center')
        this.carrier = null
        this.flag.position.set(
            this.centerPosition.x,
            0,
            this.centerPosition.z
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

    checkWin() {

        if (this.score >= this.winScore) {
            this.endGame('PLAYER WINS!')
        }

        if (this.enemyScore >= this.winScore) {
            this.endGame('ENEMY WINS!')
        }
    }

    endGame(text) {
        document.exitPointerLock?.()

        if (this.gameOver) return

        this.gameOver = true

        console.log(text)

        this.winText.textContent = text
        this.winText.style.display = 'block'

        this.restartButton.style.display = 'block'

        document.body.style.cursor = 'auto'
    }
}