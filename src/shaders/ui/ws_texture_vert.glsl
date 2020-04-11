
uniform vec2 _ScreenSize;
uniform vec2 _TextSize;
uniform vec2 _PixelOffset;
uniform float _DepthOffset;
uniform float _FixedDepth;
uniform float _DepthValue;
uniform float _UseAbsoluteScreenPosition;
uniform vec2 _ScreenPosition;
uniform float _WorldTextSize;
varying vec2 vUv;



void main()
{
  vec3 w_pos;
  w_pos.x = modelMatrix[0][3];
  w_pos.y = modelMatrix[1][3];
  w_pos.z = modelMatrix[2][3];

  vec2 dir = uv * 2.0 - 1.0;
  dir.x *= (_TextSize.x / _TextSize.y);

  vec4 view_pos = modelViewMatrix * vec4(w_pos, 1.0);
  vec3 forward = vec3(0., 0., 1.);
  vec3 binormal = normalize(cross(forward, vec3(0.0, -1.0, 0.0)));
  vec3 up = cross(forward, binormal);
  vec3 normal = (binormal * dir.x + up * dir.y);

  normal = normalize(normal);
  view_pos.xyz += normal * _WorldTextSize * 0.5;

  gl_Position = projectionMatrix * view_pos;


  vUv = uv;

}