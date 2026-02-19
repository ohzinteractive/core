import { Vector2 } from 'three';

import type { Input } from '../../../lib/Input';
import type { PerspectiveCamera } from '../../../PerspectiveCamera';
import { Time } from '../../../Time';
import { CameraUtilities } from '../../../utilities/CameraUtilities';
import type { CameraController } from '../../CameraController';
import { AbstractCameraState } from './AbstractCameraState';

export class CommonCameraState extends AbstractCameraState
{
  azimuth_dir: number;
  forward_dir: number;
  last_point: Vector2;
  right_dir: number;
  rotation_velocity: Vector2;
  shift_key: boolean;
  y_dir: number;
  input: Input

  constructor(input: Input)
  {
    super();

    this.input = input;

    // this.vector_down_axis = new Vector3(0, -1, 0);
    // this.vector_up_axis   = new Vector3(0, 1, 0);
    // this.vector_back_axis = new Vector3(0, 0, -1);
    // this.vector_left_axis = new Vector3(-1, 0, 0);

    this.last_point = new Vector2();

    this.rotation_velocity = new Vector2();

    this.forward_dir = 0;
    this.right_dir = 0;
    this.y_dir = 0;
    this.azimuth_dir = 0;

    this.shift_key = false;
  }

  on_enter(camera_controller: CameraController)
  {
  }

  on_exit(camera_controller: CameraController)
  {
  }

  update(camera_controller: CameraController)
  {
    this.__check_key_down();
    this.__check_key_up();

    // this.__move_camera(camera_controller);
    // this.__zoom_camera(camera_controller);
    // this.__rotate_camera(camera_controller);
  }

  __show_camera_position(camera_controller: CameraController)
  {
    if (this.input.left_mouse_button_released)
    {
      console.log({
        x: camera_controller.reference_position.x,
        y: camera_controller.reference_position.y,
        z: camera_controller.reference_position.z,
        orientation: camera_controller.current_orientation,
        tilt: camera_controller.current_tilt,
        azimuth: camera_controller.current_azimuth,
        zoom: camera_controller.reference_zoom,
        fov: (camera_controller.camera as PerspectiveCamera).fov
      });
    }
  }

  __zoom_camera(camera_controller: CameraController)
  {
    camera_controller.reference_zoom += this.input.zoom_delta * 0.5;
  }

  __rotate_camera(camera_controller: CameraController)
  {
    if (this.input.left_mouse_button_down && this.input.pointer_count === 1)
    {
      const delta = new Vector2(this.input.NDC_delta.x * -24, this.input.NDC_delta.y * -8);
      delta.multiplyScalar(Time.delta_time * 60);

      this.rotation_velocity.add(delta);
    }

    camera_controller.set_rotation_delta(this.rotation_velocity.y, this.rotation_velocity.x);
    // camera_controller.set_rotation_delta(0, 0, this.azimuth_dir);

    const blend = 1 - Math.exp(-5 * Time.delta_time);
    this.rotation_velocity.lerp(new Vector2(0, 0), blend);
  }

  __move_camera(camera_controller: CameraController)
  {
    camera_controller.translate_forward(this.forward_dir);
    camera_controller.translate_right(this.right_dir);

    camera_controller.reference_position.y -= this.y_dir;

    if (this.input.right_mouse_button_pressed)
    {
      this.last_point.copy(this.input.NDC);
    }

    if (this.input.right_mouse_button_down) // || (this.input.left_mouse_button_down && this.shift_key)
    {
      const prev_point    = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.last_point).clone();
      const current_point = CameraUtilities.get_plane_intersection(camera_controller.reference_position, undefined, this.input.NDC).clone();
      current_point.sub(prev_point);

      camera_controller.reference_position.x -= current_point.x;
      camera_controller.reference_position.y -= current_point.y;
      camera_controller.reference_position.z -= current_point.z;
      this.last_point.copy(this.input.NDC);
    }
  }

  __check_key_down()
  {
    const speed = 0.12;

    if (this.input.keyboard.is_key_down('KeyW'))
    {
      this.forward_dir = -speed;
    }
    if (this.input.keyboard.is_key_down('KeyS'))
    {
      this.forward_dir = speed;
    }
    if (this.input.keyboard.is_key_down('KeyA'))
    {
      this.right_dir = -speed;
    }
    if (this.input.keyboard.is_key_down('KeyD'))
    {
      this.right_dir = speed;
    }
    if (this.input.keyboard.is_key_down('KeyQ'))
    {
      this.azimuth_dir = speed * 4;
    }
    if (this.input.keyboard.is_key_down('KeyE'))
    {
      this.azimuth_dir = -speed * 4;
    }
    if (this.input.keyboard.is_key_down('KeyZ'))
    {
      this.y_dir = speed;
    }
    if (this.input.keyboard.is_key_down('KeyC'))
    {
      this.y_dir = -speed;
    }
    if (this.input.keyboard.is_key_down('ShiftLeft'))
    {
      this.shift_key = true;
    }
  }

  __check_key_up()
  {
    if (this.input.keyboard.is_key_released('KeyW'))
    {
      this.forward_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyS'))
    {
      this.forward_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyA'))
    {
      this.right_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyD'))
    {
      this.right_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyQ'))
    {
      this.azimuth_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyE'))
    {
      this.azimuth_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyZ'))
    {
      this.y_dir = 0;
    }
    if (this.input.keyboard.is_key_released('KeyC'))
    {
      this.y_dir = 0;
    }
    if (this.input.keyboard.is_key_released('ShiftLeft'))
    {
      this.shift_key = false;
    }
  }
}
