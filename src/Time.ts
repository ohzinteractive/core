class Time
{
  __delta_buffer: number[];
  __delta_time: number;
  __elapsed_time: number;
  __frame_interpolation_t: number;
  __previous_elapsed_time: number;
  __smooth_delta_time: number;
  fixed_delta_time: number;
  
  constructor()
  {
    this.__delta_buffer = [0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016];
  }

  init(): void
  {
    this.__previous_elapsed_time = -1;
    this.__delta_time = 0;
    this.__smooth_delta_time = 0;
    this.__elapsed_time = 0;
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

  __set_frame_interpolation(value: number): void
  {
    this.__frame_interpolation_t = value;
  }

  __update(elapsed_time: number): void
  {
    if (this.__previous_elapsed_time < 0)
    {
      this.__previous_elapsed_time = elapsed_time;
    }
    this.__delta_time = (elapsed_time - this.__previous_elapsed_time) / 1000;
    this.__elapsed_time = elapsed_time / 1000;

    this.__delta_buffer.shift();
    this.__delta_buffer.push(this.delta_time < 0.32 ? this.delta_time : 0.032);

    this.__calculate_smooth_delta_time();

    this.__previous_elapsed_time = elapsed_time;
  }

  __calculate_smooth_delta_time(): void
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
