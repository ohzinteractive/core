uniform sampler2D _MainTex;
uniform vec2 _Resolution;
varying vec2 vUv;


vec4 downsample(vec2 uv, vec2 halfpixel)
{
	vec4 sum = texture2D( _MainTex,uv) * 4.0;
	sum += texture2D( _MainTex,uv - halfpixel);
	sum += texture2D( _MainTex,uv + halfpixel);
	sum += texture2D( _MainTex,uv + vec2(halfpixel.x, -halfpixel.y));
	sum += texture2D( _MainTex,uv - vec2(halfpixel.x, -halfpixel.y));
	return sum/8.0;
}

void main()
{
	vec2 half_pixel = vec2(0.5/_Resolution.x, 0.5/_Resolution.y);
	gl_FragColor = downsample(vUv, half_pixel);

}
