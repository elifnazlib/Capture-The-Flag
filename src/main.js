import './style.css'

import { setupScene } from './scene/setupScene.js'
import { setupCamera } from './scene/setupCamera.js'
import { setupRenderer } from './scene/setupRenderer.js'
import { setupLights } from './scene/setupLights.js'

import { createGround } from './world/ground.js'


import { createPlayer } from './entities/player'
import { InputController } from './controls/InputController'
import { PlayerController } from './controls/PlayerController'

const scene = setupScene();

const camera = setupCamera();

const renderer = setupRenderer();

setupLights(scene);

const ground = createGround();
scene.add(ground);

const player = createPlayer()
scene.add(player)

const input = new InputController()

const playerController = new PlayerController(
    player,
    camera,
    input
)

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    playerController.update()

    renderer.render(scene, camera);
}

animate()

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})