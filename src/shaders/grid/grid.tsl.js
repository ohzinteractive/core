import { Color } from 'three';
import { attribute, fwidth, min, mix, smoothstep, uniform, vec3 } from 'three/src/nodes/TSL';

/**
 * Grid shader material using TSL (Three.js Shading Language)
 * Creates a wireframe grid effect using barycentric coordinates
 * @param {string} color - Hex color string for the grid lines
 * @returns {{colorNode: any, opacityNode: any}} - TSL nodes for color and opacity
 */
export function createGridShader(color = '#4a4a4a')
{
  const gridColor = uniform(new Color(color));

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
  const colorNode = mix(gridColor, vec3(0.0), alpha);
  const opacityNode = alpha.oneMinus().mul(0.2);

  return { colorNode, opacityNode };
}
