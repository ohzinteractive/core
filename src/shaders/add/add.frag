uniform sampler2D _MainTex;
uniform sampler2D _SecondTex;

varying vec2 vUv;
void main()
{
	gl_FragColor = texture2D(_MainTex, vUv);
	gl_FragColor += texture2D(_SecondTex, vUv);
}