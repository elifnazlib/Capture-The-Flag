import './style.css'

import { setupScene } from './scene/setupScene.js'
import { setupCamera } from './scene/setupCamera.js'
import { setupRenderer } from './scene/setupRenderer.js'
import { setupLights } from './scene/setupLights.js'

import { createGround } from './world/ground.js'


import { createPlayer } from './entities/player.js'
import { InputController } from './controls/InputController.js'
import { PlayerController } from './controls/PlayerController.js'

import { createArena } from './world/arena.js'

import { createFlag } from './world/flag.js'
import { FlagSystem } from './gameplay/FlagSystem.js'
import { createScoreUI } from './ui/scoreUI.js'


const scoreUI = createScoreUI()

const scene = setupScene();

const camera = setupCamera();

const renderer = setupRenderer();

setupLights(scene);

const ground = createGround();
scene.add(ground);

createArena(scene);

const flag = createFlag()

flag.position.set(0, 0, -35)

scene.add(flag)

const player = createPlayer()
scene.add(player)

const flagSystem = new FlagSystem(
    player,
    flag,
    scoreUI
)

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

    flagSystem.update()

    renderer.render(scene, camera);
}

animate()

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})