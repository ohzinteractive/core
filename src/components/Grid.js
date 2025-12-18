// @ts-check
import { GeometryUtilities } from '../utilities/GeometryUtilities';

import { Color, Mesh, PlaneGeometry } from 'three';
import { attribute, fwidth, min, mix, smoothstep, uniform, vec3 } from 'three/tsl';
import { MeshBasicNodeMaterial } from 'three/webgpu';

class Grid extends Mesh
{
  constructor()
  {
    const gridColor = uniform(new Color('#4a4a4a'));

    // Get barycentric attribute
    const barycentric = attribute('barycentric', 'vec3');

    // Edge factor function (TSL equivalent of the GLSL function)
    const edgeFactor = (baryc) =>
    {
      const d = fwidth(baryc);
      const a3 = smoothstep(vec3(0.0), d.mul(1.5), baryc);
      return min(min(a3.x, a3.y), a3.z);
    };

    // Apply edge detection
    const vBarycentric = barycentric.add(vec3(1.0, 1.0, 0.0));
    const alpha = edgeFactor(vBarycentric);

    // Mix color and apply alpha
    const finalColor = mix(gridColor, vec3(0.0), alpha);
    const finalAlpha = alpha.oneMinus().mul(0.2);

    const material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false
    });

    material.colorNode = finalColor;
    material.opacityNode = finalAlpha;

    const plane_geometry = new PlaneGeometry(100, 100, 100, 100);

    const non_indexed_geometry = GeometryUtilities.convert_to_non_indexed_geometry(plane_geometry);

    super(non_indexed_geometry, material);

    this.rotation.x = -3.14 / 2;
  }
}

export { Grid };
