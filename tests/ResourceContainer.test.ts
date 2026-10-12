import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceContainer } from '../src/ResourceContainer';

describe('ResourceContainer.replace_resource', () =>
{
  beforeEach(() => { ResourceContainer.init(); });

  it('overwrites a resource already stored under the same url', () =>
  {
    const old_model = { id: 'old' };
    const new_model = { id: 'new' };

    ResourceContainer.set_resource('chair', '/models/chair.glb', old_model);
    ResourceContainer.replace_resource('chair', '/models/chair.glb', new_model);

    expect(ResourceContainer.get('chair')).toBe(new_model);
    expect(ResourceContainer.resources_by_url['/models/chair.glb']).toBe(new_model);
  });

  it('leaves set_resource deduplicating by url, now to the replacement', () =>
  {
    const new_model = { id: 'new' };

    ResourceContainer.set_resource('chair', '/models/chair.glb', { id: 'old' });
    ResourceContainer.replace_resource('chair', '/models/chair.glb', new_model);
    ResourceContainer.set_resource('stool', '/models/chair.glb', { id: 'ignored' });

    expect(ResourceContainer.get('stool')).toBe(new_model);
  });

  it('stores a resource that was never there', () =>
  {
    const model = { id: 'm' };

    ResourceContainer.replace_resource('tree', '/models/tree.glb', model);

    expect(ResourceContainer.get('tree')).toBe(model);
  });
});
