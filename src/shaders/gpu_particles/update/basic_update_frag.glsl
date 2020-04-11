uniform sampler2D _MainTex;
uniform vec2 _Time;
uniform vec2 _Resolution;

varying vec2 vUv;

//#include <gpu_particles_utils>

void main()
{

		gl_FragColor.xyz = texture2D( _MainTex, vUv).xyz;
		gl_FragColor.y += 0.001;

		gl_FragColor.xyz = gl_FragColor.xyz;
		
		gl_FragColor.w = 1.0;



}