import { Color } from 'three';
import { abs, attribute, cameraPosition, cameraProjectionMatrix, cameraViewMatrix, cross, float, modelWorldMatrix, normalize, positionGeometry, uniform, varying, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

// Draws a Line as a flat ribbon that faces the camera. Line stores every point twice,
// with orientation 1 and -1, and the vertex stage pushes the two copies apart by
// _Thickness, across both the line and the direction to the camera. The ribbon is
// _Color along its middle and half as bright at its edges.
class LineMaterial extends NodeMaterial
{
  uniforms: {
    _Thickness: { value: number },
    _Length: { value: number },
    _ElapsedTime: { value: number },
    _Color: { value: Color }
  };

  constructor()
  {
    super();

    const thickness = uniform(0.2);
    const color = uniform(new Color('#FF0000'));

    // The shader does not read _Length or _ElapsedTime. Line keeps _Length equal to its
    // total length for code that reads it.
    this.uniforms = { _Thickness: thickness, _Length: uniform(0), _ElapsedTime: uniform(0), _Color: color };

    const orientation = attribute('orientation', 'float');
    const world_next = modelWorldMatrix.mul(vec4(attribute('next_position', 'vec3'), 1)).xyz;
    const world_previous = modelWorldMatrix.mul(vec4(attribute('previous_position', 'vec3'), 1)).xyz;

    const along = normalize(world_previous.sub(world_next));
    const across = normalize(cross(along, normalize(cameraPosition.sub(world_next))));
    const world_position = modelWorldMatrix.mul(vec4(positionGeometry, 1)).xyz
      .add(across.mul(thickness.mul(0.5)).mul(orientation));

    this.vertexNode = cameraProjectionMatrix.mul(cameraViewMatrix).mul(vec4(world_position, 1));

    // -1 on one edge of the ribbon, 0 along its middle, 1 on the other edge.
    const side = varying(orientation);

    this.fragmentNode = vec4(color.mul(float(1).sub(abs(side)).mul(0.5).add(0.5)), 1);

    this.transparent = true;
    this.depthWrite = false;
    // Node materials take scene fog by default. The GLSL material ignored it.
    this.fog = false;
  }
}

export { LineMaterial };
