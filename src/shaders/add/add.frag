uniform sampler2D _MainTex;
uniform sampler2D _SecondTex;

varying vec2 vUv;

vec4 sampleTex(sampler2D tex, vec2 uv)
{
  vec4 col = texture2D( tex, uv);

  #ifndef USE_LINEAR_COLOR_SPACE
    col.rgb = pow(col.rgb, vec3(2.2));
  #endif

  return col;
}
void main()
{
	vec4 col0 = sampleTex(_MainTex, vUv);
	vec4 col1 = sampleTex(_SecondTex, vUv);


  gl_FragColor = col0+col1;
	// gl_FragColor = texture2D(_SecondTex, vUv);
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.4545));

	// gl_FragColor = texture2D(_MainTex, vUv)+texture2D(_SecondTex, vUv);

}