import * as THREE from 'three'

export function createFlagMaterial() {
    return new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        glslVersion: THREE.GLSL3,

        uniforms: {
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

        // Pass UV coordinates
        vUv = uv;

        vec3 pos = position;

        // The part closest to the pole is fixed,
        // the top part swings more
        float waveStrength = pow(uv.x, 1.5);

        // Main wave
                pos.z +=
                    sin(
                        uv.x * 8.0 -
                        time * 3.0
                    ) *
                    0.15 *
                    waveStrength;

        // Second small wave
        pos.z +=
            sin(
                uv.x * 15.0 -
                time * 5.0
            ) *
            0.05 *
            waveStrength;

        // Little up and down stretching
        pos.y +=
            sin(
                uv.x * 10.0 -
                time * 4.0
            ) *
            0.03 *
            waveStrength;
        
        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(pos, 1.0);
      }
    `,

        fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;

      in vec2 vUv;
      out vec4 fragColor;

      void main() {

        // Interpolate between
        // bottom and top colors.
        vec3 color = mix(
          bottomColor,
          topColor,
          vUv.y
        );
        
        // Subtle lighting effect
        color += vUv.x * 0.08;
        
        fragColor = vec4(
          color,
          1.0
        );
      }
    `
    })
}