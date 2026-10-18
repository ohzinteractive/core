import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_component } from '../../tasks/create_component/create_component.mjs';
// @ts-expect-error plain .mjs scaffolder script
import { plan_scene } from '../../tasks/create_scene/create_scene.mjs';
// @ts-expect-error plain .mjs scaffolder script
import { plan_view } from '../../tasks/create_view/create_view.mjs';

let root: string;

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-names-')); });
afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

// Every name becomes a class name and an identifier, so one that starts with a
// digit would generate code that does not compile.
describe.each([
  ['view', plan_view],
  ['scene', plan_scene],
  ['component', plan_component]
])('create_%s names', (kind, plan) =>
{
  it('refuses a name that starts with a digit', () =>
  {
    expect(() => plan('2fa', { root })).toThrowError(new RegExp(`A ${kind} name must start with a letter: 2fa`));
  });

  it('refuses a name that starts with an underscore', () =>
  {
    expect(() => plan('_draft', { root })).toThrowError(/must start with a letter/);
  });
});
