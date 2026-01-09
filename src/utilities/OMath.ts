class OMath
{
  constructor()
  {}

  static linear_map(value: any,
    from_range_start_value: any,
    from_range_end_value: any,
    to_range_start_value: any,
    to_range_end_value: any)
  {
    return ((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (to_range_end_value - to_range_start_value) + to_range_start_value;
  }

  static between(value: any, min: any, max: any)
  {
    return (value >= min && value <= max);
  }

  static mod(number: any, divisor: any)
  {
    return ((number % divisor) + divisor) % divisor;
  }

  static rgb_to_hex(rgb: any)
  {
    rgb.r = Math.round(rgb.r * 255).toString(16);
    rgb.g = Math.round(rgb.g * 255).toString(16);
    rgb.b = Math.round(rgb.b * 255).toString(16);

    if (rgb.r.length === 1)
    {
      rgb.r = '0' + rgb.r;
    }
    if (rgb.g.length === 1)
    {
      rgb.g = '0' + rgb.g;
    }
    if (rgb.b.length === 1)
    {
      rgb.b = '0' + rgb.b;
    }

    return '#' + rgb.r + rgb.g + rgb.b;
  }

  static project_points_on_plane(points: any, plane: any)
  {
    const projected_point = points[0].clone();
    projected_point.set(0, 0, 0);

    const points_on_plane = [];

    for (let i = 0; i < points.length; i++)
    {
      plane.projectPoint(points[i], projected_point);
      points_on_plane.push(projected_point.clone());
    }

    return points_on_plane;
  }

  static matrix4_lerp(from: any, to: any, target: any, t: any)
  {
    for (let i = 0; i < 16; i++)
    {
      target.elements[i] = this.lerp(from.elements[i], to.elements[i], t);
    }
  }

  static equals(x1: any, x2: any)
  {
    return Math.abs(x1 - x2) < 0.000001;
  }

  static lerp(x: any, y: any, t: any)
  {
    return (1 - t) * x + t * y;
  }

  static clamp(value: any, min: any, max: any)
  {
    return Math.max(min, Math.min(max, value));
  }

  static euclideanModulo(n: any, m: any)
  {
    return ((n % m) + m) % m;
  }

  static pingpong(x: any, length = 1)
  {
    return length - Math.abs(OMath.euclideanModulo(x, length * 2) - length);
  }

  static degToRad(degrees: any)
  {
    return degrees * (Math.PI / 180);
  }

  static radToDeg(radians: any)
  {
    return radians * (180 / Math.PI);
  }

  static deg_to_rad(degrees: any)
  {
    return degrees * (Math.PI / 180);
  }

  static rad_to_deg(radians: any)
  {
    return radians * (180 / Math.PI);
  }

  static perspective_divide(v: any)
  {
    v.x /= v.w;
    v.y /= v.w;
    v.z /= v.w;
    return v;
  }

  static points_average(points: any)
  {
    const center = points[0].clone();
    for (let i = 1; i < points.length; i++)
    {
      center.add(points[i]);
    }
    center.multiplyScalar(1 / points.length);
    return center;
  }

  static get_random_color()
  {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

    let col = '#';
    col += arr[Math.floor(Math.random() * 16)];
    col += arr[Math.floor(Math.random() * 16)];

    col += arr[Math.floor(Math.random() * 16)];
    col += arr[Math.floor(Math.random() * 16)];

    col += arr[Math.floor(Math.random() * 16)];
    col += arr[Math.floor(Math.random() * 16)];
    return col;
  }

  static saturate(x: any)
  {
    return OMath.clamp(x, 0, 1);
  }

  /**
  * Generate a [UUID]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
  * (universally unique identifier).
  *
  * @return {string} The UUID.
  */
  static generate_uuid()
  {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
    const _lut = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f',
      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f',
      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f',
      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f',
      '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f',
      '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f',
      '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f',
      '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f',
      'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af',
      'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf',
      'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf',
      'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df',
      'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef',
      'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];

    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
    _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
    _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
    _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

    // .toLowerCase() here flattens concatenated strings to save heap memory space.
    return uuid.toLowerCase();
  }
}

export { OMath };
