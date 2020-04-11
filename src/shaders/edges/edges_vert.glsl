attribute vec3 tangent;
uniform float _Thickness;

vec3 calculate_normal(vec3 w_pos, vec3 tangent)
{

	vec3 up = normalize(cross(normalize(cameraPosition - w_pos), tangent));
	return up;
	// return cross(tangent, up);
}

void main()
{

  mat4 VP = projectionMatrix * viewMatrix;

  vec3 pos = position;
  vec3 w_pos   = (modelMatrix * vec4(position, 1.0)).xyz;

  vec3 normal = calculate_normal(w_pos, tangent);
  pos = (modelMatrix * vec4(pos, 1.0)).xyz;
  pos += normal * (_Thickness * 0.5) * (uv.x*2.0-1.0);

  gl_Position = VP * vec4(pos, 1.0);
  gl_Position.zw -= _Thickness * 0.5;

}
