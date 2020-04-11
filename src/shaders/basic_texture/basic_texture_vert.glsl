varying vec2 vUv;
uniform float _ScreenAligned;
uniform float _Scale;
void main()
{
  vec3 pos = position;

  mat4 local_to_camera = modelViewMatrix;
  // float scale = length(vec3(modelMatrix[0][0], modelMatrix[1][1], modelMatrix[2][2]))/2.0;
  float scale = _Scale;
  local_to_camera[0] = mix(modelViewMatrix[0], vec4(1.0 * scale, 0.0, 0.0, 0.0), _ScreenAligned);
  local_to_camera[1] = mix(modelViewMatrix[1], vec4(0.0, 1.0 * scale, 0.0, 0.0), _ScreenAligned);
  local_to_camera[2] = mix(modelViewMatrix[2], vec4(0.0, 0.0, 1.0 * scale, 0.0), _ScreenAligned);

  gl_Position = projectionMatrix * local_to_camera * vec4( pos, 1.0 );
  vUv = uv;
}