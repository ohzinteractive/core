import { beforeEach, describe, expect, it } from 'vitest';

import { Box3, Box3Helper, type Mesh, type MeshBasicMaterial, type SphereGeometry, Sphere as MathSphere, Vector3 } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { Debug } from '../../src/Debug';
import { OScreen } from '../../src/OScreen';
import { SceneManager } from '../../src/SceneManager';

function see_through_material_of(mesh: Mesh): MeshBasicNodeMaterial
{
  const material = mesh.material as MeshBasicNodeMaterial;

  expect(material).toBeInstanceOf(MeshBasicNodeMaterial);
  expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
  expect(material.opacity).toBe(0.2);
  expect(material.transparent).toBe(true);
  expect(material.depthWrite).toBe(false);

  return material;
}

describe('Debug', () =>
{
  beforeEach(() =>
  {
    OScreen.init();
    SceneManager.init();
    Debug.init();
  });

  describe('draw_plane', () =>
  {
    it('adds a see-through node material plane in the given color, behind everything else', () =>
    {
      const plane = Debug.draw_plane(4, 2, 0x0000ff);

      expect(see_through_material_of(plane).color.getHex()).toBe(0x0000ff);
      expect(plane.renderOrder).toBe(-10000);
      expect(Debug.scene.children).toContain(plane);
    });

    it('is green when no color is given', () =>
    {
      const plane = Debug.draw_plane(4, 2);

      expect(see_through_material_of(plane).color.getHex()).toBe(0x00ff00);
    });
  });

  describe('draw_cube and draw_sphere colors', () =>
  {
    it('honors black', () =>
    {
      const cube = Debug.draw_cube(undefined, 1, 0);
      const sphere = Debug.draw_sphere(new Vector3(), 1, 0);

      expect((cube.material as MeshBasicMaterial).color.getHex()).toBe(0x000000);
      expect((sphere.material as MeshBasicMaterial).color.getHex()).toBe(0x000000);
    });

    it('is red when no color is given', () =>
    {
      const cube = Debug.draw_cube();
      const sphere = Debug.draw_sphere(new Vector3(), 1, undefined);

      expect((cube.material as MeshBasicMaterial).color.getHex()).toBe(0xff0000);
      expect((sphere.material as MeshBasicMaterial).color.getHex()).toBe(0xff0000);
    });
  });

  describe('draw_empty_cube and draw_sphere_helper colors', () =>
  {
    it('honors black', () =>
    {
      const cube = Debug.draw_empty_cube(new Vector3(), 1, 0);
      const sphere = Debug.draw_sphere_helper(new MathSphere(new Vector3(), 1), 0);

      expect((cube.material as MeshBasicMaterial).color.getHex()).toBe(0x000000);
      expect((sphere.material as MeshBasicMaterial).color.getHex()).toBe(0x000000);
    });

    it('is red when no color is given', () =>
    {
      const cube = Debug.draw_empty_cube(new Vector3(), 1, undefined as unknown as number);
      const sphere = Debug.draw_sphere_helper(new MathSphere(new Vector3(), 1), undefined as unknown as number);

      expect((cube.material as MeshBasicMaterial).color.getHex()).toBe(0xff0000);
      expect((sphere.material as MeshBasicMaterial).color.getHex()).toBe(0xff0000);
    });
  });

  describe('draw_math_sphere', () =>
  {
    it('adds a see-through red sphere to the current scene, not the debug scene', () =>
    {
      Debug.draw_math_sphere(new MathSphere(new Vector3(1, 2, 3), 5));

      const sphere = SceneManager.current.children[0] as Mesh<SphereGeometry>;

      expect(see_through_material_of(sphere).color.getHex()).toBe(0xff0000);
      expect(sphere.position).toEqual(new Vector3(1, 2, 3));
      expect(sphere.geometry.parameters.radius).toBe(5);
      expect(Debug.scene.children).toEqual([]);
    });

    it('returns the mesh it adds', () =>
    {
      const sphere = Debug.draw_math_sphere(new MathSphere(new Vector3(), 1));

      expect(SceneManager.current.children).toEqual([sphere]);
    });

    it('honors a color argument and stays see-through', () =>
    {
      const sphere = Debug.draw_math_sphere(new MathSphere(new Vector3(), 1), 0x0000ff);

      expect(see_through_material_of(sphere).color.getHex()).toBe(0x0000ff);
    });
  });

  describe('draw_bounding_box', () =>
  {
    const box = new Box3(new Vector3(-1, -1, -1), new Vector3(1, 1, 1));

    it('adds a yellow Box3Helper to the current scene and returns it', () =>
    {
      const helper = Debug.draw_bounding_box(box);

      expect(helper).toBeInstanceOf(Box3Helper);
      expect(helper.box).toBe(box);
      expect(helper.material.color.getHex()).toBe(0xffff00);
      expect(SceneManager.current.children).toEqual([helper]);
      expect(Debug.scene.children).toEqual([]);
    });

    it('honors a color argument', () =>
    {
      const helper = Debug.draw_bounding_box(box, 0x00ffff);

      expect(helper.material.color.getHex()).toBe(0x00ffff);
    });
  });
});
