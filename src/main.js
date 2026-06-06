import './style.css'
import * as THREE from 'three'

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

import {createSettingsUI} from './ui/settingsUI.js'

import {createEnemy} from './entities/enemy.js'
import {EnemyFSM, EnemyState} from './ai/EnemyFSM'

import {TagSystem} from './gameplay/TagSystem.js'

import { CollisionSystem } from './world/CollisionSystem.js'

import { createOcean } from './world/ocean.js'

import assetLoader from "./world/AssetManager.js";
import { setupStudentName } from './world/studentName.js';
import { createHelpUI } from './ui/helpUI.js';


const scoreUI = createScoreUI()
createHelpUI()

const scene = setupScene();

const camera = setupCamera();

const freeCamera = setupCamera();
const cameraState = {
    active: camera,
    original: camera,
    free: freeCamera
};

const renderer = setupRenderer();

const lights = setupLights(scene);
createSettingsUI(lights, cameraState);

const ground = createGround();
scene.add(ground);

assetLoader.load('/public/Bee.gltf', scene, {x: 0, y: 0, z: 0}, 1, 0,'Bee');

const colliders = createArena(scene)
setupStudentName(scene)

// Camera Transition States and Variables
let cameraMode = 'FOLLOW'; // 'FOLLOW', 'TRANSITION_TO_NAME', 'SHOW_NAME', 'TRANSITION_TO_FOLLOW'
let transitionProgress = 0;
const transitionDuration = 1.5; // seconds
const nameViewPos = new THREE.Vector3(140, 25, 0); // Top-down view position
const nameViewTarget = new THREE.Vector3(140, 0.2, 0); // Center of the name

const startPosition = new THREE.Vector3();
const startQuaternion = new THREE.Quaternion();
const targetPosition = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();

// A dummy camera to calculate target quaternions
const tempCamera = new THREE.PerspectiveCamera();

// Keyboard shortcut listener for camera transition
window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyN') {
        if (cameraMode === 'FOLLOW') {
            cameraMode = 'TRANSITION_TO_NAME';
            playerController.cameraMode = 'NAME_VIEW';
            transitionProgress = 0;

            startPosition.copy(camera.position);
            startQuaternion.copy(camera.quaternion);

            targetPosition.copy(nameViewPos);

            // Calculate target quaternion
            tempCamera.position.copy(nameViewPos);
            tempCamera.up.set(0, 0, -1);
            tempCamera.lookAt(nameViewTarget);
            targetQuaternion.copy(tempCamera.quaternion);
        } else if (cameraMode === 'SHOW_NAME') {
            cameraMode = 'TRANSITION_TO_FOLLOW';
            transitionProgress = 0;

            startPosition.copy(camera.position);
            startQuaternion.copy(camera.quaternion);
        }
    }
});

let lastTime = performance.now();

let currentShaderMode = 0; // 0: Normal, 1: Blinn-Phong, 2: Toon
const shaderModes = ['Normal', 'Blinn-Phong', 'Toon'];

const phongVertexUrl = '/shaders/phongVertex.glsl';
const phongFragmentUrl = '/shaders/phongFragment.glsl';
const toonVertexUrl = '/shaders/toonVertex.glsl';
const toonFragmentUrl = '/shaders/toonFragment.glsl';

let postScene = null;
let postCamera = null;
let renderTarget = null;
let postQuad = null;

let phongMaterial = null;
let toonMaterial = null;

let shadersLoaded = false;
let phongVertexSource = '';
let phongFragmentSource = '';
let toonVertexSource = '';
let toonFragmentSource = '';

Promise.all([
    fetch(phongVertexUrl).then(r => r.text()),
    fetch(phongFragmentUrl).then(r => r.text()),
    fetch(toonVertexUrl).then(r => r.text()),
    fetch(toonFragmentUrl).then(r => r.text())
]).then(([pvSrc, pfSrc, tvSrc, tfSrc]) => {
    const cleanShader = (src) => src.replace(/^\uFEFF/, '').trim();
    phongVertexSource = cleanShader(pvSrc);
    phongFragmentSource = cleanShader(pfSrc);
    toonVertexSource = cleanShader(tvSrc);
    toonFragmentSource = cleanShader(tfSrc);

    renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    postScene = new THREE.Scene();
    postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    phongMaterial = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: phongVertexSource,
        fragmentShader: phongFragmentSource,
        uniforms: {
            tDiffuse: { value: renderTarget.texture },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTime: { value: 0 }
        },
        depthWrite: false,
        depthTest: false
    });

    toonMaterial = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: toonVertexSource,
        fragmentShader: toonFragmentSource,
        uniforms: {
            tDiffuse: { value: renderTarget.texture },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTime: { value: 0 }
        },
        depthWrite: false,
        depthTest: false
    });

    const postQuadGeo = new THREE.PlaneGeometry(2, 2);
    postQuad = new THREE.Mesh(postQuadGeo, phongMaterial);
    postScene.add(postQuad);

    shadersLoaded = true;
}).catch(err => {
    console.error('Error loading shaders:', err);
});

