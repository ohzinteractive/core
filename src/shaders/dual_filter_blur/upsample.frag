uniform sampler2D _MainTex;
uniform vec2 _Resolution;
varying vec2 vUv;

vec4 upsample(vec2 uv, vec2 halfpixel)
{
	vec4 sum = texture2D( _MainTex,uv + vec2(-halfpixel.x * 2.0, 0.0));
	sum += texture2D( _MainTex,uv + vec2(-halfpixel.x, halfpixel.y)) * 2.0;
	sum += texture2D( _MainTex,uv + vec2(0.0, halfpixel.y * 2.0));
	sum += texture2D( _MainTex,uv + vec2(halfpixel.x, halfpixel.y)) * 2.0;
	sum += texture2D( _MainTex,uv + vec2(halfpixel.x * 2.0, 0.0));
	sum += texture2D( _MainTex,uv + vec2(halfpixel.x, -halfpixel.y)) * 2.0;
	sum += texture2D( _MainTex,uv + vec2(0.0, -halfpixel.y * 2.0));
	sum += texture2D( _MainTex,uv + vec2(-halfpixel.x, -halfpixel.y)) * 2.0;
	return sum / 12.0;
}

void main()
{
	vec2 half_pixel;
	half_pixel.x = 0.5/_Resolution.x;
	half_pixel.y = 0.5/_Resolution.y;
	gl_FragColor = upsample(vUv, half_pixel);
}
