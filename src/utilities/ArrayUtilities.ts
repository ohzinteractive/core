import type { Vector3 } from "three";

class ArrayUtilities
{
  constructor()
  {}

  static merge_from_to<T>(source: Array<T>, target: Array<T>)
  {
    target.push.apply(target, source);
  }

  static expand_vec3_array(array: Array<Vector3>, size: number)
  {
    const items_left_count = size - array.length;

    for (let i = 0; i < items_left_count; i++)
    {
      array.push(array[i].clone());
    }
  }

  static remove_elem<T>(array: Array<T>, elem: T)
  {
    const index = array.indexOf(elem);
    if (index > -1)
    {
      array.splice(index, 1);
    }
  }

  static get_closest_point(points: Array<Vector3>, target: Vector3): Vector3
  {
    let closest_point = points[0];
    let closest_distance = closest_point.distanceTo(target);
    for (let i = 1; i < points.length; i++)
    {
      if (points[i].distanceTo(target) < closest_distance)
      {
        closest_point = points[i];
        closest_distance = points[i].distanceTo(target);
      }
    }
    return closest_point;
  }

  static object_values_to_array<T>(obj: { [key: string]: T }): Array<T>
  {
    const ids = Object.keys(obj);
    const arr: Array<T> = [];

    for (let i = 0; i < ids.length; i++)
    {
      arr.push(obj[ids[i]]);
    }
    return arr;
  }
}

export { ArrayUtilities };
