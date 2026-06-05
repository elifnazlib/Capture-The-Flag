varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = vUv;
    vec4 color = texture2D(tDiffuse, uv);
    
    // Estimate normals from color gradient (luminance values)
    float stepX = 1.0 / uResolution.x;
    float stepY = 1.0 / uResolution.y;
    
    float lL = dot(texture2D(tDiffuse, uv + vec2(-stepX, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float lR = dot(texture2D(tDiffuse, uv + vec2(stepX, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float lB = dot(texture2D(tDiffuse, uv + vec2(0.0, -stepY)).rgb, vec3(0.299, 0.587, 0.114));
    float lT = dot(texture2D(tDiffuse, uv + vec2(0.0, stepY)).rgb, vec3(0.299, 0.587, 0.114));
    
    vec3 normal = normalize(vec3(lR - lL, lT - lB, 0.15));
    
    // Dynamic light direction (circulating light)
    vec3 lightDir = normalize(vec3(cos(uTime * 0.5), sin(uTime * 0.5), 0.8));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    
    // Ambient, Diffuse, Specular
    float ambient = 0.45;
    float diffuse = max(dot(normal, lightDir), 0.0) * 0.65;
    
    // Shininess coefficient
    float spec = pow(max(dot(normal, halfDir), 0.0), 48.0) * 0.45;
    
    // Mix lights and original color
    vec3 finalColor = color.rgb * (ambient + diffuse) + vec3(1.0, 0.95, 0.85) * spec;
    
    gl_FragColor = vec4(finalColor, color.a);
}
