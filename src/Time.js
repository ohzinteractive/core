import { Clock, Vector2 } from 'three';

class Time
{
  constructor()
  {
    this.__delta_buffer = [0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016];
  }

  init()
  {
    this.___time = new Clock();
    this.__delta_time = 0;
    this.__smooth_delta_time = 0;
    this.__elapsed_time = 0;
    this.__allocated_time = new Vector2(0, 0);
    this.__frame_interpolation_t = 0;
    this.fixed_delta_time = 1 / 30;
  }

  get elapsed_time()
  {
    return this.__elapsed_time;
  }

  get delta_time()
  {
    return this.__delta_time;
  }

  get smooth_delta_time()
  {
    return this.__smooth_delta_time;
  }

  get shader_time()
  {
    this.__allocated_time.x = this.delta_time;
    this.__allocated_time.y = this.elapsed_time;
    return  this.__allocated_time;
  }

  get frame_interpolation()
  {
    return this.__frame_interpolation_t;
  }

  get fdt()
  {
    return this.fixed_delta_time;
  }

  get dt()
  {
    return this.delta_time;
  }

  get sdt()
  {
    return this.smooth_delta_time;
  }

  to_json()
  {
    const data = {

      elapsed_time: this.elapsed_time,
      delta_time: this.delta_time,
      smooth_delta_time: this.smooth_delta_time

    };

    return data;
  }

  __set_frame_interpolation(value)
  {
    this.__frame_interpolation_t = value;
  }

  __update()
  {
    this.__delta_time = this.___time.getDelta();
    this.__elapsed_time = this.___time.getElapsedTime();

    this.__delta_buffer.shift();
    this.__delta_buffer.push(this.delta_time < 0.32 ? this.delta_time : 0.032);

    this.__calculate_smooth_delta_time();
  }

  __calculate_smooth_delta_time()
  {
    this.__smooth_delta_time = 0;

    for (let i = 0; i < this.__delta_buffer.length; i++)
    {
      this.__smooth_delta_time += this.__delta_buffer[i];
    }

    this.__smooth_delta_time = this.__smooth_delta_time / this.__delta_buffer.length;
  }
}

const time = new Time();
export { time as Time };
