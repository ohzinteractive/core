uniform sampler2D _MainTex;
uniform vec2 _Resolution;
varying vec2 vUv;



void main()
{

	vec4 col = texture2D( _MainTex, vUv );
	gl_FragColor = col;
	gl_FragColor.a = col.a;

}
