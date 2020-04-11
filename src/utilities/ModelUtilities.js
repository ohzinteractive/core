export class ModelUtilities
{

	get_mesh(scene, result_callback)
	{
		scene.traverse((child)=>{
			if(child instanceof THREE.Mesh)
			{
				if(child.geometry instanceof THREE.Geometry)
				{
					child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
				}
				result_callback(child);
			}
		});
	}

	get_geometries(scene)
	{
		let geometries = [];

		this.get_mesh(scene, (child)=>{
			geometries.push(child.geometry);
		});
		return geometries;
	}


	assign_material(scene, material, name)
	{
		scene.traverse((child) => {
			if(child instanceof THREE.Mesh)
			{
				// assign to all if no name is given
				if(name === undefined)
					child.material = material;
				else
				{
					// if name is given, assign only to that
					if(child.name === name )
					{
						child.material = material;
					}
				}
			}
		});
	}

	set_shadow_config(scene, cast, receive)
	{
		scene.traverse((child) => {
			if(child instanceof THREE.Mesh)
			{
				child.castShadow = cast;
				child.receiveShadow = receive;
			}
		});
	}

	__find_object(scene, object_name, result_callback)
	{

		scene.traverse((obj)=>{
			if(obj.name === object_name)
				result_callback(obj);
		});
	}

	get_object(scene, object_name)
	{
		let object = undefined;
		scene.traverse((obj)=>{
			if(obj.name === object_name)
				object = obj;
		});
		return object;
	}
	get_object_by_type(scene, object_type)
	{
		let object = undefined;
		scene.traverse((obj)=>{
			if(obj.constructor.name === object_type)
				object = obj;
		});
		return object;
	}

}

const model_utilities = new ModelUtilities();
module.exports = model_utilities;
