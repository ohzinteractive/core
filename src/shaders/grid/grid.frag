uniform vec3 _Color;

varying vec3 vBarycentric;

float edgeFactor(vec3 baryc ){
    vec3 d = fwidth(baryc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, baryc);
    return min(min(a3.x, a3.y), a3.z);
}

void main()
{	
	float alpha = edgeFactor(vBarycentric + vec3(1. , 1., 0.));
	gl_FragColor.rgb = mix(_Color, vec3(0.), alpha);
	gl_FragColor.a = 1.0 - alpha;
	gl_FragColor.a *= 0.2;
}