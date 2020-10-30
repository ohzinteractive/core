/*

  A configuration class used as a singleton

*/

import { Color } from 'three';

class Configuration
{
  constructor(parameters = {})
  {
    this.dpr = 1;
    this.is_mobile = false;
    this.is_ios = false;
    this.is_ipad = false;

    this.vertex_image_unit_supported = true;

    this.min_zoom_distance = 3000;

    this.max_zoom_distance = 40000;
    this.max_zoom_distance_scale = 1.1;
    this.zoom_speed = 0.1;

    this.use_fxaa = false;
    this.use_ssaa = true;

    this.background_color = new Color(0.768, 0.768, 0.768);

    // TOUCH
    this.touch_sensitivity = 1.5;
    this.zoom_sensitivity = 0.7;
    this.spin_sensitivity = 2;
    this.three_finger_rotation_speed = 3;
    this.three_finger_allowed_x_rotation_offset = 30;
    this.three_finger_allowed_y_rotation_offset = 20;

    this.use_touch_gestures = false;

    this.texture_float_supported = false;

    this.use_ortographic = true;

    this.hover_enabled = false;
    this.rotation_enabled = false;

    this.transparency_amount = 0.2;

    this.show_debug_sphere_on_floor_selection = false;
    this.show_debug_sphere_on_steps_in_floor = false;
    this.display_cleanup_log = false;

    this.navigation_speed_damping = 0.74;
    this.navigation_speed = 200;
    this.out_of_bounds_force = 1.5;
    this.mouse_zoom_speed = 0.05;
    this.touch_zoom_speed = 0.5;
  }

  from_json(json)
  {

  }
}

export default new Configuration();
