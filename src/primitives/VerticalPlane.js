export default class VerticalPlane extends THREE.Mesh
{
	constructor(width, height, color, material)
	{
		width = width || 1;
		height = height || 1;
    color = color || "#FF0000";
    material = material || new THREE.MeshBasicMaterial( {color: color} );

		let geometry = new THREE.PlaneBufferGeometry( width, height);
		super(geometry, material);
	}
}