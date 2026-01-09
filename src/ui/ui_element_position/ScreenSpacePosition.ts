import { Vector2 } from 'three';

class ScreenSpacePosition
{
  tmp_vec: any;
  constructor()
  {
    this.tmp_vec = new Vector2();
  }

  get_pos_NDC(position: any)
  {
    return this.tmp_vec.set(position.x, position.y);
  }
}

export { ScreenSpacePosition };
