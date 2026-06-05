import * as THREE from 'three'

export function setupRenderer() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: context,
        antialias: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.shadowMap.enabled = true

    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    document.body.appendChild(renderer.domElement)

    return renderer
}