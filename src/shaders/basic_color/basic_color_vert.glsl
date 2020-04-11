varying vec2 vUv;

void main()
{
  vec3 pos = position;
  mat4 MVP = projectionMatrix * modelViewMatrix;

  gl_Position = MVP * vec4( pos, 1.0 );
  vUv = uv;
}