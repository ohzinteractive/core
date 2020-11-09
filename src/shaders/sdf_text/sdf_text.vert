
attribute vec4 transformsCol0;
attribute vec4 transformsCol1;
attribute vec4 transformsCol2;
attribute vec4 transformsCol3;

attribute vec4 glyph_bounds;
attribute vec4 plane_bounds;

attribute vec4 color;


varying vec2 vUv;
varying vec4 v_glyph_bounds;
varying vec4 v_color;

void main()
{
  vec4 pos = vec4(position, 1.0);
  pos.x *= plane_bounds.z;
  pos.y *= plane_bounds.w;

  pos.x += plane_bounds.x;
  pos.y += plane_bounds.y;


  mat4 offset_matrix = mat4(
      transformsCol0,
      transformsCol1,
      transformsCol2,
      transformsCol3
  );





  gl_Position = projectionMatrix * viewMatrix * offset_matrix * pos;
  vUv = uv;
  v_glyph_bounds = glyph_bounds;
  v_color = color;
}