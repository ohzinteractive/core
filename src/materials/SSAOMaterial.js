import { BlitMaterial } from '../materials/BlitMaterial';

import frag from '../shaders/ssao/ssao.frag';
import vert from '../shaders/ssao/ssao.vert';

import { DataTexture, Matrix4, RepeatWrapping, RGBAFormat, Vector3 } from 'three';

import { OMath } from '../utilities/OMath';
class SSAOMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, vert);

    this.uniforms._InverseProjMatrix = { value: new Matrix4() };
    this.uniforms._ProjectionMatrix  = { value: new Matrix4() };

    this.uniforms._Bias     = { value: 0.0125 };
    this.uniforms._Radius   = { value: 0.3 };
    this.uniforms._FarPlane = { value: 100 };

    this.uniforms._SampleKernel = { value: this.__get_sample_kernel() };
    this.uniforms._RandomRotation = { value: this.__get_rotation_kernel() };
  }

  __get_sample_kernel()
  {
    const sample_kernel = [];
    const kernel_size = 64;

    for (let i = 0; i < kernel_size; i++)
    {
      const dir = new Vector3(Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random());
      dir.normalize();
      let scale = i / kernel_size;
      scale   = OMath.lerp(0.1, 1.0, scale * scale);
      dir.multiplyScalar(scale);

      sample_kernel.push(dir);
    }
    return sample_kernel;
  }

  __get_rotation_kernel()
  {
    const rotation_kernel = new Uint8Array(3 * 16);
    for (let i = 0; i < 16; i++)
    {
      rotation_kernel[i * 3 + 1] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 3 + 2] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 3 + 3] = 0;
    }

    const rotation_texture = new DataTexture(rotation_kernel, 4, 4, RGBAFormat);
    rotation_texture.wrapS = RepeatWrapping;
    rotation_texture.wrapT = RepeatWrapping;

    rotation_texture.needsUpdate = true;
    return rotation_texture;
  }
}

export { SSAOMaterial };
