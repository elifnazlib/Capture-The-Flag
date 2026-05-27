import * as THREE from 'three'

// This handles: movement, sprint, mouse rotation, camera follow

export class PlayerController {
    constructor(player, camera, input) {
        this.player = player
        this.camera = camera
        this.input = input

        this.moveSpeed = 0.1
        this.sprintSpeed = 0.18
        this.mouseSensitivity = 0.002

        this.cameraRotationY = 0

        this.setupPointerLock()
        this.setupMouseLook()
    }

    setupPointerLock() {
        document.addEventListener('click', () => {
            document.body.requestPointerLock()
        })
    }

    setupMouseLook() {
        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === document.body) {
                this.cameraRotationY -= event.movementX * this.mouseSensitivity
            }
        })
    }

    update() {
        const speed = this.input.isKeyDown('ShiftLeft')
            ? this.sprintSpeed
            : this.moveSpeed

        const forward = new THREE.Vector3(
            Math.sin(this.cameraRotationY),
            0,
            Math.cos(this.cameraRotationY)
        )

        const right = new THREE.Vector3(
            -forward.z,
            0,
            forward.x
        )

        const moveDirection = new THREE.Vector3()

        if (this.input.isKeyDown('KeyW')) {
            moveDirection.add(forward)
        }

        if (this.input.isKeyDown('KeyS')) {
            moveDirection.sub(forward)
        }

        if (this.input.isKeyDown('KeyA')) {
            moveDirection.sub(right)
        }

        if (this.input.isKeyDown('KeyD')) {
            moveDirection.add(right)
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize()

            this.player.position.add(
                moveDirection.multiplyScalar(speed)
            )

            this.player.rotation.y = this.cameraRotationY
        }

        // Third-person camera follow
        const cameraOffset = new THREE.Vector3(0, 6, -8)

        cameraOffset.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            this.cameraRotationY
        )

        this.camera.position.copy(
            this.player.position.clone().add(cameraOffset)
        )

        this.camera.lookAt(this.player.position)
    }
}