uniform vec3 _Color;

void main()
{	
	// float diffuse = dot(vec3(1., 0., 0.), w_normal)* 0.5+0.5;
  gl_FragColor = vec4(_Color, 1.);
}