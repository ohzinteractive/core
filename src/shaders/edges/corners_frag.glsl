uniform float _Thickness;
uniform vec3 _Color;
varying vec2 vUv;
void main()
{	
	vec2 circle_uv = vUv*2.0-1.0;
	if(length(circle_uv) > 1.0)
		discard;

  gl_FragColor = vec4(_Color, 1.);
}