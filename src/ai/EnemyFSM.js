import * as THREE from 'three'

export const EnemyState = {
    SEEK_FLAG: 'SEEK_FLAG',
    RETURN_HOME: 'RETURN_HOME',
    CHASE_PLAYER: 'CHASE_PLAYER'
}

export class EnemyFSM {
    constructor(enemy, player, flag, collisionSystem, flagSystem) {
        this.enemy = enemy
        this.player = player
        this.flag = flag
        this.collisionSystem = collisionSystem
        this.flagSystem = flagSystem

        this.state = EnemyState.SEEK_FLAG

        this.speed = 0.05

        this.homePosition = new THREE.Vector3(
            0,
            1,
            35
        )
    }

    changeState(newState) {
        if (this.state === newState) return

        console.log(
            `Enemy State: ${this.state} -> ${newState}`
        )

        this.state = newState
    }

    moveTowards(targetPosition) {
        const forward =
            targetPosition.clone()
                .sub(this.enemy.position)

        forward.y = 0

        if (forward.length() < 0.01) {
            return
        }

        forward.normalize()

        // Try normal movement first
        if (this.tryMove(forward)) {
            // this.enemy.lookAt(
            //     targetPosition.x,
            //     this.enemy.position.y,
            //     targetPosition.z
            // )

            return
        }

        // 45 degree left
        const left = forward.clone()

        left.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 4
        )

        if (this.tryMove(left)) {
            return
        }

        // 45 degree right
        const right = forward.clone()

        right.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -Math.PI / 4
        )

        if (this.tryMove(right)) {
            return
        }

        // 90 degree left
        const hardLeft = forward.clone()

        hardLeft.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 2
        )

        if (this.tryMove(hardLeft)) {
            return
        }

        // 90 degree right
        const hardRight = forward.clone()

        hardRight.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -Math.PI / 2
        )

        this.tryMove(hardRight)
    }

    update() {
        if (this.flagSystem.enemyHasFlag())
        {
            if (this.state !== EnemyState.RETURN_HOME)
            {
                this.changeState(EnemyState.RETURN_HOME)
            }
        }

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

        if (this.flagSystem.enemyHasFlag())
        {
            this.changeState(EnemyState.RETURN_HOME)
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

        if (
            !this.flagSystem.enemyHasFlag()
        ) {

            this.changeState(
                EnemyState.SEEK_FLAG
            )

            return
        }

        this.moveTowards(
            this.homePosition
        )

        const homeDistance =
            this.enemy.position.distanceTo(
                this.homePosition
            )

        if (homeDistance < 2) {

            console.log(
                'Enemy captured the flag!'
            )

            this.flagSystem.resetFlag()

            this.changeState(
                EnemyState.SEEK_FLAG
            )
        }
    }

    tryMove(direction) {
        const movement =
            direction.clone()
                .multiplyScalar(this.speed)

        const nextPosition =
            this.enemy.position.clone()
                .add(movement)

        if (
            this.collisionSystem.canMove(
                nextPosition
            )
        ) {
            this.enemy.position.copy(
                nextPosition
            )

            // Roll the ball!
            if (this.enemy.ballMesh) {
                const radius = 1.0
                const distance = movement.length()
                const angle = distance / radius

                const up = new THREE.Vector3(0, 1, 0)
                const axis = new THREE.Vector3().crossVectors(up, direction).normalize()

                if (axis.lengthSq() > 0) {
                    this.enemy.ballMesh.rotateOnWorldAxis(axis, angle)
                }
            }

            return true
        }

        return false
    }
}