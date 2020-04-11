uniform sampler2D _MainTex;
uniform mat4 _InverseProjMatrix;

uniform float _Bias;
uniform float _Radius;

uniform vec2 _Resolution;
uniform float _FarPlane;


varying vec2 vUv;
varying vec4 vRay;


uniform vec3 _SampleKernel[64];
uniform sampler2D _RandomRotation;
uniform mat4 _ProjectionMatrix;

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
  vec2 encoded_normal = texture2D(_MainTex, uv).zw;
  vec3 normalValue = normalize(decode_normal(vec4(encoded_normal, 0., 0.)));
  return normalize(normalValue);
}
vec3 DecodeViewPos(vec2 uv)
{
  vec2 depth = texture2D(_MainTex, uv).xy;
  vec4 inv_proj = _InverseProjMatrix * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  return DecodeFloatRG(depth) * (vRay.xyz/vRay.w);
  
}




void main()
{

  vec2 noiseScale = vec2(_Resolution.x/4.0,_Resolution.y/4.0); // noise texture 4x4

  vec3 fragPos   = DecodeViewPos(vUv);
  vec3 normal    = DecodeNormal(vUv);
  vec3 randomVec = texture2D(_RandomRotation, vUv * noiseScale).xyz;
  randomVec = vec3(randomVec.xy * 2.0 - 1.0, 0);
  randomVec = normalize(randomVec);


  vec3 tangent   = normalize(randomVec - normal * dot(randomVec, normal));
  vec3 bitangent = normalize(cross(normal, tangent));
  mat3 TBN       = mat3(tangent, bitangent, normal); 


  float occlusion = 0.0;
  const int kernelSize = 64;


  for(int i = 0; i < kernelSize; ++i)
  {
      // get sample position
      vec3 sample = TBN * _SampleKernel[i]; // From tangent to view-space
      sample = fragPos + sample * _Radius; 
      vec4 projPos = _ProjectionMatrix * vec4(sample, 1.0);
      vec2 screenPos = projPos.xy / projPos.w;
      screenPos = screenPos * 0.5 +0.5;

      float sampled_depth = DecodeViewPos(screenPos).z;
      float rangeCheck = smoothstep(0.0, 1.0, _Radius / abs(fragPos.z - sampled_depth));
      occlusion += step(sample.z+_Bias, sampled_depth) * rangeCheck;         
      
  } 
  occlusion = (occlusion / float(kernelSize));
  gl_FragColor.rgb = vec3(occlusion,occlusion,occlusion); 
  gl_FragColor.a = 1.0; 


}
