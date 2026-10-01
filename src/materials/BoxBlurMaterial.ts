import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';

import { Vector2 } from 'three';
import { uniform, vec2 } from 'three/tsl';

const DISTANCE = 2;
const TAPS: Array<[number, number]> = [
  [-4, 0.0525], [-3, 0.075], [-2, 0.110], [-1, 0.150],
  [0, 0.225],
  [1, 0.150], [2, 0.110], [3, 0.075], [4, 0.0525]
];

// One separable pass of a 9 tap blur along _SampleDir.
class BoxBlurMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    const sample_dir = uniform(new Vector2());
    this.uniforms._SampleDir = sample_dir;

    const resolution = this.uniforms._Resolution as typeof sample_dir;
    const dir = sample_dir.mul(vec2(0.5).div(resolution));

    const taps = TAPS.map(([step, weight]) =>
    {
      const tap = step === 0 ? this.sample_main_tex() : this.sample_main_tex(dir.mul(step * DISTANCE));
      return tap.mul(weight);
    });

    this.fragmentNode = taps.reduce((sum, tap) => sum.add(tap));
  }
}

export { BoxBlurMaterial };
