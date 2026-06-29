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
            { x: 0.7, z: -3 }, { x: 0.7, z: -1.5 }, { x: 0.7, z: 0 }, { x: 0.7, z: 1.5 }, { x: 0.7, z: 3 },
            { x: 2.2, z: 3 }, { x: 3.7, z: 3 }
        ],
        'İ': [
            { x: 1.3, z: -5.6 },
            { x: 1.3, z: -3 }, { x: 1.3, z: -1.5 }, { x: 1.3, z: 0 }, { x: 1.3, z: 1.5 }, { x: 1.3, z: 3 }
        ],
        'F': [
            { x: -1, z: -3 }, { x: -1, z: -1.5 }, { x: -1, z: 0 }, { x: -1, z: 1.5 }, { x: -1, z: 3 },
            { x: 0.5, z: -3 }, { x: 2, z: -3 },
            { x: 0.5, z: 0 }
        ],
        ' ': [],
        'N': [
            { x: 0, z: -3 }, { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 },
            { x: 1, z: -1.5 }, { x: 2, z: 0 }, { x: 3, z: 1.5 },
            { x: 4, z: -3 }, { x: 4, z: -1.5 }, { x: 4, z: 0 }, { x: 4, z: 1.5 }, { x: 4, z: 3 }
        ],
        'A': [
            { x: 1, z: -3 }, { x: 1, z: -1.5 }, { x: 1, z: 0 }, { x: 1, z: 1.5 }, { x: 1, z: 3 },
            { x: 2.5, z: -3 }, { x: 4, z: -3 },
            { x: 4, z: -1.5 }, { x: 4, z: 0 }, { x: 4, z: 1.5 }, { x: 4, z: 3 },
            { x: 2.5, z: 0 }
        ],
        'Z': [
            { x: 1, z: -3 }, { x: 2.5, z: -3 }, { x: 4, z: -3 },
            { x: 3, z: -1.5 }, { x: 2.25, z: 0 }, { x: 1.5, z: 1.5 },
            { x: 1, z: 3 }, { x: 2.5, z: 3 }, { x: 4, z: 3 }
        ],
        'I': [
            { x: 1.5, z: -3 }, { x: 1.5, z: -1.5 }, { x: 1.5, z: 0 }, { x: 1.5, z: 1.5 }, { x: 1.5, z: 3 }
        ],
        'B': [
            { x: -1, z: -3 }, { x: -1, z: -1.5 }, { x: -1, z: 0 }, { x: -1, z: 1.5 }, { x: -1, z: 3 },
            { x: 0.5, z: -3 }, { x: 2, z: -3 },
            { x: 2, z: -1.5 },
            { x: 0.5, z: 0 }, { x: 2, z: 0 },
            { x: 2, z: 1.5 },
            { x: 0.5, z: 3 }, { x: 2, z: 3 }
        ],
        'Ö': [
            { x: 0.3, z: -5.6 }, { x: 1.9, z: -5.6 },
            { x: -0.3, z: -3 }, { x: 1.2, z: -3 }, { x: 2.7, z: -3 },
            { x: -0.3, z: -1.5 }, { x: 2.7, z: -1.5 },
            { x: -0.3, z: 0 }, { x: 2.7, z: 0 },
            { x: -0.3, z: 1.5 }, { x: 2.7, z: 1.5 },
            { x: -0.3, z: 3 }, { x: 1.2, z: 3 }, { x: 2.7, z: 3 }
        ],
        'K': [
            { x: 0, z: -3 }, { x: 0, z: -1.5 }, { x: 0, z: 0 }, { x: 0, z: 1.5 }, { x: 0, z: 3 },
            { x: 1.5, z: -1.5 }, { x: 3, z: -3 },
            { x: 1.5, z: 1.5 }, { x: 3, z: 3 }
        ]
    };

    const words = ["ELİF", "NAZLI", "BÖKE"];
    const letterWidth = 3;
    const letterSpacing = 2.5;
    const rowSpacing = 12;
    const yCoord = -4.8;

    words.forEach((wordStr, rowIndex) => {
        const word = wordStr.split('');
        const totalWidth = word.length * letterWidth + (word.length - 1) * letterSpacing;
        const startX = 140 - totalWidth / 2;
        const zBase = (rowIndex - 1) * rowSpacing;

        let currentX = startX;

        word.forEach((char) => {
            const points = letters[char];
            if (points) {
                points.forEach((pt) => {
                    const worldX = currentX + pt.x;
                    const worldZ = zBase + pt.z;
                    assetLoader.load('./rock.glb', scene, { x: worldX, y: yCoord, z: worldZ }, 0.5);
                });
            }
            currentX += letterWidth + letterSpacing;
        });
    });
}
