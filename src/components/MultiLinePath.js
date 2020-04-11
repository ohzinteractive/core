import Line from '/Line';

export default class MultiLinePath extends THREE.Object3D
{
	constructor(paths, webgl)
	{
		super();

		this.paths = [];
		for(let i=0; i< paths.length; i++)
		{
			let line = new Line(paths[i], webgl);
			this.paths.push = line;
			this.add(line);
		}
	}


}
