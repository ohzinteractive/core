varying vec2 vUv;
varying vec4 vProjPos;
varying vec3 vCenter;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vProjPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;
    vCenter = vec3(modelMatrix[3][0],modelMatrix[3][1],modelMatrix[3][2]);
    vCenter = (viewMatrix * vec4(vCenter, 1.0)).xyz;
}
