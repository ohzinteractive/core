uniform sampler2D _MainTex;
varying vec2 vUv;
uniform float _Opacity;

void main()
{
    gl_FragColor = texture2D(_MainTex, vUv);
    gl_FragColor.a *= _Opacity;
    //gl_FragColor.r = 1.0;
}