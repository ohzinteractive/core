class Time
{
	constructor()
	{
		this.___time = new THREE.Clock();
		this.__delta_time = 0;
		this.__elapsed_time = 0;
		this.__allocated_time = new THREE.Vector2(0,0);
	}


	get delta_time()
	{
		return this.__delta_time < 0.4? this.__delta_time : 0.016;
	}
	get elapsed_time()
	{
		return this.__elapsed_time;
	}
	get shader_time()
	{
		this.__allocated_time.x = this.delta_time;
		this.__allocated_time.y = this.elapsed_time;
		return  this.__allocated_time;
	}

	__update()
	{
		this.__delta_time = this.___time.getDelta();
		this.__elapsed_time = this.___time.getElapsedTime();
	}
}

const time = new Time();
module.exports = time;

