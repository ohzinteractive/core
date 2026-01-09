uniform sampler2D _MainTex;
uniform sampler2D _BlurredTex;
uniform vec2 _Resolution;
uniform float _BloomStrength;
varying vec2 vUv;

vec4 pow_v4(vec4 vec, float p)
{
	vec4 v = vec;
	v.r = pow(abs(v.r), p);
	v.g = pow(abs(v.g), p);
	v.b = pow(abs(v.b), p);
	v.a = pow(abs(v.a), p);
	return v;
}

void main()
{
		vec4 col = texture2D( _MainTex, vUv);
		vec4 blur = texture2D( _BlurredTex, vUv);
		gl_FragColor = col + blur * _BloomStrength;
}
