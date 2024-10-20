uniform sampler2D _MainTex;
uniform vec3 defaultColor;
uniform float defaultOpacity;
uniform float luminosityThreshold;
uniform float smoothWidth;

varying vec2 vUv;

vec4 sampleTex(sampler2D tex, vec2 uv)
{
  vec4 col = texture2D( tex, uv);
  #ifndef USE_LINEAR_COLOR_SPACE
    col.rgb = pow(col.rgb, vec3(2.2));
  #endif
  return col;
}
void main() {

	vec4 texel = sampleTex( _MainTex, vUv );

	vec3 luma = vec3( 0.299, 0.587, 0.114 );

	float v = dot( texel.xyz, luma );

	vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

	float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

	gl_FragColor = mix( outputColor, texel, alpha );
  
  // #include <colorspace_fragment>

  #ifndef USE_LINEAR_COLOR_SPACE
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.4545));
  #endif


}