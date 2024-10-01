// @ts-check
import { AxisHelper } from './components/AxisHelper';

import { SceneManager } from './SceneManager';
import { Cube } from './primitives/Cube';
import { Sphere } from './primitives/Sphere';
import { Arrow } from './primitives/Arrow';
import { OScreen } from './OScreen';
import { Graphics } from './Graphics'; // eslint-disable-line no-unused-vars
import { ScreenSpaceTextureMaterial } from './materials/ScreenSpaceTextureMaterial';
import { PerspectiveCamera } from './PerspectiveCamera';

import { RenderTarget, Texture, Vector2, Vector3, WebGLRenderer } from 'three'; // eslint-disable-line no-unused-vars
import { LineBasicMaterial } from 'three';
import { BufferGeometry } from 'three';
import { Line } from 'three';
import { PlaneGeometry } from 'three';
import { ShaderMaterial } from 'three';
import { Vector4 } from 'three';
import { Mesh } from 'three';
import { Box3 } from 'three';
import { Box3Helper } from 'three';
import { Scene } from 'three';
import { CatmullRomCurve3 } from 'three';
import { SphereGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
// @ts-ignore
import basic_color_vert from './shaders/basic_color/basic_color.vert';
// @ts-ignore
import basic_color_frag from './shaders/basic_color/basic_color.frag';
import { CameraManager } from './CameraManager';

class Debug
{
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

  /**
   * @param {Vector3} origin
   * @param {Vector3} dir
   * @param {number | string} color
   * @returns {Arrow}
   */
  draw_arrow(origin, dir, color = 0xff0000)
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

  /**
   * @param {RenderTarget} RT
   */
  set_debug_RT(RT)
  {
    this.rt_debug = RT;
  }

  /**
   * @param {Vector2 | Vector3} position_2d
   * @param {number} width
   * @param {number} height
   * @param {number | string} color
   */
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

  /**
   * @param {Vector3 | Vector2} from
   * @param {Vector3 | Vector2} to
   * @param {number | string} color
   */
  draw_line_2D(from, to, color)
  {
    this.ctx.strokeStyle =  color || 'rgba(255, 0, 0, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  /**
   * @param {Vector3[]} points
   * @param {number | string} color
   * @returns {Line}
   */
  draw_line(points, color = 0xff0000)
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

  /**
   * @param {Vector3} pos
   * @param {number} size
   * @param {number | string} color
   * @returns {Cube}
   */
  draw_cube(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    const cube = new Cube(new Vector3(size, size, size), undefined, color);
    cube.position.copy(pos);
    this.scene.add(cube);
    return cube;
  }

  /**
   * @param {Vector3} from
   * @param {Vector3} to
   * @param {number} height
   * @param {number | string} color
   * @param {number} depth
   * @returns {Cube}
   */
  draw_oriented_cube(from, to, height = 1, color = '#FF0000', depth = 0.1)
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

  /**
   *
   * @param {number} [width]
   * @param {number} [height]
   * @param {number | string} [color]
   * @returns
   */
  draw_plane(width, height, color) // eslint-disable-line no-unused-vars
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

  /**
   * @param {Vector3} pos
   * @param {number} size
   * @param {number | string} color
   * @returns {Box3Helper}
   */
  draw_empty_cube(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;

    const box = new Box3().setFromCenterAndSize(new Vector3(), new Vector3(size, size, size));
    const helper = new Box3Helper(box, color);
    helper.position.copy(pos || new Vector3());
    return helper;
  }

  /**
   * @param {Vector3} pos
   * @param {number} size
   * @param {number | string} color
   * @returns {Sphere}
   */
  draw_sphere(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new Vector3();

    const sphere = new Sphere(size, color);
    sphere.position.copy(pos);
    this.scene.add(sphere);
    return sphere;
  }

  /**
   *
   * @param {Vector3[]} input_points
   * @param {boolean} open
   * @param {number | string} color
   * @returns {Line}
   */
  draw_point_array(input_points, open = false, color = 0xff0000) // eslint-disable-line no-unused-vars
  {
    const catmull = new CatmullRomCurve3(input_points, open);
    catmull.updateArcLengths();
    const points = catmull.getSpacedPoints(200);
    const line_helper = this.draw_line(points, 0x00ff00);
    // line_helper.position.y = 1.5;
    return line_helper;
  }

  /**
   * @param {Sphere} sphere
   * @param {number | string} color
   * @returns {Mesh}
   */
  draw_sphere_helper(sphere, color)
  {
    color = color || 0xff0000;
    const geometry = new SphereGeometry(sphere.radius, 32, 32);
    const material = new MeshBasicMaterial({ color: color });
    const sphere_mesh = new Mesh(geometry, material);
    sphere_mesh.position.copy(sphere.center);
    SceneManager.current.add(sphere_mesh);
    return sphere_mesh;
  }

  /**
   * @param {Sphere} sphere
   */
  draw_math_sphere(sphere)
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

  /**
   * @param {Box3} bb
   */
  draw_bounding_box(bb)
  {
    const helper = new Box3Helper(bb, 0xffff00);
    SceneManager.current.add(helper);
  }

  /**
   * @param {Vector3[]} curve
   * @param {object} options
   * @param {number} options.offset
   */
  draw_curve(curve, options)
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

  /**
   * @param {Texture} tex
   * @param {number} w
   * @param {number} h
   * @returns {Mesh}
   */
  draw_texture(tex, w, h)
  {
    const mesh = new Mesh(new PlaneGeometry(1, 1), new ScreenSpaceTextureMaterial());
    this.display_texture_meshes.push(mesh);
    this.scene.add(mesh);

    mesh.material.set_texture(tex, w, h);
    return mesh;
  }

  /**
   * @param {Graphics} graphics
   */
  render(graphics)
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
