attribute vec3 barycentric;
varying vec3 vBarycentric;
void main()
{

  mat4 VP = projectionMatrix * viewMatrix;
  vec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = VP * vec4(pos, 1.0);
  vBarycentric = barycentric;
}