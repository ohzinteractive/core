class Capabilities
{
  fp_textures_available: any;
  max_anisotropy: any;
  vertex_texture_sampler_available: any;
  init()
  {
    this.max_anisotropy = 0;
    this.vertex_texture_sampler_available = false;
    this.fp_textures_available = false;
  }
}

const capabilities = new Capabilities();
export { capabilities as Capabilities };
