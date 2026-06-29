import * as THREE from 'three'

export function setupScene() {
    const scene = new THREE.Scene()

    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
        './skybox/right.bmp',
        './skybox/left.bmp',
        './skybox/top.bmp',
        './skybox/bottom.bmp',
        './skybox/front.bmp',
        './skybox/back.bmp'
    ])
    scene.background = texture

    const fogColor = 0xd5eaf2;
    scene.fog = new THREE.Fog(fogColor, 40, 275)

    return scene
}