varying vec3 v_normal;
varying vec3 v_pos;

uniform float _FarPlane;

vec2 EncodeFloatRG( float v )
{
    vec2 kEncodeMul = vec2(1.0, 255.0);
    float kEncodeBit = 1.0/255.0;
    vec2 enc = kEncodeMul * v;
    enc = fract (enc);
    enc.x -= enc.y * kEncodeBit;
    return enc;
}

vec2 EncodeNormal (vec3 n)
{
    float scale = 1.7777;
    vec2 enc = n.xy / (n.z+1.0);
    enc /= scale;
    enc = enc*0.5+0.5;
    return enc;
}


void main()
{
	gl_FragColor = vec4(EncodeFloatRG(length(v_pos.z)/_FarPlane), EncodeNormal(normalize(v_normal)));	
}

