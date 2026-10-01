import { BlitNodeMaterial } from './BlitNodeMaterial';

import { Color } from 'three';
import { dot, mix, smoothstep, uniform, vec3, vec4 } from 'three/tsl';

const LUMA = vec3(0.299, 0.587, 0.114);

// Keeps the pixels of _MainTex brighter than luminosityThreshold and replaces the rest
// with defaultColor, fading across smoothWidth.
class LuminosityHighPassMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    const luminosity_threshold = uniform(0.23);
    const smooth_width = uniform(0.01);
    const default_color = uniform(new Color('#000000'));
    const default_opacity = uniform(0);

    this.uniforms.luminosityThreshold = luminosity_threshold;
    this.uniforms.smoothWidth = smooth_width;
    this.uniforms.defaultColor = default_color;
    this.uniforms.defaultOpacity = default_opacity;

    const texel = this.sample_main_tex();
    const luminance = dot(texel.rgb, LUMA);
    const alpha = smoothstep(luminosity_threshold, luminosity_threshold.add(smooth_width), luminance);

    this.fragmentNode = mix(vec4(default_color, default_opacity), texel, alpha);
  }

  set_threshold(value_01: number)
  {
    this.uniforms.luminosityThreshold.value = value_01;
  }
}

export { LuminosityHighPassMaterial };
