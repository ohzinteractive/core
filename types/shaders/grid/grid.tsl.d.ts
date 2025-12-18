/**
 * Grid shader material using TSL (Three.js Shading Language)
 * Creates a wireframe grid effect using barycentric coordinates
 * @param {string} color - Hex color string for the grid lines
 * @returns {{colorNode: any, opacityNode: any}} - TSL nodes for color and opacity
 */
export function createGridShader(color?: string): {
    colorNode: any;
    opacityNode: any;
};
