varying vec3 v_pos;

void main()
{
  mat4 MVP = projectionMatrix * modelViewMatrix;

  v_pos = (modelViewMatrix * vec4( position, 1.0 )).xyz;
  gl_Position = MVP * vec4( position, 1.0 );
}