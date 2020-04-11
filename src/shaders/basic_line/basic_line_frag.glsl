uniform float _Length;
uniform float _ElapsedTime;
uniform float _Thickness;
uniform vec3  _Color;

varying float line_coverage;
varying float uv_u;




float aastep(float threshold, float value) {
  #ifdef GL_OES_standard_derivatives
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
  #else
    return step(threshold, value);
  #endif  
}

void main()
{

    // float y = fract(line_coverage /_Thickness - _TrueElapsedTime) ;

    // vec2 uv = vec2(uv_u, y);

   
    // vec4 col = texture2D(_ArrowsTex,uv);
    // col.rgb *= _ForwardColor;
    // col.a = aastep(0.5, col.a);
    // gl_FragColor = col;
    float u = (1.0 - abs(uv_u * 2.0 - 1.0));
    float diffuse = dot(vec2(u, u), vec2(0.0, 1.0)) * 0.5+0.5;
    gl_FragColor = vec4(_Color * diffuse, 1.0);

}