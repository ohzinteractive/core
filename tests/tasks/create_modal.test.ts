import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_modal } from '../../tasks/create_modal/create_modal.mjs';

let root: string;

const MODAL_COMPONENT = [
  '// __MODAL_STATES_IMPORTS__',
  "import { AbstractModalComponent } from 'ohzi-components';",
  '',
  'class ModalComponent extends AbstractModalComponent',
  '{',
  '  start()',
  '  {',
  '    this.states = {',
  '      // __MODAL_STATES__',
  '    };',
  '  }',
  '}',
  ''
].join('\n');

const FIXTURE: Record<string, string> = {
  'app/css/application.scss': "@import 'components/modal/modal';\n\n// __MODAL_STATES__\n",
  'app/views/components/modal/modal.pug': '.component.modal.hidden\n  .modal__animation\n    //- __MODAL_STATES__\n',
  'app/js/view_components/modal/ModalComponent.ts': MODAL_COMPONENT
};

function write(relative: string, contents: string)
{
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
}

const read = (r: string) => fs.readFileSync(path.join(root, r), 'utf8');
const exists = (r: string) => fs.existsSync(path.join(root, r));

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-modal-'));

  for (const [relative, contents] of Object.entries(FIXTURE))
  {
    write(relative, contents);
  }
});

afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

describe('create_modal', () =>
{
  it('creates the state class, template and styles', () =>
  {
    const report = plan_modal('privacy_policy', { root }).run();

    expect(report.applied).toBe(true);
    expect(report.created).toEqual([
      'app/js/view_components/modal/states/PrivacyPolicyModalState.ts',
      'app/views/components/modal/states/privacy_policy.pug',
      'app/css/components/modal/privacy_policy/_privacy_policy.scss'
    ]);
  });

  it('renders the templates with the modal name', () =>
  {
    plan_modal('privacy_policy', { root }).run();

    const state = read('app/js/view_components/modal/states/PrivacyPolicyModalState.ts');

    expect(state).toContain('class PrivacyPolicyModalState extends ModalState');
    expect(state).toContain('export { PrivacyPolicyModalState };');
    expect(state).not.toMatch(/template/i);
    expect(read('app/views/components/modal/states/privacy_policy.pug')).toContain("+modal({ classes: 'privacy-policy-modal' })");
    expect(read('app/css/components/modal/privacy_policy/_privacy_policy.scss')).toContain('.privacy-policy-modal');
  });

  it('keeps the modal class apart from the class of a view with the same name', () =>
  {
    plan_modal('privacy_policy', { root }).run();

    const pug = read('app/views/components/modal/states/privacy_policy.pug');
    const scss = read('app/css/components/modal/privacy_policy/_privacy_policy.scss');

    // A view named privacy_policy owns `.privacy-policy`: sharing it would hand the
    // modal the view's styles, such as a pointer-events: none that kills its buttons.
    expect(pug).not.toMatch(/classes: 'privacy-policy'/);
    expect(scss).not.toMatch(/^\.privacy-policy \{/m);
  });

  it('wires the state into the modal component, its template and the styles', () =>
  {
    plan_modal('privacy_policy', { root }).run();

    const component = read('app/js/view_components/modal/ModalComponent.ts');

    expect(component).toContain("import { PrivacyPolicyModalState } from './states/PrivacyPolicyModalState';");
    expect(component).toContain("      privacy_policy: new PrivacyPolicyModalState('privacy-policy-modal'),");
    expect(read('app/views/components/modal/modal.pug')).toContain('    //- __MODAL_STATES__\n    include states/privacy_policy');
    expect(read('app/css/application.scss')).toContain("@import 'components/modal/privacy_policy/privacy_policy';");
  });

  it('sanitizes the name', () =>
  {
    const report = plan_modal('Privacy-Policy', { root }).run();

    expect(report.applied).toBe(true);
    expect(exists('app/js/view_components/modal/states/PrivacyPolicyModalState.ts')).toBe(true);
  });

  it('requires a name', () =>
  {
    expect(() => plan_modal('', { root })).toThrowError(/A modal name is required/);
  });

  it('refuses a second run and changes nothing', () =>
  {
    plan_modal('privacy_policy', { root }).run();

    const before = read('app/js/view_components/modal/ModalComponent.ts');
    const second = plan_modal('privacy_policy', { root }).run();

    expect(second.applied).toBe(false);
    expect(read('app/js/view_components/modal/ModalComponent.ts')).toBe(before);
  });

  it('allows a second, different modal', () =>
  {
    plan_modal('privacy_policy', { root }).run();

    expect(plan_modal('cookies', { root }).run().applied).toBe(true);

    const component = read('app/js/view_components/modal/ModalComponent.ts');

    expect(component).toContain("privacy_policy: new PrivacyPolicyModalState('privacy-policy-modal'),");
    expect(component).toContain("cookies: new CookiesModalState('cookies-modal'),");
  });

  it('allows a modal whose name prefixes an existing one', () =>
  {
    plan_modal('terms_of_use', { root }).run();

    const report = plan_modal('terms', { root }).run();

    expect(report.errors).toEqual([]);
    expect(read('app/views/components/modal/modal.pug')).toBe(
      '.component.modal.hidden\n  .modal__animation\n    //- __MODAL_STATES__\n    include states/terms\n    include states/terms_of_use\n'
    );
  });

  it('refuses when an anchor is missing rather than half wiring', () =>
  {
    write('app/views/components/modal/modal.pug', '.component.modal.hidden\n');

    const report = plan_modal('privacy_policy', { root }).run();

    expect(report.applied).toBe(false);
    expect(exists('app/js/view_components/modal/states/PrivacyPolicyModalState.ts')).toBe(false);
    expect(read('app/js/view_components/modal/ModalComponent.ts')).toBe(MODAL_COMPONENT);
  });

  it('dry run writes nothing', () =>
  {
    const report = plan_modal('privacy_policy', { root, dry_run: true }).run();

    expect(report.errors).toHaveLength(0);
    expect(report.created).toHaveLength(3);
    expect(report.patched).toHaveLength(4);
    expect(exists('app/js/view_components/modal/states/PrivacyPolicyModalState.ts')).toBe(false);
    expect(read('app/js/view_components/modal/ModalComponent.ts')).toBe(MODAL_COMPONENT);
  });
});
