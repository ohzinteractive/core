import { Mesh } from 'three';
import { BufferGeometry } from 'three';
import { Skeleton } from 'three';

class ModelUtilities
{
  get_mesh(scene, result_callback)
  {
    scene.traverse((child) =>
    {
      if (child instanceof Mesh)
      {
        if (child.geometry)
        {
          child.geometry = new BufferGeometry().fromGeometry(child.geometry);
        }
        result_callback(child);
      }
    });
  }

  get_geometries(scene)
  {
    let geometries = [];

    this.get_mesh(scene, (child) =>
    {
      geometries.push(child.geometry);
    });
    return geometries;
  }

  assign_material(scene, material, name)
  {
    scene.traverse((child) =>
    {
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

  clone_animated_gltf(gltf)
  {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };

    const skinnedMeshes = {};

    gltf.scene.traverse(node =>
    {
      if (node.isSkinnedMesh)
      {
        skinnedMeshes[node.name] = node;
      }
    });

    const cloneBones = {};
    const cloneSkinnedMeshes = {};

    clone.scene.traverse(node =>
    {
      if (node.isBone)
      {
        cloneBones[node.name] = node;
      }

      if (node.isSkinnedMesh)
      {
        cloneSkinnedMeshes[node.name] = node;
      }
    });

    for (let name in skinnedMeshes)
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

  set_shadow_config(scene, cast, receive)
  {
    scene.traverse((child) =>
    {
      if (child instanceof Mesh)
      {
        child.castShadow = cast;
        child.receiveShadow = receive;
      }
    });
  }

  __find_object(scene, object_name, result_callback)
  {
    scene.traverse((obj) =>
    {
      if (obj.name === object_name)
      {
        result_callback(obj);
      }
    });
  }

  get_object(scene, object_name)
  {
    let object = undefined;
    scene.traverse((obj) =>
    {
      if (obj.name === object_name)
      {
        object = obj;
      }
    });
    return object;
  }

  get_object_by_type(scene, object_type)
  {
    let object = undefined;
    scene.traverse((obj) =>
    {
      if (obj.constructor.name === object_type)
      {
        object = obj;
      }
    });
    return object;
  }
}

export default new ModelUtilities();
