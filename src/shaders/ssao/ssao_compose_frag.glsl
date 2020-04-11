uniform sampler2D _MainTex;
uniform sampler2D _AO;
uniform vec2 _Resolution;
uniform vec2 _SampleDir;
varying vec2 vUv;

void main()
{


  gl_FragColor.rgb = texture2D(_MainTex, vUv).rgb * (1.0 - texture2D(_AO, vUv).r);
  gl_FragColor.a = 1.0;

}
