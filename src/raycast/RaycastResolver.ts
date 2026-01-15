import type { Vector3 } from "three";

class RaycastResolver
{
  constructor()
  {

  }

  on_enter(intersected_point: Vector3)
  {
    // console.log("on enter");
  }

  on_hover(intersected_point: Vector3)
  {
    // console.log("on hover");
  }

  on_exit()
  {
    // console.log("on exit");
  }
}

export { RaycastResolver };
