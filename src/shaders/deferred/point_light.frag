uniform sampler2D _AlbedoTex; //albedo
uniform sampler2D _NormalDepthTex;
uniform mat4 _InverseProjMatrix;
varying vec2 vUv;
varying vec4 vProjPos;
varying vec3 vCenter;

uniform float _Intensity;


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
  vec2 encoded_normal = texture2D(_NormalDepthTex, uv).zw;
  vec3 normalValue = normalize(decode_normal(vec4(encoded_normal, 0., 0.)));
  return normalize(normalValue);
}
vec3 DecodeViewPos(vec2 uv, vec4 ray)
{
  vec2 depth = texture2D(_NormalDepthTex, uv).xy;
  vec4 inv_proj = _InverseProjMatrix * vec4(uv * 2.0 - 1.0, 1.0, 1.0);
  return DecodeFloatRG(depth) * (ray.xyz/ray.w);
}




float saturate(float x)
{
    return clamp(x, 0.0, 1.0);
}


void main()
{
    vec2 uv = (vProjPos.xy/vProjPos.w)*0.5+vec2(0.5);
	vec4 ray = _InverseProjMatrix * vec4(uv * 2.0 - 1.0, 1.0, 1.0);

    vec3 fragPos   = DecodeViewPos(uv, ray);
    vec3 normal    = DecodeNormal(uv);
    vec3 albedo    = texture2D(_AlbedoTex, uv).rgb;


    vec3 dir_to_light = normalize(vCenter - fragPos);
    float diffuse = saturate(dot(normal, dir_to_light));
    float attenuation = _Intensity/pow(length(vCenter - fragPos), 2.0);
    gl_FragColor = vec4(albedo * diffuse * attenuation, 1.0);
}
