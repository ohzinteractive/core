import CameraManager from '/CameraManager';
import Input from '/Input';
import ObjectManipulator from '/ObjectManipulator';
import ObjectPicker from '/ObjectPicker';

import * as THREE from 'three';

export default class ObjectEditor
{
  constructor(renderer, scene, camera)
  {
    this.raycaster = new THREE.Raycaster();

    this.selected_object = undefined;
    this.object_manipulator = new ObjectManipulator();
    this.object_picker = new ObjectPicker(renderer, scene, camera);

    this.scene = scene;
    this.camera = camera;

    this.selectable_objects = [];

    scene.add(this.object_manipulator);
  }

  refresh_scene()
  {
    this.selectable_objects.length = 0;
    this.__populate_selectable_objects(this.selectable_objects);
    this.__set_object_ids(this.selectable_objects);
  }

  update()
  {
    if (Input.mouse_clicked())
    {
      let x = this.object_picker.pick(Input.normalized_mouse_pos, this.selectable_objects);
      if (x !== 0)
      {
      	let selected_obj = this.selectable_objects[x - 1];
      	// this.object_manipulator.position.copy(selected_obj.position);
      	this.object_manipulator.set_target(selected_obj);
      }
    }

    this.object_manipulator.update();
  }

  __populate_selectable_objects(array)
  {
    this.scene.traverse((child) =>
    {
      if (child.selectable_material)
      {
        array.push(child);
      }
    });
  }

  __set_object_ids(array)
  {
    for (let i = 0; i < array.length; i++)
    {
      array[i].selectable_material.uniforms._Color.value.setHex(i + 1);
    }
  }
}
