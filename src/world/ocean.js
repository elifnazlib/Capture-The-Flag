import * as THREE from 'three'

export function createOcean() {

    const geometry =
        new THREE.PlaneGeometry(
            1000,
            750,
            64,
            64
        )

    const material =
        new THREE.ShaderMaterial({

            uniforms: {
                time: { value: 0 },

                deepColor: {
                    value: new THREE.Color(0x1383f2)
                },

                shallowColor: {
                    value: new THREE.Color(0x3399ff)
                }
            },

            vertexShader: `
                uniform float time;

                varying float vElevation;
                varying vec2 vUv;

                void main() {

                    vUv = uv;

                    vec3 pos = position;

                    float wave =
                        sin(pos.x * 0.1 + time * 1.5)
                        * 0.6;

                    wave +=
                        cos(pos.y * 0.1 + time * 1.2)
                        * 0.6;

                    pos.z += wave;

                    vElevation = wave;

                    gl_Position =
                        projectionMatrix *
                        modelViewMatrix *
                        vec4(pos, 1.0);
                }
            `,

            fragmentShader: `
                uniform vec3 deepColor;
                uniform vec3 shallowColor;

                varying float vElevation;
                varying vec2 vUv;

                void main() {

                    float mixStrength =
                        (vElevation + 1.2) / 2.4;

                    vec3 color =
                        mix(
                            deepColor,
                            shallowColor,
                            mixStrength
                        );

                    /*
                     * vUv.y:
                     * 0.0 = bir kenar
                     * 1.0 = diğer kenar
                     *
                     * İlk 20%'lik bölgede
                     * su yavaş yavaş görünür hale gelir.
                     */
                    float alpha =
                        smoothstep(
                            0.0,
                            0.2,
                            vUv.y
                        );

                    gl_FragColor =
                        vec4(color, alpha);
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