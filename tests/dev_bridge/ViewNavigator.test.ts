import { describe, expect, it } from 'vitest';
import { ViewNavigator } from '../../src/dev_bridge/ViewNavigator';

function manager(current = 'home')
{
  return {
    views: [
      { name: 'home', url: '/' },
      { name: 'transition', url: '/transition' }
    ],
    visited: [] as unknown[],
    get_current_view() { return { name: current }; },
    go_to_view(name: string, change_url?: boolean, skip?: boolean)
    {
      this.visited.push({ name, change_url, skip });
      current = name;
    }
  };
}

const navigator = new ViewNavigator();

describe('ViewNavigator list', () =>
{
  it('lists the registered views and marks the current one', () =>
  {
    const result = navigator.list(manager());

    expect(result.current).toBe('home');
    expect(result.views).toEqual([
      { name: 'home', url: '/', current: true },
      { name: 'transition', url: '/transition', current: false }
    ]);
  });

  it('reports a null current view when none is active', () =>
  {
    const vm = manager();
    vm.get_current_view = () => undefined as never;

    expect(navigator.list(vm).current).toBeNull();
  });
});

describe('ViewNavigator go', () =>
{
  it('navigates and reports the new current view', () =>
  {
    const vm = manager();
    const result = navigator.go(vm, { name: 'transition' });

    expect(vm.visited).toEqual([{ name: 'transition', change_url: true, skip: false }]);
    expect(result.current).toBe('transition');
    expect(result.requested).toBe('transition');
  });

  it('forwards change_url and skip', () =>
  {
    const vm = manager();
    navigator.go(vm, { name: 'transition', change_url: false, skip: true });

    expect(vm.visited).toEqual([{ name: 'transition', change_url: false, skip: true }]);
  });

  it('refuses an unknown view before ViewManager dereferences undefined', () =>
  {
    const vm = manager();
    let caught: unknown;

    try
    {
      navigator.go(vm, { name: 'ghost' });
    }
    catch (error)
    {
      caught = error;
    }

    expect(caught).toMatchObject({ code: 'not_found' });
    expect((caught as Error).message).toContain('home');
    expect(vm.visited).toEqual([]);
  });

  it('requires a name', () =>
  {
    expect(() => navigator.go(manager(), {})).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });
});
