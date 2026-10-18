import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Scaffolder, capitalize, print_report, render_template, require_name, sanitize_name } from '../_shared/scaffolding.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the plan for a new modal state.
 *
 * This replaces the create-modal script that lived in ohzi-components. That one
 * wrote with replace-in-file and async copies and only logged its errors, so a
 * missing anchor or a repeated name left a half-wired or duplicated modal. It
 * now shares the Scaffolder with the other scaffolders: it validates the whole
 * plan and only then writes.
 */
function plan_modal(raw_name, { root, dry_run = false })
{
  const name = require_name(raw_name, 'modal', 'yarn create-modal privacy_policy');

  const pascal = capitalize(name);
  const dashed = name.replace(/_/g, '-');

  const scaffolder = new Scaffolder({ root, dry_run });

  scaffolder.create(
    `app/js/view_components/modal/states/${pascal}ModalState.ts`,
    render_template(path.join(TEMPLATES, 'TemplateModalState.ts'), [[/Template/g, pascal]])
  );

  scaffolder.create(
    `app/views/components/modal/states/${name}.pug`,
    render_template(path.join(TEMPLATES, 'template.pug'), [[/template/g, dashed]])
  );

  scaffolder.create(
    `app/css/components/modal/${name}/_${name}.scss`,
    render_template(path.join(TEMPLATES, '_template.scss'), [[/template/g, dashed]])
  );

  scaffolder
    .patch(
      'app/js/view_components/modal/ModalComponent.ts',
      '__MODAL_STATES_IMPORTS__',
      `__MODAL_STATES_IMPORTS__\nimport { ${pascal}ModalState } from './states/${pascal}ModalState';`,
      'modal state import'
    )
    .patch(
      'app/js/view_components/modal/ModalComponent.ts',
      '__MODAL_STATES__',
      `__MODAL_STATES__\n      ${name}: new ${pascal}ModalState('${dashed}'),`,
      'modal state entry'
    )
    // Anchored on the line break so the include ends at the name: unterminated,
    // `include states/terms` would match an existing `include states/terms_of_use`
    // and refuse the new modal as already applied.
    .patch(
      'app/views/components/modal/modal.pug',
      '__MODAL_STATES__\n',
      `__MODAL_STATES__\n    include states/${name}\n`,
      'pug include'
    )
    .patch(
      'app/css/application.scss',
      '__MODAL_STATES__',
      `__MODAL_STATES__\n@import 'components/modal/${name}/${name}';`,
      'scss import'
    );

  return scaffolder;
}

function main(argv)
{
  const args = argv.slice(2);
  const dry_run = args.includes('--dry-run');
  const raw_name = args.find((entry) => !entry.startsWith('--'));
  const root = path.resolve(process.cwd(), '..');

  try
  {
    const report = plan_modal(raw_name, { root, dry_run }).run();

    return print_report(report, `create-modal ${sanitize_name(raw_name)}`);
  }
  catch (error)
  {
    console.error(`\x1b[31m${error.message}\x1b[0m`);

    return 1;
  }
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href)
{
  process.exit(main(process.argv));
}

export { main, plan_modal };
