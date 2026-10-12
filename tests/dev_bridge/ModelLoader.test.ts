import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Scene } from 'three';
import { ModelLoader } from '../../src/dev_bridge/ModelLoader';

function box_model()
{
  const root = new Group();
  root.add(new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial()));

  return { scene: root };
}

function harness(gltf: unknown = box_model())
{
  const urls: string[] = [];
  const stored: Array<{ name: string; url: string; resource: unknown }> = [];
  const loader = new ModelLoader(
    async(url, draco) =>
    {
      urls.push(`${url}|${draco}`);
      if (gltf instanceof Error) { throw gltf; }
      return gltf as { scene: Group };
    },
    { replace_resource: (name, url, resource) => { stored.push({ name, url, resource }); } }
  );

  return { loader, urls, stored, scene: new Scene() };
}

describe('ModelLoader', () =>
{
  it('loads, registers, names and adds the model, and summarizes it', async() =>
  {
    const gltf = box_model();
    const { loader, stored, scene } = harness(gltf);

    const summary = await loader.load(scene, { name: 'chair', url: '/models/chair.glb' });

    expect(stored).toEqual([{ name: 'chair', url: '/models/chair.glb', resource: gltf }]);
    expect(gltf.scene.name).toBe('chair');
    expect(scene.children).toContain(gltf.scene);
    expect(summary).toEqual({ name: 'chair', meshes: 1, triangles: 12, bounding_box: { min: [-1, -1, -1], max: [1, 1, 1] } });
  });

  it('adds the version to the fetched url and passes draco through', async() =>
  {
    const { loader, urls, stored, scene } = harness();

    await loader.load(scene, { name: 'chair', url: '/models/chair.glb', draco: true, version: 'abc123' });

    expect(urls).toEqual(['/models/chair.glb?v=abc123|true']);
    expect(stored[0].url).toBe('/models/chair.glb');
  });

  it('replaces a direct child of the same name and disposes of it', async() =>
  {
    const { loader, scene } = harness();
    const old_mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
    old_mesh.name = 'chair';
    scene.add(old_mesh);
    let disposed = 0;
    old_mesh.geometry.addEventListener('dispose', () => { disposed++; });
    (old_mesh.material as MeshBasicMaterial).addEventListener('dispose', () => { disposed++; });

    await loader.load(scene, { name: 'chair', url: '/models/chair.glb' });

    expect(scene.children.filter((child) => child.name === 'chair')).toHaveLength(1);
    expect(scene.children).not.toContain(old_mesh);
    expect(disposed).toBe(2);
  });

  it('reports load_failed with the url when the load throws', async() =>
  {
    const { loader, scene } = harness(new Error('HTTP 404'));

    await expect(loader.load(scene, { name: 'chair', url: '/models/chair.glb' })).rejects.toMatchObject({ code: 'load_failed', message: expect.stringContaining('/models/chair.glb: HTTP 404') });
  });

  it('reports load_failed for a result without a scene', async() =>
  {
    const { loader, scene } = harness({});

    await expect(loader.load(scene, { name: 'chair', url: '/models/chair.glb' })).rejects.toMatchObject({ code: 'load_failed' });
  });

  it('rejects a request without a name or url, or without a scene', async() =>
  {
    const { loader, scene } = harness();

    await expect(loader.load(scene, { url: '/x.glb' })).rejects.toMatchObject({ code: 'bad_request' });
    await expect(loader.load(scene, { name: 'x' })).rejects.toMatchObject({ code: 'bad_request' });
    await expect(loader.load(undefined as never, { name: 'x', url: '/x.glb' })).rejects.toMatchObject({ code: 'not_found' });
  });

  it('reports an empty model with null bounds', async() =>
  {
    const { loader, scene } = harness({ scene: new Group() });

    expect(await loader.load(scene, { name: 'empty', url: '/e.glb' })).toEqual({ name: 'empty', meshes: 0, triangles: 0, bounding_box: null });
  });
});
