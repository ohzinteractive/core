class Capabilities
{
  fp_textures_available: boolean;
  max_anisotropy: number;
  vertex_texture_sampler_available: boolean;
  init()
  {
    this.max_anisotropy = 0;
    this.vertex_texture_sampler_available = false;
    this.fp_textures_available = false;
  }
}

const capabilities = new Capabilities();
export { capabilities as Capabilities };
