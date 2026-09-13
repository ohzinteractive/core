export interface ViewSummary
{
  name: string;
  url: string;
  current: boolean;
}

export interface ViewManagerLike
{
  views: Array<{ name?: unknown; url?: unknown }>;
  get_current_view(): { name?: unknown } | undefined;
  go_to_view(name: string, change_url?: boolean, skip?: boolean): void;
}

export interface NavigateRequest
{
  name?: unknown;
  change_url?: unknown;
  skip?: unknown;
}

export interface NavigateResult
{
  requested: string;
  current: string | null;
  change_url: boolean;
  skip: boolean;
}

// ViewManager.get() returns undefined for an unknown name and go_to_view then
// dereferences v.url, so the name is validated here before it can throw.
class ViewNavigator
{
  list(manager: ViewManagerLike): { current: string | null; views: ViewSummary[] }
  {
    const current = this.current(manager);

    return {
      current,
      views: this.names(manager).map((view) => ({
        name: view.name,
        url: view.url,
        current: view.name === current
      }))
    };
  }

  go(manager: ViewManagerLike, request: NavigateRequest): NavigateResult
  {
    const name = typeof request.name === 'string' ? request.name : null;
    const available = this.names(manager);

    if (name === null || !available.some((view) => view.name === name))
    {
      const listed = available.map((view) => view.name).join(', ');

      throw this.error('not_found', `Unknown view. Available views: ${listed}.`);
    }

    const change_url = request.change_url === undefined ? true : request.change_url === true;
    const skip = request.skip === true;

    manager.go_to_view(name, change_url, skip);

    return { requested: name, current: this.current(manager), change_url, skip };
  }

  private names(manager: ViewManagerLike): Array<{ name: string; url: string }>
  {
    const views = Array.isArray(manager.views) ? manager.views : [];

    return views
      .filter((view) => typeof view.name === 'string')
      .map((view) => ({
        name: view.name as string,
        url: typeof view.url === 'string' ? view.url : ''
      }));
  }

  private current(manager: ViewManagerLike): string | null
  {
    const view = manager.get_current_view();

    if (typeof view !== 'object' || view === null || typeof view.name !== 'string')
    {
      return null;
    }

    return view.name;
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { ViewNavigator };
