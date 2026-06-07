import * as THREE from 'three'

export function createOcean() {

    const geometry =
        new THREE.PlaneGeometry(
            10000,
            10000,
            128,
            128
        )

    const material =
        new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,

            uniforms: {
                time: { value: 0 },

                deepColor: {
                    value: new THREE.Color(0x4ea0f2)
                },

                shallowColor: {
                    value: new THREE.Color(0xb7d7f7)
                }
            },

            vertexShader: `
                uniform float time;

                out float vElevation;
                out vec2 vUv;

                void main() {

                    vUv = uv;
                    vec3 pos = position;

                    float wave = sin(pos.x * 0.1 + time * 1.5) * 0.6;
                    wave += cos(pos.y * 0.1 + time * 1.2) * 0.6;

                    pos.z += wave;
                    vElevation = wave;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,

            fragmentShader: `
                uniform vec3 deepColor;
                uniform vec3 shallowColor;

                in float vElevation;
                in vec2 vUv;
                out vec4 fragColor;

                void main() {

                    float mixStrength = (vElevation + 1.2) / 2.4;

                    vec3 color = mix( deepColor, shallowColor, mixStrength );

                    float alpha = smoothstep( 0.0, 0.2, vUv.y );

                    fragColor = vec4(color, alpha);
                }
            `,

            transparent: true,
            side: THREE.DoubleSide
        })

    const ocean =
        new THREE.Mesh(
            geometry,
            material
        )

    ocean.name = 'Ocean'

    ocean.rotation.x = -Math.PI / 2

    ocean.position.set(
        0,
        -5,
        0
    )

    return {
        mesh: ocean,
        material
    }
}