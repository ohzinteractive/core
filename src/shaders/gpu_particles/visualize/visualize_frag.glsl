uniform float _Time;
void main()
{
	vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
	float x = length(uv * 2.0 - 1.0);

	float point = (1.0 - pow(x+0.75,10.0));
	float halo = pow((1.0-x)*0.6, 2.0);
	float alpha = mix(halo, point, point);
  gl_FragColor = vec4(1.0, 0.0, 0.0, max(halo,point));
}