import * as THREE from 'three'

export function setupRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    return renderer
}