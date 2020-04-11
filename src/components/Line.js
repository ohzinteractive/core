import line_vs from '/shaders/basic_line/basic_line_vert'
import line_fs from '/shaders/basic_line/basic_line_frag'

export default class Line extends THREE.Mesh {

  constructor(points) {


    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position',           new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.addAttribute('next_position',      new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.addAttribute('previous_position',  new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.addAttribute('orientation',        new THREE.BufferAttribute(new Float32Array([]), 1));
    geometry.addAttribute('coverage',           new THREE.BufferAttribute(new Float32Array([]), 1));

    let material = new THREE.ShaderMaterial({
      uniforms: {
        _Thickness: { value: 0.2 },
        _Length: { value: 0 },
        _ElapsedTime: { value: 0 },
        _Color: {value: new THREE.Color("#FF0000")},
      },
      vertexShader: line_vs,
      fragmentShader: line_fs,
      transparent: true,
      depthWrite: false,
      extensions: { derivatives: true}

    });

    super(geometry, material);

    if(points)
      this.setup(points);
  }

  setup(points)
  {

    let vertices = [];
    let next_position = [];
    let previous_position = [];
    let orientation = [];
    let coverage = [];
    let accumulated_length = 0;


    for (let i = 0; i < points.length; i++) {

      vertices.push(points[i].x);
      vertices.push(points[i].y);
      vertices.push(points[i].z);
      orientation.push(1);

      vertices.push(points[i].x);
      vertices.push(points[i].y);
      vertices.push(points[i].z);
      orientation.push(-1);

      let next_point = this.__get_next_position(points, i);
      next_position.push(next_point.x);
      next_position.push(next_point.y);
      next_position.push(next_point.z);

      next_position.push(next_point.x);
      next_position.push(next_point.y);
      next_position.push(next_point.z);

      let previous_point = this.__get_previous_position(points, i);
      previous_position.push(previous_point.x);
      previous_position.push(previous_point.y);
      previous_position.push(previous_point.z);

      previous_position.push(previous_point.x);
      previous_position.push(previous_point.y);
      previous_position.push(previous_point.z);


      if(i < points.length -1)
        accumulated_length += points[i].distanceTo(next_point);

      coverage.push(accumulated_length);
      coverage.push(accumulated_length);

    }

    let vertexList            = new Float32Array(vertices);
    let nextPositionList      = new Float32Array(next_position);
    let previousPositionList  = new Float32Array(previous_position);
    let orientationList       = new Float32Array(orientation);
    let coverageList          = new Float32Array(coverage);


    let indices = [];
    for (let i = 0; i < ((vertexList.length / 3) - 2) / 2; i++) {
      let index = (i * 2) + 1;
      indices.push(index);
      indices.push(index + 1);
      indices.push(index - 1);

      indices.push(index);
      indices.push(index + 2);
      indices.push(index + 1);
    }

    this.geometry.setIndex(indices);
    this.geometry.getAttribute('position').copy(          new THREE.BufferAttribute(vertexList, 3));
    this.geometry.getAttribute('next_position').copy(     new THREE.BufferAttribute(nextPositionList, 3));
    this.geometry.getAttribute('previous_position').copy( new THREE.BufferAttribute(previousPositionList, 3));
    this.geometry.getAttribute('orientation').copy(       new THREE.BufferAttribute(orientationList, 1));
    this.geometry.getAttribute('coverage').copy(          new THREE.BufferAttribute(coverageList, 1));

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.getAttribute('next_position').needsUpdate = true;
    this.geometry.getAttribute('previous_position').needsUpdate = true;
    this.geometry.getAttribute('orientation').needsUpdate = true;
    this.geometry.getAttribute('coverage').needsUpdate = true;

    this.material.uniforms._Length.value = accumulated_length;
    this._length = accumulated_length;
  }

  set thickness(value)
  {
    this.material.uniforms._Thickness.value = value;
  }



  __get_previous_position(points, i)
  {
    if(i === 0)
    {
      return points[1].clone().sub(points[0]).multiplyScalar(-1).add(points[0]);
    }
    else
    {
      return points[i-1];
    }
  }
  __get_next_position(points, i)
  {
    if(i === points.length-1)
    {
      return points[points.length-2].clone().sub(points[points.length-1]).multiplyScalar(-1).add(points[points.length-1]);
    }
    else
    {
      return points[i+1];
    }
  }

  update() {
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
    if(this.parent)
      this.parent.remove(this);
  }

  set color(col)
  {
  	this.material.uniforms._Color.value.set(col);
  }
  copy_color(col)
  {
  	this.material.uniforms._Color.value.copy(col);
  }
}
