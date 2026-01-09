import line_fs from '../shaders/basic_line/basic_line.frag';
import line_vs from '../shaders/basic_line/basic_line.vert';

import type { Vector3 } from 'three';
import { BufferAttribute, BufferGeometry, Color, Mesh, ShaderMaterial } from 'three';

class Line extends Mesh
{
  _length: any;
  accumulated_length: any;
  material: ShaderMaterial

  constructor(points: Vector3)
  {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position',           new BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('next_position',      new BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('previous_position',  new BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('orientation',        new BufferAttribute(new Float32Array([]), 1));
    geometry.setAttribute('coverage',           new BufferAttribute(new Float32Array([]), 1));

    const material = new ShaderMaterial({
      uniforms: {
        _Thickness: { value: 0.2 },
        _Length: { value: 0 },
        _ElapsedTime: { value: 0 },
        _Color: { value: new Color('#FF0000') }
      },
      vertexShader: line_vs,
      fragmentShader: line_fs,
      transparent: true,
      depthWrite: false
    });

    super(geometry, material);
    this.material = material;
    if (points)
    {
      this.setup(points);
    }
  }

  /**
   * @param {Vector3[]} points
   */
  setup(points: any)
  {
    const vertices = [];
    const next_position = [];
    const previous_position = [];
    const orientation = [];
    const coverage = [];
    let accumulated_length = 0;

    for (let i = 0; i < points.length; i++)
    {
      vertices.push(points[i].x);
      vertices.push(points[i].y);
      vertices.push(points[i].z);
      orientation.push(1);

      vertices.push(points[i].x);
      vertices.push(points[i].y);
      vertices.push(points[i].z);
      orientation.push(-1);

      const next_point = this.__get_next_position(points, i);
      next_position.push(next_point.x);
      next_position.push(next_point.y);
      next_position.push(next_point.z);

      next_position.push(next_point.x);
      next_position.push(next_point.y);
      next_position.push(next_point.z);

      const previous_point = this.__get_previous_position(points, i);
      previous_position.push(previous_point.x);
      previous_position.push(previous_point.y);
      previous_position.push(previous_point.z);

      previous_position.push(previous_point.x);
      previous_position.push(previous_point.y);
      previous_position.push(previous_point.z);

      coverage.push(accumulated_length);
      coverage.push(accumulated_length);

      if (i < points.length - 1)
      {
        accumulated_length += points[i].distanceTo(next_point);
      }
    }
    const vertexList            = new Float32Array(vertices);
    const nextPositionList      = new Float32Array(next_position);
    const previousPositionList  = new Float32Array(previous_position);
    const orientationList       = new Float32Array(orientation);
    const coverageList          = new Float32Array(coverage);

    const indices = [];
    for (let i = 0; i < ((vertexList.length / 3) - 2) / 2; i++)
    {
      const index = (i * 2) + 1;
      indices.push(index);
      indices.push(index + 1);
      indices.push(index - 1);

      indices.push(index);
      indices.push(index + 2);
      indices.push(index + 1);
    }

    this.geometry.setIndex(indices);
    (this.geometry.getAttribute('position') as BufferAttribute).copy(new BufferAttribute(vertexList, 3));
    (this.geometry.getAttribute('next_position') as BufferAttribute).copy(new BufferAttribute(nextPositionList, 3));
    (this.geometry.getAttribute('previous_position') as BufferAttribute).copy(new BufferAttribute(previousPositionList, 3));
    (this.geometry.getAttribute('orientation') as BufferAttribute).copy(new BufferAttribute(orientationList, 1));
    (this.geometry.getAttribute('coverage') as BufferAttribute).copy(new BufferAttribute(coverageList, 1));

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.getAttribute('next_position').needsUpdate = true;
    this.geometry.getAttribute('previous_position').needsUpdate = true;
    this.geometry.getAttribute('orientation').needsUpdate = true;
    this.geometry.getAttribute('coverage').needsUpdate = true;

    this.material.uniforms._Length.value = accumulated_length;
    this._length = accumulated_length;
    this.accumulated_length = accumulated_length;
  }

  set thickness(value)
  {
    this.material.uniforms._Thickness.value = value;
  }
  
  get thickness()
  {
    return this.material.uniforms._Thickness.value;
  }

  /**
   * @param {Vector3[]} points
   * @param {number} i
   * @returns {Vector3}
   */
  __get_previous_position(points: any, i: any)
  {
    if (i === 0)
    {
      return points[1].clone().sub(points[0]).multiplyScalar(-1).add(points[0]);
    }
    else
    {
      return points[i - 1];
    }
  }

  /**
   * @param {Vector3[]} points
   * @param {number} i
   * @returns {Vector3}
   */
  __get_next_position(points: any, i: any)
  {
    if (i === points.length - 1)
    {
      return points[points.length - 2].clone().sub(points[points.length - 1]).multiplyScalar(-1).add(points[points.length - 1]);
    }
    else
    {
      return points[i + 1];
    }
  }

  update()
  {
  }

  distance()
  {
    return this.accumulated_length;
  }

  total_length()
  {
    return this.accumulated_length;
  }

  dispose()
  {
    this.geometry.dispose();
    this.material.dispose();
    if (this.parent)
    {
      this.parent.remove(this);
    }
  }

  set color(col)
  {
    this.material.uniforms._Color.value.set(col);
  }

  get color()
  {
    return this.material.uniforms._Color.value;
  }

  /**
   * @param {Color} col
   */
  copy_color(col: any)
  {
    this.material.uniforms._Color.value.copy(col);
  }
}

export { Line };
