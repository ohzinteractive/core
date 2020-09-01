uniform sampler2D _MainTex;
uniform mat4 _InverseProjMatrix;
uniform mat4 _InverseViewMatrix;

uniform float _Bias;
uniform float _Radius;

uniform vec2 _TargetResolution;
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
  // vec2 encoded_normal = texture2D(_MainTex, uv).zw;
  // vec3 normalValue = normalize(decode_normal(vec4(encoded_normal, 0., 0.)));
  // return normalize(normalValue);
  return normalize(texture2D(_MainTex, uv).xyz * 2.0 - vec3(1.0));
}


vec3 DecodeViewPos(vec2 uv)
{
  float depth = texture2D(_MainTex, uv).w;

  float x = uv.x * 2.0 - 1.0;
  float y = uv.y * 2.0 - 1.0;
  vec4 inv_proj = _InverseProjMatrix * vec4(x,y, 1.0, 1.0);

  return (inv_proj.xyz / inv_proj.w) * depth;
}

float fast_length(vec3 V)
{
	return dot(V,V);
}

vec3 MinDiff(vec3 P, vec3 Pr, vec3 Pl)
{
    vec3 V1 = Pr - P;
    vec3 V2 = P - Pl;
    return (fast_length(V1) < fast_length(V2)) ? V1 : V2;
}




#define PI 3.14
#define PI_OVER_2 1.5707963
#define PI_OVER_4 0.785398
#define EPSILON 0.000001

// Maps a unit square in [-1, 1] to a unit disk in [-1, 1]. Shirley 97 "A Low Distortion Map Between Disk and Square"
// Inputs: cartesian coordinates
// Return: new circle-mapped polar coordinates (radius, angle)
vec2 UnitSquareToUnitDiskPolar(float a, float b) {
    float radius, angle;
    if (abs(a) > abs(b)) { // First region (left and right quadrants of the disk)
        radius = a;
        angle = b / (a + EPSILON) * PI_OVER_4;
    } else { // Second region (top and botom quadrants of the disk)
        radius = b;
        angle = PI_OVER_2 - (a / (b + EPSILON) * PI_OVER_4);
    }
    if (radius < 0.0) { // Always keep radius positive
        radius *= -1.0;
        angle += PI;
    }
    return vec2(radius, angle);
}

// Maps a unit square in [-1, 1] to a unit disk in [-1, 1]
// Inputs: cartesian coordinates
// Return: new circle-mapped cartesian coordinates
vec2 SquareToDiskMapping(float a, float b) {
    vec2 PolarCoord = UnitSquareToUnitDiskPolar(a, b);
    return vec2(PolarCoord.x * cos(PolarCoord.y), PolarCoord.x * sin(PolarCoord.y));
}





// // Retrieves the occlusion factor for a particular sample
// // uv: the centre coordinate of the kernel
// // frustumVector: The frustum vector of the sample point
// // centerViewPos: The view space position of the centre point
// // centerNormal: The normal of the centre point
// // tangent: The tangent vector in the sampling direction at the centre point
// // topOcclusion: The maximum cos(angle) found so far, will be updated when a new occlusion segment has been found
// float GetSampleOcclusion(vec2 uv, vec3 centerViewPos, vec3 centerNormal, vec3 tangent, inout float topOcclusion)
// {
// 	// reconstruct sample's view space position based on depth buffer and interpolated frustum vector
// 	vec3 sampleViewPos = DecodeViewPos(uv);

// 	// get occlusion factor based on candidate horizon elevation
// 	vec3 horizonVector = sampleViewPos - centerViewPos;
// 	float horizonVectorLength = length(horizonVector);

// 	float occlusion;

// 	// If the horizon vector points away from the tangent, make an estimate
// 	if (dot(tangent, horizonVector) < 0.0)
// 		return 0.5;
// 	else
// 		occlusion = dot(centerNormal, horizonVector) / horizonVectorLength;

// 	// this adds occlusion only if angle of the horizon vector is higher than the previous highest one without branching
// 	float diff = max(occlusion - topOcclusion, 0.0);
// 	topOcclusion = max(occlusion, topOcclusion);

