import { describe, expect, it } from 'vitest';
import { ResourceContainer } from '../../src/ResourceContainer';
import type { AbstractLoader } from '../../src/resource_loader/AbstractLoader';
import { ResourceBatch } from '../../src/resource_loader/ResourceBatch';

function recording_loader(): { loader: AbstractLoader, received: unknown[] }
{
  const received: unknown[] = [];
  const loader = { load: (resource_container: unknown) => { received.push(resource_container); } };

  return { loader: loader as unknown as AbstractLoader, received };
}

describe('ResourceBatch.load', () =>
{
  it('loads into the ResourceContainer singleton when given no container', () =>
  {
    const { loader, received } = recording_loader();
    const batch = new ResourceBatch('general_loader');

    batch.add_loader(loader);
    batch.load();

    expect(received.length).toBe(1);
    expect(received[0]).toBe(ResourceContainer);
  });

  it('loads into the container it is given', () =>
  {
    const { loader, received } = recording_loader();
    const batch = new ResourceBatch('worker_loader');
    const container = { resources_by_url: {}, set_resource: () => {} };

    batch.add_loader(loader);
    batch.load(container as never);

    expect(received[0]).toBe(container);
  });
});
