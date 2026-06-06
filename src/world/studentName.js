import assetLoader from './AssetManager.js';

export function setupStudentName(scene) {
    const letters = {
        'E': [
            { x: 0, z: -3 }, { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 },
            { x: 1.5, z: -3 }, { x: 3, z: -3 },
            { x: 1.5, z: 0 },
            { x: 1.5, z: 3 }, { x: 3, z: 3 }
        ],
        'L': [
            { x: 0, z: -3 }, { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 },
            { x: 1.5, z: 3 }, { x: 3, z: 3 }
        ],
        'I': [
            { x: 0, z: -3.8 },
            { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 }
        ],
        'F': [
            { x: 0, z: -3 }, { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 },
            { x: 1.5, z: -3 }, { x: 3, z: -3 },
            { x: 1.5, z: 0 }
        ]
    };

    // Position letters sequentially with spacing
    const word = ['E', 'L', 'I', 'F'];
    const letterWidth = 3;
    const letterSpacing = 2.5;

    // Total width of all letters and gaps:
    // 4 letters of width 3, and 3 gaps of 2.5 = 12 + 7.5 = 19.5
    // Centering it around x = 70:
    const startX = 140 - 19.5 / 2;
    const yCoord = -4.8;
    const zBase = 0;

    let currentX = startX;

    word.forEach((char) => {
        const points = letters[char];
        points.forEach((pt) => {
            const worldX = currentX + pt.x;
            const worldZ = zBase + pt.z;
            // Load the Bee asset at this position with scale 0.5 to look like small modules forming the letter
            assetLoader.load('/public/rock.glb', scene, { x: worldX, y: yCoord, z: worldZ }, 0.5);
        });
        currentX += letterWidth + letterSpacing;
    });
}
