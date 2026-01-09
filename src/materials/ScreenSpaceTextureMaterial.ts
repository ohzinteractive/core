import { Vector2 } from 'three';
import { BaseShaderMaterial } from './BaseShaderMaterial';
class ScreenSpaceTextureMaterial extends BaseShaderMaterial
{
  constructor()
  {
    const vert = `
      uniform vec2 _ScreenSpacePosition;
      uniform vec2 _ScreenSize;
      uniform vec2 _TextureSize;
      varying vec2 vUv;
      void main()
      {
        vec2 pos = uv * vec2(_TextureSize.x / _ScreenSize.x, _TextureSize.y / _ScreenSize.y);
        pos += vec2(_ScreenSpacePosition.x / _ScreenSize.x, _ScreenSpacePosition.y / _ScreenSize.y);

        pos.x = pos.x * 2.0 - 1.0;
        pos.y = pos.y * 2.0 - 1.0;

        gl_Position = vec4(pos, 0.0, 1.0);
        vUv = uv;
      }
    `;
    const frag = `
      uniform sampler2D _MainTex;
      varying vec2 vUv;

      void main()
      {
        gl_FragColor = texture2D(_MainTex, vUv);
      }
    `;
    super(vert, frag, {
      _MainTex: { value: undefined },
      _ScreenSpacePosition: { value: new Vector2() },
      _ScreenSize: { value: new Vector2() },
      _TextureSize: { value: new Vector2() }
    });
  }

  set_position(x: any, y: any)
  {
    this.uniforms._ScreenSpacePosition.value.set(x, y);
  }

  set_texture(tex: any, w: any, h: any)
  {
    this.uniforms._MainTex.value = tex;
    this.uniforms._TextureSize.value.set(tex.image.width, tex.image.height);

    if (w !== undefined)
    {
      this.uniforms._TextureSize.value.x = w;
    }
    if (h !== undefined)
    {
      this.uniforms._TextureSize.value.y = h;
    }
  }

  set_screen_size(w: any, h: any)
  {
    this.uniforms._ScreenSize.value.set(w, h);
  }
}

export { ScreenSpaceTextureMaterial };
