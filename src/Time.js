import { Vector2 } from 'three';
import { Clock } from 'three';

class Time
{
  constructor()
  {
    this.delta_buffer = [0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016, 0.016];
  }

  init()
  {
    this.___time = new Clock();
    this.__raw_delta_time = 0;
    this.__elapsed_time = 0;
    this.__allocated_time = new Vector2(0, 0);

    this.delta_time = 0.016;
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
    this.__raw_delta_time = this.___time.getDelta();
    this.__elapsed_time = this.___time.getElapsedTime();

    this.delta_buffer.shift();
    this.delta_buffer.push(this.__raw_delta_time < 0.32 ? this.__raw_delta_time : 0.032);

    this.__calculate_delta_time();
  }

  __calculate_delta_time()
  {
    this.delta_time = 0;

    for (let i = 0; i < this.delta_buffer.length; i++)
    {
      this.delta_time += this.delta_buffer[i];
    }

    this.delta_time = this.delta_time / this.delta_buffer.length;
  }
}

const time = new Time();
export { time as Time };
