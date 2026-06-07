import * as THREE from 'three'

export function setupLights(scene) {

    // soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)

    scene.add(ambientLight)

    // sunlight --> directional light
    const sun = new THREE.DirectionalLight(0xffffff, 1.5)

    sun.position.set(30, 40, 20)

    sun.castShadow = true

    // shadow quality
    sun.shadow.mapSize.width = 1024
    sun.shadow.mapSize.height = 1024

    // shadow camera area
    sun.shadow.camera.left = -120
    sun.shadow.camera.right = 120
    sun.shadow.camera.top = 120
    sun.shadow.camera.bottom = -120

    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 300

    scene.add(sun)
    scene.add(sun.target)

    // spotlight pointing at the center
    const spotlight = new THREE.SpotLight(0xfffaed, 20.0, 100, Math.PI / 6, 0.5, 1)
    spotlight.position.set(0, 20, 0)

    const target = new THREE.Object3D()
    target.position.set(0, 0, 0)
    scene.add(target)
    spotlight.target = target

    spotlight.castShadow = true
    spotlight.shadow.mapSize.width = 2048
    spotlight.shadow.mapSize.height = 2048
    spotlight.shadow.camera.near = 10
    spotlight.shadow.camera.far = 100
    spotlight.shadow.focus = 1

    scene.add(spotlight)

    // add helper
    const spotlightHelper = new THREE.SpotLightHelper(spotlight)
    scene.add(spotlightHelper)

    // keep helper and spotlight on initially
    spotlight.visible = true
    spotlightHelper.visible = true

    return { ambientLight, sun, spotlight, spotlightHelper }
}