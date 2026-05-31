import * as THREE from 'three'

export class TagSystem {
    constructor(scene, camera, enemy, player) {
        this.scene = scene
        this.camera = camera
        this.enemy = enemy
        this.player = player

        this.raycaster = new THREE.Raycaster()

        this.cooldown = 500
        this.lastShotTime = 0

        this.debugLine = null

        window.addEventListener(
            'mousedown',
            (event) => {
                if (event.button === 0) {
                    this.tryShoot()
                }
            }
        )
    }

    tryShoot() {
        const now = Date.now()

        if (now - this.lastShotTime < this.cooldown) {
            return
        }

        this.lastShotTime = now

        // const origin = this.camera.position.clone()
        const origin = this.player.position.clone()

        const direction = new THREE.Vector3()
        // this.camera.getWorldDirection(direction)
        this.player.getWorldDirection(direction)

        this.raycaster.set(origin, direction)

        console.log(direction)

        const hits =
            this.raycaster.intersectObject(this.enemy)

        this.createDebugLine(
            origin,
            direction
        )

        if (hits.length > 0) {
            console.log('Enemy tagged!')

            this.respawnEnemy()
        }
    }

    respawnEnemy() {
        this.enemy.position.set(
            10,
            1,
            30
        )
    }

    createDebugLine(origin, direction) {
        if (this.debugLine) {
            this.scene.remove(this.debugLine)
        }

        const end = origin.clone().add(
            direction.clone().multiplyScalar(50)
        )

        const geometry =
            new THREE.BufferGeometry().setFromPoints([
                origin,
                end
            ])

        const material =
            new THREE.LineBasicMaterial({
                color: 0xffff00
            })

        this.debugLine = new THREE.Line(
            geometry,
            material
        )

        this.scene.add(this.debugLine)

        setTimeout(() => {
            if (this.debugLine) {
                this.scene.remove(this.debugLine)
                this.debugLine = null
            }
        }, 100)
    }
}