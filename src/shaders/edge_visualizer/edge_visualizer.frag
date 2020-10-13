uniform vec3 _Color;
uniform vec3 _LineColor;
uniform float _Alpha;
uniform float _Thickness;
varying vec3 vBarycentric;

float edgeFactor(vec3 baryc ){
    vec3 d = fwidth(baryc);
    vec3 a3 = smoothstep(vec3(0.0), d*_Thickness, baryc);
    return min(min(a3.x, a3.y), a3.z);
}

void main()
{	
	float alpha = edgeFactor(vBarycentric + vec3(1. , 1., 0.));
	gl_FragColor.rgb = mix(_LineColor, _Color, alpha);
	gl_FragColor.a = mix(1.0 - alpha, 1.0, _Alpha);
}