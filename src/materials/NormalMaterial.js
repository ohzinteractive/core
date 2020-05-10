import frag from '/shaders/normal/normal.frag';
import vert from '/shaders/normal/normal.vert';

export default class NormalMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
            },
            vertexShader: vert,
            fragmentShader: frag
        });

    }

}
