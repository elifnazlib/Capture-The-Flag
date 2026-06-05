precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = vUv;
    vec4 color = texture(tDiffuse, uv);

    // Toon shading color quantization/banding (4 levels)
    vec3 toonColor = floor(color.rgb * 4.0) / 4.0;

    // Sobel Filter for outline detection
    float stepX = 1.0 / uResolution.x;
    float stepY = 1.0 / uResolution.y;

    float gX = 0.0;
    float gY = 0.0;

    // Sobel operator kernels
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec4 c = texture(tDiffuse, uv + vec2(float(i) * stepX, float(j) * stepY));
            float intensity = dot(c.rgb, vec3(0.299, 0.587, 0.114));

            float kX = 0.0;
            if (i == -1) kX = (j == 0) ? -2.0 : -1.0;
            else if (i == 1) kX = (j == 0) ? 2.0 : 1.0;

            float kY = 0.0;
            if (j == -1) kY = (i == 0) ? -2.0 : -1.0;
            else if (j == 1) kY = (i == 0) ? 2.0 : 1.0;

            gX += intensity * kX;
            gY += intensity * kY;
        }
    }

    float edge = sqrt(gX * gX + gY * gY);

    // High contrast toon colors and black outlines
    vec3 finalColor = toonColor;
    if (edge > 0.25) {
        finalColor = vec3(0.0);
    }

    fragColor = vec4(finalColor, color.a);
}
