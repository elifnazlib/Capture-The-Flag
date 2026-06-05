import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'

// A super simple loader that automatically supports both modern (.glb / .gltf)
// and legacy (.obj) 3D formats based on the file extension.
export class AssetLoader {
    constructor() {
        this.gltfLoader = new GLTFLoader()
        this.objLoader = new OBJLoader()
        this.cache = {} // Caches loaded models
    }

    // Loads a 3D model (.glb, .gltf, or .obj), caches it, sets up shadows, and places it in the scene.
    load(url, scene, position = {x: 0, y: 0, z: 0}, scale = 1, name = '') {
        // 1. If already cached, clone and place instantly
        if (this.cache[url]) {
            const clone = this.cache[url].clone()
            clone.position.set(position.x, position.y, position.z)
            clone.scale.set(scale, scale, scale)
            scene.add(clone)
            return
        }

        // 2. Detect format based on extension
        const isObj = url.toLowerCase().endsWith('.obj')
        const loader = isObj ? this.objLoader : this.gltfLoader

        // 3. Load the file
        loader.load(url, (loadedData) => {
            // OBJLoader returns the 3D group directly. GLTFLoader returns an object with a .scene property.
            const modelScene = isObj ? loadedData : loadedData.scene

            // Automatically enable shadows for all sub-meshes in the model
            modelScene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            // Cache it
            this.cache[url] = modelScene

            // Clone and place
            // const clone = modelScene.clone()
            const clone = SkeletonUtils.clone(modelScene)
            clone.position.set(position.x, position.y, position.z)
            clone.scale.set(scale, scale, scale)

            if (name) {
                clone.name = name;
            }

            scene.add(clone)

            console.log(`[AssetLoader] Successfully loaded & cached: ${url}`)
        })
    }
}

export const assetLoader = new AssetLoader()
export default assetLoader