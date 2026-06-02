import './style.css'

import {setupScene} from './scene/setupScene.js'
import {setupCamera} from './scene/setupCamera.js'
import {setupRenderer} from './scene/setupRenderer.js'
import {setupLights} from './scene/setupLights.js'

import {createGround} from './world/ground.js'


import {createPlayer} from './entities/player.js'
import {InputController} from './controls/InputController.js'
import {PlayerController} from './controls/PlayerController.js'

import {createArena} from './world/arena.js'

import {createFlag} from './world/flag.js'
import {FlagSystem} from './gameplay/FlagSystem.js'
import {createScoreUI} from './ui/scoreUI.js'

import {createEnemy} from './entities/enemy.js'
import {EnemyFSM} from './ai/EnemyFSM.js'

import {TagSystem} from './gameplay/TagSystem.js'

import { CollisionSystem } from './world/CollisionSystem.js'

import { createOcean } from './world/ocean.js'

import assetLoader from "./world/AssetManager.js";


const scoreUI = createScoreUI()

const scene = setupScene();

const camera = setupCamera();

const renderer = setupRenderer();

setupLights(scene);

const ground = createGround();
scene.add(ground);

assetLoader.load('/public/Bee.gltf', scene, {x: 0, y: 0, z: 0}, 1);

const colliders = createArena(scene)

const ocean = createOcean()

scene.add(ocean.mesh)

const collisionSystem = new CollisionSystem(colliders)

const flag = createFlag()

flag.position.set(0, 0, -35)

scene.add(flag)

const player = createPlayer()
scene.add(player)

const enemy = createEnemy()
scene.add(enemy)

const tagSystem = new TagSystem(
    scene,
    camera,
    enemy,
    player
)

const flagSystem = new FlagSystem(
    player,
    flag,
    scoreUI
)

const enemyFSM = new EnemyFSM(
    enemy,
    player,
    flag,
    collisionSystem
)

const input = new InputController()

const playerController = new PlayerController(
    player,
    camera,
    input,
    collisionSystem
)

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    playerController.update()

    flagSystem.update()

    enemyFSM.update()

    flag.userData.flagMaterial.uniforms.time.value =
        performance.now() * 0.001;

    // ocean animation ONLY
    ocean.material.uniforms.time.value =
        performance.now() * 0.001

    renderer.render(scene, camera);
}

animate()

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})