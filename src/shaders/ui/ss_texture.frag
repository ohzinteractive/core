uniform sampler2D _MainTex;
uniform vec2 _ScreenSize;
uniform vec2 _TextureSize;
varying vec2 vUv;



void main()
{
	gl_FragColor = texture2D(_MainTex, vUv + vec2(0.5, 0.5)/_TextureSize);
}