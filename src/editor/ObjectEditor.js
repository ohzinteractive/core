import { ObjectManipulator } from './ObjectManipulator';
import { ObjectPicker } from './ObjectPicker';

import { Raycaster } from 'three';

class ObjectEditor
{
  constructor(renderer, scene, camera, input)
  {
    this.raycaster = new Raycaster();

    this.selected_object = undefined;
    this.object_manipulator = new ObjectManipulator(input);
    this.object_picker = new ObjectPicker(renderer, scene, camera);

    this.scene = scene;
    this.camera = camera;
    this.input = input;

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
    if (this.input.left_mouse_button_pressed)
    {
      const x = this.object_picker.pick(this.input.NDC, this.selectable_objects);
      if (x !== 0)
      {
        const selected_obj = this.selectable_objects[x - 1];
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

export { ObjectEditor };
