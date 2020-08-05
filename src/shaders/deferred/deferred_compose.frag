uniform sampler2D _MainTex; //albedo
uniform sampler2D _NormalDepthRT;
uniform mat4 _InverseProjMatrix;
uniform vec2 _Resolution;
varying vec2 vUv;
varying vec4 vRay;


vec3 decode_normal (vec4 enc)
{
    float scale = 1.7777;
    vec3 nn =
        enc.xyz*vec3(2.0*scale,2.0*scale,0.0) +
        vec3(-scale,-scale,1.0);
    float g = 2.0 / dot(nn.xyz,nn.xyz);
    vec3 n;
    n.xy = g*nn.xy;
    n.z = g-1.0;
    return n;
}

float DecodeFloatRG( vec2 enc )
{
    vec2 kDecodeDot = vec2(1.0, 1.0/255.0);
    return dot( enc, kDecodeDot );
}

vec3 DecodeNormal(vec2 uv)
{
  vec2 encoded_normal = texture2D(_NormalDepthRT, uv).zw;
  vec3 normalValue = normalize(decode_normal(vec4(encoded_normal, 0., 0.)));
  return normalize(normalValue);
}
vec3 DecodeViewPos(vec2 uv)
{
  vec2 depth = texture2D(_NormalDepthRT, uv).xy;
  vec4 inv_proj = _InverseProjMatrix * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  return DecodeFloatRG(depth) * (vRay.xyz/vRay.w);
}







void main()
{

    vec3 fragPos   = DecodeViewPos(vUv);
    vec3 normal    = DecodeNormal(vUv);

    vec3 dir_to_light = normalize(fragPos) * -1.0;

    float diffuse = dot(normal, dir_to_light);


    gl_FragColor = vec4(diffuse, diffuse, diffuse, 1.0);
}
