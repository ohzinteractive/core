attribute vec3 w_pos;
uniform float _Thickness;
varying vec2 vUv;

vec3 calculate_up(vec3 w_pos)
{
	vec3 v_dir = normalize((viewMatrix * vec4(w_pos, 1.0)).xyz);
	vec3 right = normalize(cross(v_dir, vec3(0. ,1., 0.)));
	return cross(right, v_dir);
}
vec3 calculate_right(vec3 w_pos)
{
	vec3 v_dir = normalize((viewMatrix * vec4(w_pos, 1.0)).xyz);
	return normalize(cross(v_dir, vec3(0. ,1., 0.)));
}

void main()
{


  vec3 up = calculate_up(w_pos) * (uv.y*2.0-1.0);
  vec3 right = calculate_right(w_pos) * (uv.x*2.0-1.0);
  
  vec3 normal = up+right; 
  vec3 pos = (viewMatrix*(modelMatrix*vec4(w_pos,1.0))).xyz + normal * (_Thickness * 0.5);

  gl_Position = projectionMatrix * vec4(pos, 1.0);
  gl_Position.zw -= _Thickness * 0.5;
  vUv = uv;

}