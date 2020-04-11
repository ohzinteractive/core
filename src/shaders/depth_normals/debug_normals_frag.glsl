uniform sampler2D _MainTex;
uniform vec2 _Resolution;
uniform float _FarPlane;

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
  vec4 depthNormal = texture2D(_MainTex, uv);
  vec3 normalValue = normalize(decode_normal(vec4(depthNormal.zw, 0., 0.)));
  return normalize(normalValue);
}
vec3 DecodeViewPos(vec2 uv)
{
  vec2 depth = texture2D(_MainTex, uv).xy;
  return DecodeFloatRG(depth) * (vRay.xyz/vRay.w);
}

void main()
{
    vec3 viewPos = DecodeViewPos(vUv);
    vec3 normalValue = DecodeNormal(vUv);

    float vDepth = clamp(0.0, 1.0, length(viewPos)/_FarPlane);
    vDepth = length(viewPos)/_FarPlane;
    // gl_FragColor = vec4(normalValue*0.5+0.5, 1.0);
    gl_FragColor = vec4(vDepth,vDepth,vDepth, 1.0);
}