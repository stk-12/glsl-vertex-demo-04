varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

varying vec3 vNormal;
varying float vDistortion;
varying vec3 vRotation;

void main() {
  vec2 uv = vUv;

  float distortion = vDistortion * 0.1;

  // vec3 RED = vec3(0.831, 0.247, 0.552);
  // vec3 BLUE = vec3(0.007, 0.313, 0.772);

  // vec3 color = mix(RED, BLUE, 0.5);
  // gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(uv, 1.0, 1.0);

  // vec3 color = vec3(BLUE.r + distortion, BLUE.g + distortion, BLUE.b + distortion);

  // vec3 color = vec3(BLUE + vRotation * 0.5 + distortion);
  // vec3 color = vec3(
  //   BLUE.r + vRotation.x + distortion,
  //   BLUE.g + vRotation.y + distortion,
  //   BLUE.b + vRotation.z + distortion
  // );
  vec3 color = vec3(
    uColor.r + vRotation.x,
    uColor.g + vRotation.x,
    uColor.b + vRotation.x
  );

  gl_FragColor = vec4(color, 1.0);
}