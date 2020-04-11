uniform sampler2D _MainTex;
uniform vec2 _Resolution;
uniform vec2 _SampleDir;
varying vec2 vUv;

void main()
{

	vec3 sum = vec3(0.,0.,0.);
	vec2 dir = (0.5/_Resolution) * _SampleDir;
	float _Distance = 2.0;
	sum += texture2D( _MainTex, vUv + dir * -4. * _Distance ).rgb * 0.0525;
	sum += texture2D( _MainTex, vUv + dir * -3. * _Distance ).rgb * 0.075;
	sum += texture2D( _MainTex, vUv + dir * -2. * _Distance ).rgb * 0.110;
	sum += texture2D( _MainTex, vUv + dir * -1. * _Distance ).rgb * 0.150;
	sum += texture2D( _MainTex, vUv + dir *  0. * _Distance ).rgb * 0.225;
	sum += texture2D( _MainTex, vUv + dir *  1. * _Distance ).rgb * 0.150;
	sum += texture2D( _MainTex, vUv + dir *  2. * _Distance ).rgb * 0.110;
	sum += texture2D( _MainTex, vUv + dir *  3. * _Distance ).rgb * 0.075;
	sum += texture2D( _MainTex, vUv + dir *  4. * _Distance ).rgb * 0.0525;
	gl_FragColor = vec4(sum, 1.0);


}
