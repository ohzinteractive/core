export default class ArrayUtilities
{
	constructor(){}


  static merge_from_to(source, target)
  {
    target.push.apply( target, source );
  }

  static expand_vec3_array(array, size)
  {
    let items_left_count = size - array.length;

		for (let i = 0;i < items_left_count;i++)
    {
      array.push(array[i].clone());
    }
  }

  static remove_elem(array, elem)
  {
    let index = array.indexOf(elem);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  static get_closest_point(points, target)
  {
    let closest_point = points[0];
    let closest_distance = closest_point.distanceTo(target);
    for(let i=1; i< points.length; i++)
    {
      if(points[i].distanceTo(target) < closest_distance)
      {
        closest_point = points[i];
        closest_distance = points[i].distanceTo(target);
      }
    }
    return closest_point;
  }

}

