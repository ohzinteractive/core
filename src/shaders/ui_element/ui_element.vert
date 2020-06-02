uniform vec2 _ScreenSize;
uniform vec2 _TextureSize;
uniform vec2 _PixelOffset;
uniform vec3 _NDC;
uniform vec2 _PivotPoint;
uniform float _DepthOffset;
varying vec2 vUv;


vec2 add_pixel_offset(vec2 pos)
{
	pos = pos * 0.5 + 0.5;
	pos *= _ScreenSize;
	pos = ceil(pos+_PixelOffset)+0.5;
	pos /= _ScreenSize;
	return pos * 2.0 - 1.0;
}
void main()
{
	vec4 projected_pos = projectionMatrix * viewMatrix * vec4(_NDC, 1.0);
  projected_pos.zw += _DepthOffset;

	projected_pos.xyz /= projected_pos.w;

  vec2 normalized_size = _TextureSize/_ScreenSize;
  vec2 dir = uv * 2.0 - 1.0;
  dir -= _PivotPoint;
  vec2 pos = projected_pos.xy+dir * normalized_size;
  gl_Position = vec4(add_pixel_offset(pos), projected_pos.z, 1.0);
  vUv = uv;

}
