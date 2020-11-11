import AxisHelper from './components/AxisHelper';
import basic_color_vert from './shaders/basic_color/basic_color.vert';
import basic_color_frag from './shaders/basic_color/basic_color.frag';
import SceneManager from './SceneManager';
import Cube from './primitives/Cube';
import Sphere from './primitives/Sphere';
import Arrow from './primitives/Arrow';

import { Vector3 } from 'three';
import { LineBasicMaterial } from 'three';
import { BufferGeometry } from 'three';
import { Line } from 'three';
import { PlaneGeometry } from 'three';
import { ShaderMaterial } from 'three';
import { Vector4 } from 'three';
import { Mesh } from 'three';
import { Box3 } from 'three';
import { Box3Helper } from 'three';
import { CatmullRomCurve3 } from 'three';
import { SphereGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

class Debug
{
  constructor()
  {
    this.Vector3_one = new Vector3(1, 1, 1);
    this.Vector3_zero = new Vector3(0, 0, 0);
    this.canvas_renderer = undefined;

    this.rt_debug = undefined;
  }

  init(webgl)
  {
    this.webgl = webgl;

    this.ctx = undefined;

    // var cln = webgl.dom.cloneNode(false);
    // cln.id = "canvas_debug";
    // $(cln).css("position", "absolute");
    // webgl.dom.parentElement.insertBefore(cln, webgl.dom);
    // this.ctx = cln.getContext('2d');

    // this.ctx.clearRect(0, 0, cln.width, cln.height);
    // this.ctx.fillStyle =  "rgba(255, 0, 0, 1)";
  }

  draw_arrow(origin, dir, color = 0xff0000)
  {
    let arrow = new Arrow(color, dir.length(), dir.clone().normalize());
    arrow.position.copy(origin);
    SceneManager.current.add(arrow);
    return arrow;
  }

  draw_axis()
  {
    let axis = new AxisHelper();
    SceneManager.current.add(axis);
    return axis;
  }

  set_debug_RT(RT)
  {
    this.rt_debug = RT;
  }

  draw_rectangle(position_2d, width, height, color)
  {
    width  = width || 100;
    height = height || 100;
    this.ctx.fillStyle =  color || 'rgba(255, 0, 0, 1)';
    this.ctx.fillRect(position_2d.x - width / 2,
      (this.ctx.canvas.height - position_2d.y) - height / 2, width, height);
  }

  clear()
  {
    if (this.ctx)
    {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  draw_line_2D(from, to, color)
  {
    this.ctx.strokeStyle =  color || 'rgba(255, 0, 0, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  draw_line(points, color = 0xff0000)
  {
    let material = new LineBasicMaterial({
      color: color
    });

    let geometry = new BufferGeometry().setFromPoints(points);

    let line = new Line(geometry, material);
    line.frustumCulled = false;
    SceneManager.current.add(line);
    return line;
  }

  draw_cube(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    let cube = new Cube(new Vector3(size, size, size), undefined, color);
    cube.position.copy(pos);
    SceneManager.current.add(cube);
    return cube;
  }

  draw_oriented_cube(from, to, height = 1, color = '#FF0000', depth = 0.1)
  {
    let size = from.distanceTo(to);
    let cube = new Cube(new Vector3(depth, height, size), undefined, color);

    let center = to.clone().sub(from).multiplyScalar(0.5);
    let forward_dir = center.clone().normalize();
    center.add(from);

    cube.position.copy(center);

    // let up = new Vector3(0, 1, 0);
    // let forward = forward_dir.clone();
    // let right = forward.clone().cross(up);

    // cube.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(right,up,forward));
    cube.quaternion.setFromUnitVectors(new Vector3(0, 0, -1), forward_dir);

    SceneManager.current.add(cube);
    return cube;
  }

  draw_plane(width, height, color)
  {
    let geometry = new PlaneGeometry(width, height);
    let material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Vector4(0, 1, 0, 0.2) }
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true,
      depthWrite: false
    });

    let plane = new Mesh(geometry, material);
    plane.renderOrder = -10000;
    SceneManager.current.add(plane);
    return plane;
  }

  draw_empty_cube(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;

    let box = new Box3().setFromCenterAndSize(new Vector3(), new Vector3(size, size, size));
    let helper = new Box3Helper(box, color);
    helper.position.copy(pos || new Vector3());
    return helper;
  }

  draw_sphere(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    let sphere = new Sphere(size, color);
    sphere.position.copy(pos);
    SceneManager.current.add(sphere);
    return sphere;
  }

  draw_point_array(input_points, open = false, color = 0xff0000)
  {
    let catmull = new CatmullRomCurve3(input_points, open);
    catmull.updateArcLengths();
    let points = catmull.getSpacedPoints(200);
    let line_helper = this.draw_line(points, 0x00ff00);
    // line_helper.position.y = 1.5;
    return line_helper;
  }

  draw_sphere_helper(sphere, color)
  {
    color = color || 0xff0000;
    let geometry = new SphereGeometry(sphere.radius, 32, 32);
    let material = new MeshBasicMaterial({ color: color });
    let sphere_mesh = new Mesh(geometry, material);
    sphere_mesh.position.copy(sphere.center);
    SceneManager.current.add(sphere_mesh);
    return sphere_mesh;
  }

  draw_math_sphere(sphere)
  {
    let geometry = new SphereGeometry(sphere.radius, 32, 32);
    let material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Vector4(1, 0, 0, 0.2) }
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true
    });
    // var material = new MeshBasicMaterial( {color: 0xff0000, transparent = true} );
    let sphere1 = new Mesh(geometry, material);
    sphere1.position.copy(sphere.center);
    SceneManager.current.add(sphere1);
  }

  draw_bounding_box(bb)
  {
    let helper = new Box3Helper(bb, 0xffff00);
    SceneManager.current.add(helper);
  }

  draw_curve(curve, options)
  {
    let offset = new Vector3(0, 0, 0);
    if (options)
    {
      offset.y = options.offset || 0;
    }

    for (let i = 0; i < curve.length - 1; i++)
    {
      this.draw_line(curve[i].clone().add(offset), curve[i + 1].clone().add(offset));
    }
  }
}

export default new Debug();
