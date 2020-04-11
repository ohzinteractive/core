varying vec3 v_normal;
varying vec3 v_pos;

void main()
{
  vec3 pos = position;
  mat4 MVP = projectionMatrix * modelViewMatrix;

  v_normal 	= (modelViewMatrix * vec4(normal, 0.0)).xyz;
  v_pos 		= (modelViewMatrix * vec4( pos, 1.0 )).xyz;

  gl_Position = MVP * vec4( pos, 1.0 );
}