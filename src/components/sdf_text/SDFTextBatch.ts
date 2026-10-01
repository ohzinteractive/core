import { SDFTextMaterial } from '../../materials/SDFTextMaterial';
import { ArrayUtilities } from '../../utilities/ArrayUtilities';
import { SDFText } from './SDFText';

import {
  DynamicDrawUsage,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute,
  Mesh,
  PlaneGeometry,
  Vector2
} from 'three';

// The per glyph attributes, four floats each, in the order they sit in an instance.
const GLYPH_ATTRIBUTES = ['transformsCol0', 'transformsCol1', 'transformsCol2', 'transformsCol3', 'glyph_bounds', 'plane_bounds', 'color'];

class SDFTextBatch extends Mesh
{
  font_layout: any;
  max_allocations: number;
  text_elements: SDFText[];
  material: SDFTextMaterial;
  geometry: InstancedBufferGeometry;

  constructor(font_layout: any, atlas_texture: any)
  {
    const max_allocations = 2000;

    const instanced_geometry = new InstancedBufferGeometry();
    instanced_geometry.instanceCount = 0;

    const geometry = new PlaneGeometry(1, 1);
    geometry.translate(0.5, 0.5, 0);
    instanced_geometry.setAttribute('position',  new Float32BufferAttribute(geometry.getAttribute('position').array, 3));
    instanced_geometry.setAttribute('uv',        new Float32BufferAttribute(geometry.getAttribute('uv').array, 2));
    instanced_geometry.index = geometry.index;

    // One interleaved buffer holds every per glyph attribute. WebGPU allows 8 vertex
    // buffers per pipeline, and one buffer per attribute would take 9 with position
    // and uv.
    const glyphs = new InstancedInterleavedBuffer(new Float32Array(max_allocations * GLYPH_ATTRIBUTES.length * 4), GLYPH_ATTRIBUTES.length * 4);
    glyphs.setUsage(DynamicDrawUsage);

    GLYPH_ATTRIBUTES.forEach((name, i) =>
    {
      instanced_geometry.setAttribute(name, new InterleavedBufferAttribute(glyphs, 4, i * 4));
    });

    super(instanced_geometry, new SDFTextMaterial(atlas_texture));

    this.text_elements = [];
    this.font_layout = font_layout;

    this.material.set_atlas_size(new Vector2(font_layout.atlas.width, font_layout.atlas.height));

    this.frustumCulled = false;
  }

  set_boldness(value: number)
  {
    this.material.set_boldness(value);
  }

  add_text(text_str: string): SDFText
  {
    const elem = new SDFText(this.font_layout.glyphs, text_str);
    this.text_elements.push(elem);
    return elem;
  }

  remove_text(text_elem: SDFText)
  {
    ArrayUtilities.remove_elem(this.text_elements, text_elem);
    this.update(true);
  }

  update(force_update: boolean)
  {
    const glyph_bounds_atr = this.geometry.getAttribute('glyph_bounds');
    const plane_bounds_atr = this.geometry.getAttribute('plane_bounds');

    const transformsCol0 = this.geometry.getAttribute('transformsCol0');
    const transformsCol1 = this.geometry.getAttribute('transformsCol1');
    const transformsCol2 = this.geometry.getAttribute('transformsCol2');
    const transformsCol3 = this.geometry.getAttribute('transformsCol3');

    const color_atr = this.geometry.getAttribute('color');

    let matrix_needs_update = force_update === true;
    let glyph_needs_update  = force_update === true;
    let color_needs_update  = force_update === true;

    let glyph_count = 0;
    for (let i = 0; i < this.text_elements.length; i++)
    {
      const text = this.text_elements[i];

      if (text.matrix_is_dirty)
      {
        matrix_needs_update = true;
        text.update_matrix();
      }

      if (text.glyph_is_dirty)
      {
        glyph_needs_update = true;
        text.clear_glyph_dirty();
      }

      if (text.color_is_dirty)
      {
        color_needs_update = true;
        text.clear_color_dirty();
      }

      const matrix = text.matrix;
      const color = text.color;
      const opacity = text.opacity;

      for (let glyph_i = 0; glyph_i < text.glyphs.length; glyph_i++)
      {
        const glyph = text.glyphs[glyph_i];

        const buffer_i = glyph_count;

        glyph_bounds_atr.setXYZW(buffer_i, glyph.atlas_bounds.x, glyph.atlas_bounds.y, glyph.atlas_bounds.z, glyph.atlas_bounds.w);
        plane_bounds_atr.setXYZW(buffer_i, glyph.position.x, glyph.position.y, glyph.scale.x, glyph.scale.y);

        transformsCol0.setXYZW(buffer_i, matrix.elements[0],
          matrix.elements[1],
          matrix.elements[2],
          matrix.elements[3]);

        transformsCol1.setXYZW(buffer_i, matrix.elements[4],
          matrix.elements[5],
          matrix.elements[6],
          matrix.elements[7]);

        transformsCol2.setXYZW(buffer_i, matrix.elements[8],
          matrix.elements[9],
          matrix.elements[10],
          matrix.elements[11]);

        transformsCol3.setXYZW(buffer_i, matrix.elements[12],
          matrix.elements[13],
          matrix.elements[14],
          matrix.elements[15]);

        color_atr.setXYZW(buffer_i, color.r, color.g, color.b, opacity);

        glyph_count++;
      }
    }

    this.geometry.instanceCount = glyph_count;

    if (glyph_count > this.max_allocations)
    {
      console.error('SDFTextBatch exceeded maximum glyph allocations(max/current): ', this.max_allocations, glyph_count, this);
    }

    if (matrix_needs_update)
    {
      transformsCol0.needsUpdate = true;
      transformsCol1.needsUpdate = true;
      transformsCol2.needsUpdate = true;
      transformsCol3.needsUpdate = true;
    }
    if (glyph_needs_update)
    {
      glyph_bounds_atr.needsUpdate = true;
      plane_bounds_atr.needsUpdate = true;
    }
    if (color_needs_update)
    {
      color_atr.needsUpdate = true;
    }
  }

  dispose()
  {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export { SDFTextBatch };
