import { Mesh, Skeleton } from 'three';

class ModelUtilities
{
  get_mesh(scene: any, result_callback: any)
  {
    scene.traverse((child: any) => {
      if (child instanceof Mesh)
      {
        if (child.geometry)
        {
          child.geometry = child.geometry.clone()
        }
        result_callback(child);
      }
    });
  }

  get_geometries(scene: any)
  {
    const geometries: any = [];

    this.get_mesh(scene, (child: any) => {
      geometries.push(child.geometry);
    });
    return geometries;
  }

  assign_material(scene: any, material: any, name: any)
  {
    scene.traverse((child: any) => {
      if (child instanceof Mesh)
      {
        // assign to all if no name is given
        if (name === undefined)
        {
          child.material = material;
        }
        else
        {
          // if name is given, assign only to that
          if (child.name === name)
          {
            child.material = material;
          }
        }
      }
    });
  }

  clone_animated_gltf(gltf: any)
  {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };

    const skinnedMeshes: { [key: string]: any } = {};

    gltf.scene.traverse((node: any) => {
      if (node.isSkinnedMesh)
      {
        skinnedMeshes[node.name] = node;
      }
    });

    const cloneBones: { [key: string]: any } = {};
    const cloneSkinnedMeshes: { [key: string]: any } = {};

    clone.scene.traverse((node: any) => {
      if (node.isBone)
      {
        cloneBones[node.name] = node;
      }

      if (node.isSkinnedMesh)
      {
        cloneSkinnedMeshes[node.name] = node;
      }
    });

    for (const name in skinnedMeshes)
    {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];

      const orderedCloneBones = [];

      for (let i = 0; i < skeleton.bones.length; ++i)
      {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }

      cloneSkinnedMesh.bind(
        new Skeleton(orderedCloneBones, skeleton.boneInverses),
        cloneSkinnedMesh.matrixWorld);
    }

    return clone;
  }

  set_shadow_config(scene: any, cast: any, receive: any)
  {
    scene.traverse((child: any) => {
      if (child instanceof Mesh)
      {
        child.castShadow = cast;
        child.receiveShadow = receive;
      }
    });
  }

  __find_object(scene: any, object_name: any, result_callback: any)
  {
    scene.traverse((obj: any) => {
      if (obj.name === object_name)
      {
        result_callback(obj);
      }
    });
  }

  get_object(scene: any, object_name: any): any
  {
    let object = undefined;
    scene.traverse((obj: any) => {
      if (obj.name === object_name)
      {
        object = obj;
      }
    });

    return object;
  }

  get_object_by_type(scene: any, object_type: any): any
  {
    let object = undefined;
    scene.traverse((obj: any) => {
      if (obj.constructor.name === object_type)
      {
        object = obj;
      }
    });
    return object;
  }
}

const model_utilities = new ModelUtilities();
export { model_utilities as ModelUtilities };
