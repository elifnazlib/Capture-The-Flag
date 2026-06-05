import * as THREE from 'three'

export function createGround() {
    const geometry = new THREE.PlaneGeometry(100, 100)

    const textureLoader = new THREE.TextureLoader();

    // Load diffuse map
    const diffuseMap = textureLoader.load('/sand1/everytexture.com-stock-nature-sand-00029-diffuse-1024.jpg');
    diffuseMap.wrapS = THREE.RepeatWrapping;
    diffuseMap.wrapT = THREE.RepeatWrapping;
    diffuseMap.repeat.set(8, 8); // Tile 8 times across the 100x100 plane

    // Load normal map for authentic lighting details
    const normalMap = textureLoader.load('/sand1/everytexture.com-stock-nature-sand-00029-normal-1024.jpg');
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(8, 8);

    // Load bump map for additional high-frequency micro details
    const bumpMap = textureLoader.load('/sand1/everytexture.com-stock-nature-sand-00029-bump-1024.jpg');
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(8, 8);

    const material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.4, 0.4),
        bumpMap: bumpMap,
        bumpScale: 0.03,
        roughness: 0.9,
        metalness: 0.1
    })

    const ground = new THREE.Mesh(geometry, material)

    ground.rotation.x = -Math.PI / 2

    ground.receiveShadow = true

    return ground
}