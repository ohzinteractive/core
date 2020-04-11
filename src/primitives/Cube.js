import Mesh from '../Mesh';

export default class Cube extends Mesh
{
	constructor(size, segments, color)
	{
		size 			= size || new THREE.Vector3(1,1,1);
		segments 	= segments || new THREE.Vector3(1,1,1);
    color 		= color || 0xff0000;
    let geometry = new THREE.BoxGeometry( size.x, size.y, size.z, segments.x, segments.y, segments.z);
    let material = new THREE.MeshBasicMaterial( {color: color} );
		super(geometry, material);
	}
}
