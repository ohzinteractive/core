import AxisHelper from '/components/AxisHelper';
import basic_color_vert from '/shaders/basic_color/basic_color_vert';
import basic_color_frag from '/shaders/basic_color/basic_color_frag';
import SceneManager from '/SceneManager';
import Graphics from '/Graphics';
import Cube from '/primitives/Cube';
import Sphere from '/primitives/Sphere';

class Debug {
  constructor() {
    this.Vector3_one = new THREE.Vector3(1,1,1);
    this.Vector3_zero = new THREE.Vector3(0,0,0);
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
    this.ctx.fillStyle =  color || "rgba(255, 0, 0, 1)";
    this.ctx.fillRect(position_2d.x - width/2,
                      (this.ctx.canvas.height - position_2d.y) - height/2,width,height);

  }

  clear()
  {
    if(this.ctx)
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw_line_2D(from, to, color)
  {
    this.ctx.strokeStyle =  color ||"rgba(255, 0, 0, 1)";
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  draw_line(from, to, color)
  {
    color = color || 0xff0000;
    let mat = new THREE.LineBasicMaterial({ color: color });
    let geo = new THREE.Geometry();
    geo.vertices.push(from);
    geo.vertices.push(to);
    let line = new THREE.Line(geo, mat);
    SceneManager.current.add(line);
    return line;
  }
  draw_cube(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new THREE.Vector3();

    var cube = new Cube(new THREE.Vector3(size, size, size), undefined, color );
    cube.position.copy(pos);
    SceneManager.current.add( cube );
    return cube;
  }
  draw_oriented_cube(from, to, height = 1, color = "#FF0000", depth = 0.1)
  {
  	let size = from.distanceTo(to);
    let cube = new Cube(new THREE.Vector3(depth, height, size), undefined, color );

  	let center = to.clone().sub(from).multiplyScalar(0.5);
		let forward_dir = center.clone().normalize();
		center.add(from);

		cube.position.copy(center);


		let up = new THREE.Vector3(0,1,0);
  	let forward = forward_dir.clone();
  	let right = forward.clone().cross(up);

  	// cube.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,forward));
  	cube.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1), forward_dir);

    SceneManager.current.add( cube );
    return cube;
  }
  draw_plane(width, height, color)
  {
    var geometry = new THREE.PlaneGeometry( width, height );
    let material = new THREE.ShaderMaterial({
      uniforms: {
        _Color: {value : new THREE.Vector4(0,1,0, 0.2)},
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true,
      depthWrite: false
    });

    var plane = new THREE.Mesh( geometry, material );
    plane.renderOrder = -10000
    SceneManager.current.add(plane);
    return plane;
  }
  draw_empty_cube(pos, size,color)
  {
    size = size || 1;
    color = color || 0xff0000;

    let box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(size, size, size));
    let helper = new THREE.Box3Helper( box, color );
    helper.position.copy(pos || new THREE.Vector3());
    return helper;
  }
  draw_sphere(pos, size, color)
  {
    size = size || 1;
    color = color || 0xff0000;
    pos = pos || new THREE.Vector3();

    var sphere = new Sphere(size, color );
    sphere.position.copy(pos);
    SceneManager.current.add( sphere );
    return sphere;
  }
  draw_sphere_helper(sphere, color)
  {
    color = color || 0xff0000;
    var geometry = new THREE.SphereGeometry( sphere.radius, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere_mesh = new THREE.Mesh( geometry, material );
    sphere_mesh.position.copy(sphere.center);
    SceneManager.current.add(sphere_mesh);
    return sphere_mesh;
  }

  draw_math_sphere(sphere)
  {
    var geometry = new THREE.SphereGeometry( sphere.radius, 32, 32 );
    let material = new THREE.ShaderMaterial({
      uniforms: {
        _Color: {value : new THREE.Vector4(1,0,0, 0.2)},
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true
    });
    // var material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent = true} );
    var sphere1 = new THREE.Mesh( geometry, material );
    sphere1.position.copy(sphere.center);
    SceneManager.current.add(sphere1)
  }

  draw_bounding_box(bb)
  {
    var helper = new THREE.Box3Helper( bb, 0xffff00 );
    SceneManager.current.add( helper );
  }

  draw_curve(curve, options)
  {
    let offset = new THREE.Vector3(0,0, 0);
    if(options)
      offset.y = options.offset || 0;

    for(let i=0; i< curve.length-1; i++)
    {
      this.draw_line(curve[i].clone().add(offset), curve[i+1].clone().add(offset));
    }
  }

}

const DEBUG = new Debug();
module.exports = DEBUG;
