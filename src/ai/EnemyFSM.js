import * as THREE from 'three'

export const EnemyState = {
    SEEK_FLAG: 'SEEK_FLAG',
    RETURN_HOME: 'RETURN_HOME',
    CHASE_PLAYER: 'CHASE_PLAYER'
}

export class EnemyFSM {
    constructor(enemy, player, flag, collisionSystem) {
        this.enemy = enemy
        this.player = player
        this.flag = flag
        this.collisionSystem = collisionSystem

        this.state = EnemyState.SEEK_FLAG

        this.speed = 0.05

        this.homePosition = new THREE.Vector3(
            0,
            1,
            35
        )

        this.isCarryingFlag = false
    }

    changeState(newState) {
        if (this.state === newState) return

        console.log(
            `Enemy State: ${this.state} -> ${newState}`
        )

        this.state = newState
    }

    moveTowards(targetPosition) {
        const direction = targetPosition
            .clone()
            .sub(this.enemy.position)

        direction.y = 0

        if (direction.length() > 0.01) {
            direction.normalize()

            const movement = direction.clone().multiplyScalar(this.speed)
            const nextPosition = this.enemy.position.clone().add(movement)

            if (this.collisionSystem.canMove(nextPosition))
            {
                this.enemy.position.copy(nextPosition)
            }

            this.enemy.lookAt(
                targetPosition.x,
                this.enemy.position.y,
                targetPosition.z
            )
        }
    }

    update() {
        const playerDistance =
            this.enemy.position.distanceTo(
                this.player.position
            )

        switch (this.state) {
            case EnemyState.SEEK_FLAG:
                this.updateSeekFlag(playerDistance)
                break

            case EnemyState.CHASE_PLAYER:
                this.updateChasePlayer(playerDistance)
                break

            case EnemyState.RETURN_HOME:
                this.updateReturnHome()
                break
        }
    }

    updateSeekFlag(playerDistance) {
        if (playerDistance < 8) {
            this.changeState(
                EnemyState.CHASE_PLAYER
            )
            return
        }

        this.moveTowards(this.flag.position)

        const flagDistance =
            this.enemy.position.distanceTo(
                this.flag.position
            )

        if (flagDistance < 2) {
            this.isCarryingFlag = true

            this.changeState(
                EnemyState.RETURN_HOME
            )
        }
    }

    updateChasePlayer(playerDistance) {
        this.moveTowards(this.player.position)

        if (playerDistance > 15) {
            this.changeState(
                EnemyState.SEEK_FLAG
            )
        }
    }

    updateReturnHome() {
        this.flag.position.copy(
            this.enemy.position
        )

        this.flag.position.y = 3

        this.moveTowards(this.homePosition)

        const homeDistance =
            this.enemy.position.distanceTo(
                this.homePosition
            )

        if (homeDistance < 2) {
            console.log(
                'Enemy captured the flag!'
            )

            this.isCarryingFlag = false

            this.flag.position.set(
                0,
                0,
                -35
            )

            this.changeState(
                EnemyState.SEEK_FLAG
            )
        }
    }
}