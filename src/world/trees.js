import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'

function randomRange(min, max) {
    return Math.random() * (max - min) + min
}

export function createTree(treeModel, x, z) {

    const tree = SkeletonUtils.clone(treeModel)

    tree.position.set(
        x + randomRange(-2, 2),
        0,
        z + randomRange(-2, 2)
    )

    tree.rotation.y = randomRange(0, Math.PI * 2)

    const scale = randomRange(0.8, 1.4)
    tree.scale.setScalar(scale)

    return tree
}