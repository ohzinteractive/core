export type RenderModeFactory = (options: Record<string, unknown>) => unknown;

export interface RenderModeDescriptor
{
  name: string;
  description?: string;
  options?: string[];
  factory: RenderModeFactory;
}

export interface RenderModeSummary
{
  name: string;
  description: string;
  options: string[];
}

// Render modes cannot be constructed from a string, and they do not share a
// constructor signature: UnrealBloomRender takes three required booleans while
// NormalRender takes none. The consumer therefore registers a factory per mode
// carrying that mode's sensible defaults.
class RenderModeRegistry
{
  private descriptors: RenderModeDescriptor[];

  constructor(descriptors: RenderModeDescriptor[])
  {
    this.descriptors = descriptors;
  }

  list(): RenderModeSummary[]
  {
    return this.descriptors.map((descriptor) => ({
      name: descriptor.name,
      description: descriptor.description === undefined ? '' : descriptor.description,
      options: descriptor.options === undefined ? [] : descriptor.options
    }));
  }

  create(name: unknown, options: Record<string, unknown>): unknown
  {
    const wanted = typeof name === 'string' ? name.toLowerCase() : null;
    const descriptor = wanted === null
      ? undefined
      : this.descriptors.find((entry) => entry.name.toLowerCase() === wanted);

    if (descriptor === undefined)
    {
      const available = this.descriptors.map((entry) => entry.name).join(', ');

      throw this.error('unknown_render_mode', `Unknown render mode. Available modes: ${available}.`);
    }

    return descriptor.factory(options);
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { RenderModeRegistry };
