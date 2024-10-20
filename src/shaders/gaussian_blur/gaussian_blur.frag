#include <common>
varying vec2 vUv;
uniform sampler2D _MainTex;
uniform vec2 texSize;
uniform vec2 direction;
uniform float radius;

float gaussianPdf(in float x, in float sigma) {
	return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
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
	vec2 invSize = 1.0 / texSize;
	float fSigma = float(SIGMA);
	float weightSum = gaussianPdf(0.0, fSigma);
	vec4 diffuseSum = sampleTex( _MainTex, vUv) * weightSum;
	for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
		float x = float(i);
		float w = gaussianPdf(x, fSigma);
		vec2 uvOffset = direction * invSize * x * radius;
		vec4 sample1 = sampleTex( _MainTex, vUv + uvOffset);
		vec4 sample2 = sampleTex( _MainTex, vUv - uvOffset);
		diffuseSum += (sample1 + sample2) * w;
		weightSum += 2.0 * w;
	}
	gl_FragColor = vec4(diffuseSum/weightSum);

  #ifndef USE_LINEAR_COLOR_SPACE
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.4545));
  #endif
  // #include <colorspace_fragment>

}