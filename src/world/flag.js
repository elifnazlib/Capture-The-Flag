import * as THREE from 'three'
import { createFlagMaterial } from '../shaders/flagShader.js'
import {color} from "three/tsl";

export function createFlag() {
    const group = new THREE.Group()

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    )

    pole.position.y = 1.5

    const flagMaterial = createFlagMaterial()

    const cloth = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1,
            0.6,
            30, // width segments
            15  // height segments
        ),
        flagMaterial
    )

    cloth.position.set(0.5, 2.5, 0)

    group.add(pole)
    group.add(cloth)

    // expose material for animation
    group.userData.flagMaterial = flagMaterial

    pole.castShadow = true
    pole.receiveShadow = true

    cloth.castShadow = true
    cloth.receiveShadow = true

    return group
}