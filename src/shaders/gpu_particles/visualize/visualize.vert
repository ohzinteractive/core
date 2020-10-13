
uniform sampler2D _Position;
attribute vec2 storage_uv;

void main()
{
    vec3 pos = texture2DLod(_Position, storage_uv, 0.0).xyz;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos ,1.0);
    gl_PointSize = 20.0;
}
