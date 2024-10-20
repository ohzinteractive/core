varying vec2 vUv;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;

uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];

float lerpBloomFactor(const in float factor) { 
	float mirrorFactor = 1.2 - factor;
	return mix(factor, mirrorFactor, bloomRadius);
}

vec4 sampleTex(sampler2D tex, vec2 uv)
{
  vec4 col = texture2D( tex, uv);
  #ifndef USE_LINEAR_COLOR_SPACE
    col.rgb = pow(col.rgb, vec3(2.2));
  #endif
  return col;
}
void main() {
	gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * sampleTex(blurTexture1, vUv) + 
										 							 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * sampleTex(blurTexture2, vUv) + 
																	 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * sampleTex(blurTexture3, vUv) + 
																	 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * sampleTex(blurTexture4, vUv) + 
																	 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * sampleTex(blurTexture5, vUv) );

  #ifndef USE_LINEAR_COLOR_SPACE
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.4545));
  #endif
}