// Listener for switching shaders
window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyK') {
        currentShaderMode = (currentShaderMode + 1) % 3;
        console.log(`[Shader Mode] Switched to: ${shaderModes[currentShaderMode]}`);
    }
});

const ocean = createOcean()

scene.add(ocean.mesh)

const collisionSystem = new CollisionSystem(colliders)

const flag = createFlag()
flag.name = 'Flag'

flag.position.set(0, 0, 0)

scene.add(flag)

const player = createPlayer()
player.name = 'Player'
scene.add(player)

const enemy = createEnemy()
enemy.name = 'Enemy'
scene.add(enemy)

const flagSystem = new FlagSystem(
    player,
    enemy,
    flag,
    scoreUI
)

const tagSystem = new TagSystem(
    scene,
    camera,
    enemy,
    player,
    flagSystem
)

const enemyFSM = new EnemyFSM(
    enemy,
    player,
    flag,
    collisionSystem,
    flagSystem
)

const input = new InputController()

const playerController = new PlayerController(
    player,
    camera,
    input,
    collisionSystem
)
window.playerController = playerController;

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    playerController.update()

    if (cameraMode === 'TRANSITION_TO_NAME') {
        transitionProgress += deltaTime / transitionDuration;
        if (transitionProgress >= 1) {
            transitionProgress = 1;
            cameraMode = 'SHOW_NAME';
            playerController.cameraMode = 'NAME_VIEW';
        }
        const t = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
        camera.position.lerpVectors(startPosition, targetPosition, t);
        camera.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, t);
        camera.up.lerpVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1), t);
    } else if (cameraMode === 'TRANSITION_TO_FOLLOW') {
        transitionProgress += deltaTime / transitionDuration;
        if (transitionProgress >= 1) {
            transitionProgress = 1;
            cameraMode = 'FOLLOW';
            playerController.cameraMode = 'FOLLOW';
            camera.up.set(0, 1, 0);
        } else {
            const t = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
            const cameraOffset = new THREE.Vector3(0, 6, -8);
            cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerController.cameraRotationY);
            const dynamicFollowPos = player.position.clone().add(cameraOffset);

            tempCamera.position.copy(dynamicFollowPos);
            tempCamera.up.set(0, 1, 0);
            tempCamera.lookAt(player.position);

            camera.position.lerpVectors(startPosition, dynamicFollowPos, t);
            camera.quaternion.slerpQuaternions(startQuaternion, tempCamera.quaternion, t);
            camera.up.lerpVectors(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), t);
        }
    } else if (cameraMode === 'SHOW_NAME') {
        camera.position.copy(nameViewPos);
        camera.up.set(0, 0, -1);
        camera.lookAt(nameViewTarget);
    }

    flagSystem.update()

    enemyFSM.update()

    flag.userData.flagMaterial.uniforms.time.value =
        performance.now() * 0.001;

    // ocean animation ONLY
    ocean.material.uniforms.time.value =
        performance.now() * 0.001

    if (lights && lights.spotlightHelper && lights.spotlightHelper.visible) {
        lights.spotlightHelper.update()
    }

    if (shadersLoaded && currentShaderMode > 0) {
        if (currentShaderMode === 1) {
            postQuad.material = phongMaterial;
            phongMaterial.uniforms.uTime.value = performance.now() * 0.001;
            phongMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        } else if (currentShaderMode === 2) {
            postQuad.material = toonMaterial;
            toonMaterial.uniforms.uTime.value = performance.now() * 0.001;
            toonMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }

        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, cameraState.active);

        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
    } else {
        renderer.setRenderTarget(null);
        renderer.render(scene, cameraState.active);
    }
}

animate()

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    freeCamera.aspect = window.innerWidth / window.innerHeight;
    freeCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (renderTarget) {
        renderTarget.setSize(window.innerWidth, window.innerHeight);
    }
})