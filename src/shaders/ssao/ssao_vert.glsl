varying vec2 vUv;
varying vec4 vRay;

uniform mat4 _InverseProjMatrix;

void main()
{
	gl_Position = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
	vRay = _InverseProjMatrix * vec4(uv * 2.0 - 1.0, 1.0, 1.0);
	vUv = uv;
}