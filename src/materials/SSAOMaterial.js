import BlitMaterial from '../materials/BlitMaterial';
import frag from '../shaders/ssao/ssao.frag';
import vert from '../shaders/ssao/ssao.vert';

import * as THREE from 'three';

export default class SSAOMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, vert);

    this.uniforms._InverseProjMatrix = { value: new THREE.Matrix4() };
    this.uniforms._ProjectionMatrix  = { value: new THREE.Matrix4() };

    this.uniforms._Bias     = { value: 0.0125 };
    this.uniforms._Radius   = { value: 0.3 };
    this.uniforms._FarPlane = { value: 100 };

    this.uniforms._SampleKernel = { value: this.__get_sample_kernel() };
    this.uniforms._RandomRotation = { value: this.__get_rotation_kernel() };
  }

  __get_sample_kernel()
  {
    let sample_kernel = [];
    let kernel_size = 64;

    for (let i = 0; i < kernel_size; i++)
    {
      let dir = new THREE.Vector3(Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random());
      dir.normalize();
      let scale = i / kernel_size;
      scale   = THREE.Math.lerp(0.1, 1.0, scale * scale);
      dir.multiplyScalar(scale);

      sample_kernel.push(dir);
    }
    return sample_kernel;
  }

  __get_rotation_kernel()
  {
    let rotation_kernel = new Uint8Array(3 * 16);
    for (let i = 0; i < 16; i++)
    {
      rotation_kernel[i * 3 + 1] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 3 + 2] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 3 + 3] = 0;
    }

    let rotation_texture = new THREE.DataTexture(rotation_kernel, 4, 4, THREE.RGBFormat);
    rotation_texture.wrapS = THREE.RepeatWrapping;
    rotation_texture.wrapT = THREE.RepeatWrapping;

    rotation_texture.needsUpdate = true;
    return rotation_texture;
  }
}
