uniform sampler2D _MainTex;
varying vec2 vUv;

void main()
{
    gl_FragColor = texture2D(_MainTex, vUv);
    //gl_FragColor.a = 1.0;
    //gl_FragColor.r = 1.0;
}