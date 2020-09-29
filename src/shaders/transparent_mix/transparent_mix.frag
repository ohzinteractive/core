uniform sampler2D _OpaqueTex;
uniform sampler2D _TransparentTex;
uniform vec2 _Resolution;
uniform float _Opacity;
varying vec2 vUv;

void main()
{
		vec4 opaque = texture2D( _OpaqueTex, vUv);
		vec4 transparent = texture2D( _TransparentTex, vUv);

		gl_FragColor = vec4(mix(opaque.rgb, transparent.rgb, transparent.a*_Opacity), 1.0);
		// if(vUv.x > 0.5)
		// 	gl_FragColor = vec4(opaque.rgb, 1.0);
		// else
		// 	gl_FragColor = vec4(transparent.rgb, 1.0);


}