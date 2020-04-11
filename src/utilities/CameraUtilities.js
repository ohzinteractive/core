import CameraManager from '/CameraManager';
import Input from '/Input';
import Sphere from '/primitives/Sphere';
import Arrow from '/primitives/Arrow';
import SceneManager from '/SceneManager';
import MathUtilities from '/utilities/MathUtilities';
import Screen from '/Screen';

class CameraUtilities
{
	constructor()
	{
		this.tmp_mat = new THREE.Matrix4();
		this.tmp_vec = new THREE.Vector3(0,0,1);
		this.tmp_vec2 = new THREE.Vector3(0,0,0);
		this.plane = new THREE.Plane();
		this.ray = new THREE.Ray();

    this.tmp_size = new THREE.Vector3();
    this.tmp_unproj = new THREE.Vector3();
	}

	get_forward_dir(camera)
	{
		this.tmp_vec.set(0,0,1);
		this.tmp_vec.applyQuaternion(camera.quaternion);

		return this.tmp_vec;

	}
	get_right_dir(camera)
	{
		this.tmp_vec.set(1,0,0);
  		this.tmp_vec.applyQuaternion(camera.quaternion);
  		return this.tmp_vec;

	}

	unproject_mouse_position(NDC, camera)
  {
    camera = camera || CameraManager.current;
    let v_fov = (camera.fov/2) * Math.PI/180;
    let h_fov = (2 * Math.atan(Math.tan(v_fov) * camera.aspect))/2;


    let distV = Math.tan(v_fov) * camera.far;
    let distH = Math.tan(h_fov) * camera.far;

    this.tmp_vec.set(distH * NDC.x , distV * NDC.y, -camera.far).normalize();

    return this.tmp_vec.applyQuaternion(camera.quaternion);
  }

  get_plane_intersection(plane_position, plane_normal, NDC, camera)
  {
    camera = camera || CameraManager.current;
    NDC = NDC || Input.normalized_mouse_pos;

		this.plane.setFromNormalAndCoplanarPoint(plane_normal || this.get_forward_dir(camera), plane_position);
    if(camera.isPerspectiveCamera)
    {
      this.ray.set(camera.position, this.unproject_mouse_position(NDC, camera));
    }
    else
    {
      this.tmp_unproj.set(NDC.x, NDC.y, 1).unproject(camera);
      this.ray.set(camera.position, this.tmp_unproj);
    }

    this.ray.intersectPlane(this.plane, this.tmp_vec2);
    return this.tmp_vec2;
  }




  fit_points_on_camera(points, zoom_scale = 1)
  {
    let points_sphere = new THREE.Sphere().setFromPoints(points);
    let world_space_center = points_sphere.center;
    let camera_forward = this.get_forward_dir(CameraManager.current).clone();

    let plane = new THREE.Plane().setFromNormalAndCoplanarPoint(camera_forward, world_space_center);



    let points_on_plane = MathUtilities.project_points_on_plane(points, plane)

    let projected_points_center = new THREE.Vector3();
    let box =  new THREE.Box3().setFromPoints(points_on_plane);
    box.getCenter(projected_points_center);


    let up = new THREE.Vector3(0,1,0).applyQuaternion(CameraManager.current.quaternion)
    let right = up.clone().cross(camera_forward).normalize();
    let mat = new THREE.Matrix4().set(  right.x, up.x, camera_forward.x, world_space_center.x,
                                        right.y, up.y, camera_forward.y, world_space_center.y,
                                        right.z, up.z, camera_forward.z, world_space_center.z,
                                              0,    0,                0,        1);

    let inverse_mat = new THREE.Matrix4().getInverse(mat);
    for(let i=0; i< points_on_plane.length; i++)
    {
      points_on_plane[i].applyMatrix4(inverse_mat);
    }


    let size = new THREE.Vector3();
    box =  new THREE.Box3().setFromPoints(points_on_plane);
    box.getSize(size);
    size.multiplyScalar(zoom_scale);
    let projected_center = new THREE.Vector3();
    box.getCenter(projected_center);


    return {
      position: projected_points_center,
      zoom: this.get_zoom_to_fit_rect(size.x/2, size.y/2)
    }

  }

  get_zoom_to_fit_rect(width,height)
  {
    let v_fov = (CameraManager.current.fov/2) * Math.PI/180;
    let h_fov = (2 * Math.atan(Math.tan(v_fov) * CameraManager.current.aspect))/2;

    let distV = height / Math.tan(v_fov);
    let distH = width / Math.tan(h_fov);

    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  get_zoom_to_fit_box(bb, camera)
  {
    if(camera.isOrthographicCamera)
    {
      bb.getSize(this.tmp_size);

      let obj_x = this.tmp_size.x;
      let obj_y = this.tmp_size.y;
      let object_aspect = obj_x / obj_y;
      if(Screen.aspect_ratio / object_aspect > 1)
      {
        return Screen.height/obj_y;
      }
      else
      {
        return Screen.width/obj_x;
      }
    }
    else
    {
      // return this.fit_points_on_camera([bb.min, bb.max], 1).zoom;
      let size = new THREE.Vector3();
      bb.getSize(size);
      return this.get_zoom_to_fit_rect(size.x, size.y);

    }
  }

  get_html_screen_pos(object, camera)
  {
    object.getWorldPosition(this.tmp_vec);
    this.tmp_vec.project(camera);

    this.tmp_vec.x = (this.tmp_vec.x * 0.5 + 0.5) * (Screen.width);
    this.tmp_vec.y = (1-(this.tmp_vec.y * 0.5 + 0.5)) * Screen.height;
    return this.tmp_vec;
  }

  update_projection(camera)
  {
    camera.left   = -Screen.width/2;
    camera.right  = Screen.width/2;
    camera.top    = Screen.height/2;
    camera.bottom = -Screen.height/2;
    camera.aspect = Screen.aspect_ratio;
    camera.updateProjectionMatrix(true);
  }
}

const camera_utilities = new CameraUtilities();
module.exports = camera_utilities;
