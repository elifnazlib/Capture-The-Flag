import * as THREE from 'three'

export function createGround() {
    const geometry = new THREE.PlaneGeometry(210, 210)

    const textureLoader = new THREE.TextureLoader();

    // load diffuse map for the base color of the sand
    const diffuseMap = textureLoader.load('/sand1/sand-diffuse-1024.jpg');
    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    diffuseMap.wrapS = THREE.RepeatWrapping;
    diffuseMap.wrapT = THREE.RepeatWrapping;
    diffuseMap.repeat.set(8, 8);

    // load normal map for adding lighting detail without increasing geometry complexity
    const normalMap = textureLoader.load('/sand1/sand-normal-1024.jpg');
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(8, 8);

    // load bump map for additional small scale height variation
    const bumpMap = textureLoader.load('/sand1/sand-bump-1024.jpg');
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(8, 8);

     // physically based material for realistic lighting
    const material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.7, 0.7),
        bumpMap: bumpMap,
        bumpScale: 0.03,
        roughness: 1.0,
        metalness: 0.0
    })

    // combine geometry and material into a renderable mesh
    const ground = new THREE.Mesh(geometry, material)

    // rotate the plane so it lies horizontally on the ground
    ground.rotation.x = -Math.PI / 2

    // allow the ground to receive shadows from other objects
    ground.receiveShadow = true

    return ground
}