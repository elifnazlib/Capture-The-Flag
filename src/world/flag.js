import * as THREE from 'three'

export function createFlag() {

    // container for all flag components --> pole + animated cloth
    const group = new THREE.Group()

    // flag pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    )

    pole.position.y = 1.5

    const flagMaterial = createFlagMaterial()

    // cloth geometry with many segments to allow smooth vertex animation
    const cloth = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1,
            0.6,
            30,   // horizontal subdivisions
            15    // vertical subdivisions
        ),
        flagMaterial
    )

    cloth.position.set(0.5, 2.5, 0)

    group.add(pole)
    group.add(cloth)

    // expose material for animation
    group.userData.flagMaterial = flagMaterial

    pole.castShadow = true
    pole.receiveShadow = true

    cloth.castShadow = true
    cloth.receiveShadow = true

    return group
}

function createFlagMaterial() {
    // custom shader material used to simulate wind driven cloth motion
    return new THREE.ShaderMaterial({
        // render both sides of the flag
        side: THREE.DoubleSide,
        glslVersion: THREE.GLSL3,

        uniforms: {
            // animation time updated every frame
            time: { value: 0 },

            topColor: {
                value: new THREE.Color(0xf7d914)
            },

            bottomColor: {
                value: new THREE.Color(0xf0e47a)
            }
        },

        vertexShader: `
      uniform float time;
      
      out vec2 vUv;

      void main() {

        // pass UV coordinates to the fragment shader
        vUv = uv;
        
        // local vertex position
        vec3 pos = position;

        // the part closest to the pole is fixed, the free end swings more
        float waveStrength = pow(uv.x, 1.5);

        // primary wave motion
        pos.z += sin( uv.x * 8.0 - time * 3.0 ) * 0.15 * waveStrength;

        // second small wave
        pos.z += sin( uv.x * 15.0 - time * 5.0 ) * 0.05 * waveStrength;

        // little up and down stretching
        pos.y += sin( uv.x * 10.0 - time * 4.0 ) * 0.03 * waveStrength;
        
        // transform the animated vertex into clip space
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,

        fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;

      in vec2 vUv;
      out vec4 fragColor;

      void main() {

        // interpolate between bottom and top colors
        vec3 color = mix( bottomColor, topColor, vUv.y );
        
        // subtle lighting effect
        color += vUv.x * 0.08;
        
        fragColor = vec4( color, 1.0 );
      }
    `
    })
}