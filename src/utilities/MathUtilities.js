export default class MathUtilities
{
	constructor(){}

	static linear_map(value,
             from_range_start_value,
             from_range_end_value,
             to_range_start_value,
             to_range_end_value)
  {
      return ((value - from_range_start_value)/ (from_range_end_value - from_range_start_value)) * (to_range_end_value - to_range_start_value) + to_range_start_value;
  }

  static between(value, min, max)
  {
		return (value >= min && value <= max)

  }

  static rgb_to_hex(rgb) {
    rgb.r = Math.round(rgb.r * 255).toString(16);
    rgb.g = Math.round(rgb.g * 255).toString(16);
    rgb.b = Math.round(rgb.b * 255).toString(16);

    if (rgb.r.length == 1)
      rgb.r = "0" + rgb.r;
    if (rgb.g.length == 1)
      rgb.g = "0" + rgb.g;
    if (rgb.b.length == 1)
      rgb.b = "0" + rgb.b;

    return "#" + rgb.r + rgb.g + rgb.b;
  }

  static project_points_on_plane(points, plane)
  {
    let projected_point = new THREE.Vector3();
    let points_on_plane = [];
    for(let i=0; i< points.length; i++)
    {
      plane.projectPoint(points[i], projected_point);
      points_on_plane.push(projected_point.clone());
    }

    return points_on_plane;
  }

  static matrix4_lerp(from,to,target, t)
  {
    for(let i=0; i< 16; i++)
    {
      target.elements[i] = THREE.Math.lerp(from.elements[i], to.elements[i], t);
    }
  }
}
