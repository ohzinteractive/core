uniform sampler2D _MainTex;
uniform sampler2D _Blur;
uniform vec2 _Screen;
varying vec2 vUv;


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
	vec2 pixel_size = 1.0/_Screen;

	vec4 color = texture2D( _MainTex, vUv);
	float mask = 1.0 - color.a;

	float blur = texture2D( _Blur, vUv).a;

  // gl_FragColor = vec4(mask,mask,mask,0.0);
  // gl_FragColor = color;

	gl_FragColor = vec4(mix(color.rgb, mix(color.rgb, vec3(1.,0.,0.),aastep(0.076, blur)), mask), 1.0);
}

