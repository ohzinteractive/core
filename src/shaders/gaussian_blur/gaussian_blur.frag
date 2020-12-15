#include <common>
varying vec2 vUv;
uniform sampler2D _MainTex;
uniform vec2 texSize;
uniform vec2 direction;

float gaussianPdf(in float x, in float sigma) {
	return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
}
void main() {
	vec2 invSize = 1.0 / texSize;
	float fSigma = float(SIGMA);
	float weightSum = gaussianPdf(0.0, fSigma);
	vec4 diffuseSum = texture2D( _MainTex, vUv) * weightSum;
	for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
		float x = float(i);
		float w = gaussianPdf(x, fSigma);
		vec2 uvOffset = direction * invSize * x;
		vec4 sample1 = texture2D( _MainTex, vUv + uvOffset);
		vec4 sample2 = texture2D( _MainTex, vUv - uvOffset);
		diffuseSum += (sample1 + sample2) * w;
		weightSum += 2.0 * w;
	}
	gl_FragColor = vec4(diffuseSum/weightSum);
}