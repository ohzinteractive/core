uniform sampler2D _MainTex;
uniform sampler2D _BlurredTex;
uniform vec2 _Resolution;
uniform float _BloomStrength;
varying vec2 vUv;

void main()
{
		// vec4 col = texture2D( _MainTex, vUv);
		vec4 blur = texture2D( _BlurredTex, vUv);
		gl_FragColor = blur;
		// gl_FragColor = col + blur * _BloomStrength;
}
