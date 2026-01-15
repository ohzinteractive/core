import { AxisHelper } from './components/AxisHelper';

import { ScreenSpaceTextureMaterial } from './materials/ScreenSpaceTextureMaterial';
import { OScreen } from './OScreen';
import { PerspectiveCamera } from './PerspectiveCamera';
import { Arrow } from './primitives/Arrow';
import { Cube } from './primitives/Cube';
import { Sphere } from './primitives/Sphere';
import { SceneManager } from './SceneManager';

import { Box3, Box3Helper, BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, ShaderMaterial, SphereGeometry, Texture, Vector2, Vector3, Vector4, WebGLRenderTarget } from 'three';
import { CameraManager } from './CameraManager';
import basic_color_frag from './shaders/basic_color/basic_color.frag';
import basic_color_vert from './shaders/basic_color/basic_color.vert';

class Debug
{
  Vector3_one: Vector3;
  Vector3_zero: Vector3;
  camera: PerspectiveCamera;
  canvas_renderer: any;
  ctx: any;
  display_texture_meshes: Mesh<PlaneGeometry, ScreenSpaceTextureMaterial>[];
  rt_debug: WebGLRenderTarget;
  scene: Scene;
  
  init()
  {
    this.Vector3_one = new Vector3(1, 1, 1);
    this.Vector3_zero = new Vector3(0, 0, 0);
    this.canvas_renderer = undefined;

    /** @type { Mesh<PlaneGeometry, ScreenSpaceTextureMaterial>[] } */
    this.display_texture_meshes = [];

    this.ctx = undefined;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 1000);
    this.camera.clear_alpha = 0;
  }

  draw_arrow(origin: Vector3, dir: Vector3, color: number | string = 0xff0000)
  {
    const arrow = new Arrow(color, dir.length(), dir.clone().normalize());
    arrow.position.copy(origin);
    this.scene.add(arrow);
    return arrow;
  }

  draw_axis()
  {
    const axis = new AxisHelper();
    this.scene.add(axis);
    return axis;
  }

  set_debug_RT(RT: WebGLRenderTarget)
  {
    this.rt_debug = RT;
  }

  draw_rectangle(position_2d: Vector3 | Vector2, width: number, height: number, color: number | string)
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

  draw_line_2D(from: Vector3 | Vector2, to: Vector3 | Vector2, color: number | string)
  {
    this.ctx.strokeStyle =  color || 'rgba(255, 0, 0, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  draw_line(points: Vector3[], color: number | string = 0xff0000)
  {
    const material = new LineBasicMaterial({
      color: color
    });

    const geometry = new BufferGeometry().setFromPoints(points);

    const line = new Line(geometry, material);
    line.frustumCulled = false;
    this.scene.add(line);
    return line;
  }

  draw_cube(pos: Vector3, size: number, color: number | string)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    const cube = new Cube(new Vector3(size, size, size), undefined, color);
    cube.position.copy(pos);
    this.scene.add(cube);
    return cube;
  }

  draw_oriented_cube(from: Vector3, to: Vector3, height: number = 1, color: number | string = '#FF0000', depth: number = 0.1)
  {
    const size = from.distanceTo(to);
    const cube = new Cube(new Vector3(depth, height, size), undefined, color);

    const center = to.clone().sub(from).multiplyScalar(0.5);
    const forward_dir = center.clone().normalize();
    center.add(from);

    cube.position.copy(center);

    // let up = new Vector3(0, 1, 0);
    // let forward = forward_dir.clone();
    // let right = forward.clone().cross(up);

    // cube.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(right,up,forward));
    cube.quaternion.setFromUnitVectors(new Vector3(0, 0, -1), forward_dir);

    this.scene.add(cube);
    return cube;
  }

  draw_plane(width?: number, height?: number, color?: number | string) 
  {
    const geometry = new PlaneGeometry(width, height);
    const material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Vector4(0, 1, 0, 0.2) }
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true,
      depthWrite: false
    });

    const plane = new Mesh(geometry, material);
    plane.renderOrder = -10000;
    this.scene.add(plane);
    return plane;
  }

  draw_empty_cube(pos: Vector3, size: number, color: number | string)
  {
    size = size || 1;
    color = color || 0xff0000;

    const box = new Box3().setFromCenterAndSize(new Vector3(), new Vector3(size, size, size));
    const helper = new Box3Helper(box, color);
    helper.position.copy(pos || new Vector3());
    return helper;
  }

  draw_sphere(pos: Vector3, size: number, color: number | string)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    const sphere = new Sphere(size, color);
    sphere.position.copy(pos);
    this.scene.add(sphere);
    return sphere;
  }

  draw_point_array(input_points: Vector3[], open: boolean = false, color: number | string = 0xff0000) 
  {
    const catmull = new CatmullRomCurve3(input_points, open);
    catmull.updateArcLengths();
    const points = catmull.getSpacedPoints(200);
    const line_helper = this.draw_line(points, 0x00ff00);
    // line_helper.position.y = 1.5;
    return line_helper;
  }

  draw_sphere_helper(sphere: any, color: number | string)
  {
    color = color || 0xff0000;
    const geometry = new SphereGeometry(sphere.radius, 32, 32);
    const material = new MeshBasicMaterial({ color: color });
    const sphere_mesh = new Mesh(geometry, material);
    sphere_mesh.position.copy(sphere.center);
    SceneManager.current.add(sphere_mesh);
    return sphere_mesh;
  }

  draw_math_sphere(sphere: any)
  {
    const geometry = new SphereGeometry(sphere.radius, 32, 32);
    const material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Vector4(1, 0, 0, 0.2) }
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true
    });
    // var material = new MeshBasicMaterial( {color: 0xff0000, transparent = true} );
    const sphere1 = new Mesh(geometry, material);
    sphere1.position.copy(sphere.center);
    SceneManager.current.add(sphere1);
  }

  draw_bounding_box(bb: Box3)
  {
    const helper = new Box3Helper(bb, 0xffff00);
    SceneManager.current.add(helper);
  }

  draw_curve(curve: Vector3[], options: { offset: number })
  {
    const offset = new Vector3(0, 0, 0);
    if (options)
    {
      offset.y = options.offset || 0;
    }

    for (let i = 0; i < curve.length - 1; i++)
    {
      this.draw_line([curve[i].clone().add(offset), curve[i + 1].clone().add(offset)]);
    }
  }

  draw_texture(tex: Texture, w: number, h: number)
  {
    const mesh = new Mesh(new PlaneGeometry(1, 1), new ScreenSpaceTextureMaterial());
    this.display_texture_meshes.push(mesh);
    this.scene.add(mesh);

    mesh.material.set_texture(tex, w, h);
    return mesh;
  }

  render(graphics: any)
  {
    for (let i = 0; i < this.display_texture_meshes.length; i++)
    {
      this.display_texture_meshes[i].material.set_screen_size(OScreen.width, OScreen.height);
    }
    if (this.scene.children.length > 0)
    {
      graphics.render(this.scene, CameraManager.current);
    }
  }
}

const debug = new Debug();
export { debug as Debug };
