import * as THREE from 'three'

export function setupScene() {
    const scene = new THREE.Scene()

    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
        '/public/skybox/right.bmp',
        '/public/skybox/left.bmp',
        '/public/skybox/top.bmp',
        '/public/skybox/bottom.bmp',
        '/public/skybox/front.bmp',
        '/public/skybox/back.bmp'
    ])
    scene.background = texture

    const fogColor = 0xd5eaf2;
    scene.fog =
        new THREE.Fog(
            fogColor,
            40,   // start distance
            75   // end distance
        )

    return scene
}