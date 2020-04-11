export default class Sphere extends THREE.Mesh
{
	constructor(radius, color)
	{
    color = color || "#FF0000";
    radius = radius || 1;
    let geometry = new THREE.SphereBufferGeometry( radius, 64, 64);
    let material = new THREE.MeshBasicMaterial( {color: color} );
		super(geometry, material);
	}
}