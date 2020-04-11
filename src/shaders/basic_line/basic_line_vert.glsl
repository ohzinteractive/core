uniform float _Thickness;


attribute vec3 next_position;
attribute vec3 previous_position;
attribute float orientation;
attribute float coverage;

varying float line_coverage;
varying float uv_u;

vec3 w_space_normal(vec3 from, vec3 to)
{
  vec3 w_from = (modelMatrix * vec4(from, 1.0)).xyz;
  vec3 w_to   = (modelMatrix * vec4(to, 1.0)).xyz;

  vec3 z = normalize(w_to - w_from);
  return normalize(cross(z , normalize(cameraPosition - w_from)));

}

void main()
{

  mat4 VP = projectionMatrix * viewMatrix;

  vec3 pos = position;
  vec3 normal = w_space_normal(next_position ,previous_position);
  pos = (modelMatrix * vec4(pos, 1.0)).xyz;
  pos += normal * (_Thickness * 0.5) * orientation;

  gl_Position = VP * vec4(pos, 1.0);

  line_coverage = coverage;
  uv_u = orientation * 0.5 + 0.5;

}