// 	// attenuate occlusion contribution using distance function 1 - (d/f)^2
//   float fallOff = 2.0;
// 	float distanceFactor = saturate(horizonVectorLength / fallOff);
// 	distanceFactor = 1.0 - distanceFactor * distanceFactor;
// 	return diff * distanceFactor;
// }


#define MAX_DIRECTIONS 8
#define MAX_DIRECTIONS_F 8.0
#define MAX_STEPS 8
#define MAX_STEPS_F 8.0
#define KERNEL_SIZE 8
#define KERNEL_SIZE_F 8.0
#define MAX_TAPS (KERNEL_SIZE*KERNEL_SIZE)
#define MAX_TAPS_F (KERNEL_SIZE_F*KERNEL_SIZE_F)

float InvLength(vec2 V)
{
	return inversesqrt(dot(V,V));
}
vec2 viewToScreen(vec3 viewPos)
{
  vec4 P_screen = _ProjectionMatrix * vec4(viewPos, 1.0);
  P_screen.xyz/= P_screen.w;
  P_screen.xy = P_screen.xy * 0.5 + vec2(0.5, 0.5);
  return P_screen.xy;
}

float BiasedTangent(vec3 V)
{
	return V.z / length(V.xy) + _Bias;
}

float TanToSin(float x)
{
	return x * inversesqrt(x*x + 1.0);
}

float Tangent(vec3 V)
{
	return V.z * InvLength(V.xy);
}


float Tangent(vec3 P, vec3 S)
{
    return -(P.z - S.z) * InvLength(S.xy - P.xy);
}

void main()
{
  vec2 half_pixel = vec2(0.5/_TargetResolution.x, 0.5/_TargetResolution.y);
  vec2 pixel_size = vec2(1.0/_TargetResolution.x, 1.0/_TargetResolution.y);

  vec2 uv = vUv;

  vec3 P         = DecodeViewPos(uv);
  vec3 normal    = DecodeNormal(uv);


  vec2 P_s = viewToScreen(P);

  // float radius = 0.5;
  vec2 P1_s = viewToScreen(P +  vec3(0.0, _Radius, 0.0));

  float step_size_px = length(P1_s - P_s);



  // vec3 Pt = DecodeViewPos(uv + vec2(0.0, pixel_size.y));
  // vec3 Pb = DecodeViewPos(uv + vec2(0.0, -pixel_size.y));

  // vec3 Pl = DecodeViewPos(uv + vec2(-pixel_size.x, 0.0));
  // vec3 Pr = DecodeViewPos(uv + vec2(pixel_size.x, 0.0));

  // vec3 dPv = normalize(MinDiff(P, Pt, Pb));
  // vec3 dPh = normalize(MinDiff(P, Pr, Pl));

  // gl_FragColor.rgb = normalize(cross(dPh, dPv))* 0.5 + vec3(0.5,0.5,0.5);

  float alpha = (2.0 * PI) / MAX_DIRECTIONS_F;
  float accum = 0.0;
  for(int i=0; i< MAX_DIRECTIONS; i++)
  {
    float theta = alpha * float(i);
    // Apply noise to the direction
    vec2 dir = vec2(cos(theta), sin(theta)) * (step_size_px/MAX_DIRECTIONS_F);
    float max_angle = 0.0;


    for(int j=1; j< MAX_STEPS; j++)
    {
      vec2 uv_offset = dir * float(j);

      vec3 sample = DecodeViewPos(vUv + uv_offset);


      vec3 dir = sample - P;
      vec3 tangent = cross(normalize(dir), normal);
      tangent = cross(normal, tangent);

      float sin_t = TanToSin(BiasedTangent(tangent)); //sin(t)

      float horizon_angle = Tangent(P, sample);
      if(length(dir) < _Radius &&  horizon_angle > max_angle)
      {
        float sin_h = TanToSin(horizon_angle);
        accum += sin_h - sin_t;
        max_angle = horizon_angle;
      }
    }
  }

  gl_FragColor.rgb = vec3(accum/MAX_DIRECTIONS_F);

  // gl_FragColor.rgb = vec3(sin(abs(max_angle)));
  // gl_FragColor.rgb = normalize(dPv+dPh) * 0.5 + vec3(0.5);
  // gl_FragColor.rgb = vec3(sample_length);

  gl_FragColor.a = 1.0;

}




