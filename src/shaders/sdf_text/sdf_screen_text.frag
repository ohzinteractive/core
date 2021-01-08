uniform sampler2D _Texture;
varying vec2 vUv;

uniform vec2 _AtlasSize;
varying vec4 v_glyph_bounds;
varying vec4 v_color;


float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main()
{



  float left  = v_glyph_bounds.x / _AtlasSize.x;
  float right = v_glyph_bounds.y / _AtlasSize.x;

  float top     = v_glyph_bounds.z / _AtlasSize.y;
  float bottom  = v_glyph_bounds.w / _AtlasSize.y;


  float width = abs(right - left);
  float height = abs(top - bottom);

  vec2 coord = vec2(vUv.x * width + left, vUv.y * height + top - height);

  vec4 col = texture2D(_Texture, coord);

  float sig_dist = median(col.r, col.g, col.b);


  float _Cutoff = 0.5;
  float dist = (_Cutoff - sig_dist);

  // sdf distance per pixel (gradient vector)
  vec2 ddist = vec2(dFdx(dist), dFdy(dist));

  // distance to edge in pixels (scalar)
  float pixelDist = dist / length(ddist);

  float opacity = clamp(0.5 - pixelDist, 0.0, 1.0);

  // float w = fwidth(sig_dist);
  // opacity = smoothstep(0.5 - w, 0.5 + w, sig_dist);


  gl_FragColor = vec4(v_color.rgb, opacity * v_color.a);
}
