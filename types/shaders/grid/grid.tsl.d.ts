import MathNode from "three/src/nodes/math/MathNode.js";
import OperatorNode from "three/src/nodes/math/OperatorNode.js";

/**
 * Grid shader material using TSL (Three.js Shading Language)
 * Creates a wireframe grid effect using barycentric coordinates
 * @param {string} color - Hex color string for the grid lines
 * @returns {{colorNode: any, opacityNode: any}} - TSL nodes for color and opacity
 */
export declare function createGridShader(color?: string): {
    colorNode: MathNode;
    opacityNode: OperatorNode;
};
