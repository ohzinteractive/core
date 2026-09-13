import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Scaffolder, capitalize, print_report, render_template, sanitize_name } from '../_shared/scaffolding.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the plan for a custom transition between two existing views.
 *
 * The two import patches uncomment lines rather than appending to them, so a
 * second transition into the same view finds them already uncommented. Those
 * are queued as optional and reported as skipped rather than failing the run.
 */
function plan_transition(raw_from, raw_to, { root, dry_run = false })
{
  const from = sanitize_name(raw_from);
  const to = sanitize_name(raw_to);

  if (from.length === 0 || to.length === 0)
  {
    throw new Error('Two view names are required, for example: yarn create-transition home gallery');
  }

  if (from === to)
  {
    throw new Error('A transition needs two different views.');
  }

  const controller = `app/js/views/${to}/${capitalize(to)}TransitionController.ts`;

  if (!fs.existsSync(path.resolve(root, controller)))
  {
    throw new Error(`No view named '${to}'. Expected ${controller}. Create the view first with: yarn create-view ${to}`);
  }

  const json_name = `${from}_to_${to}`;
  const scaffolder = new Scaffolder({ root, dry_run });

  scaffolder.create(
    `app/data/custom_transitions/${json_name}.json`,
    render_template(path.join(TEMPLATES, 'template.json'), [[/template/g, json_name]])
  );

  scaffolder
    .ensure(
      controller,
      "// import { TransitionManager } from 'ohzi-core';",
      "import { TransitionManager } from 'ohzi-core';",
      'uncomment TransitionManager import'
    )
    .ensure(
      controller,
      "// import { Sections } from '../Sections';",
      "import { Sections } from '../Sections';",
      'uncomment Sections import'
    )
    .patch(
      controller,
      "TransitionController';",
      `TransitionController';\nimport ${json_name} from '../../../data/custom_transitions/${json_name}.json';`,
      'transition data import'
    )
    .patch(
      controller,
      '// __CUSTOM_TRANSITIONS__',
      `// __CUSTOM_TRANSITIONS__\n    TransitionManager.add_transitions([\n      {\n        from: Sections.${from.toUpperCase()},\n        to: Sections.${to.toUpperCase()},\n        data: ${json_name}\n      }\n    ]);`,
      `${from} to ${to} registration`
    );

  return scaffolder;
}

function main(argv)
{
  const args = argv.slice(2);
  const dry_run = args.includes('--dry-run');
  const names = args.filter((entry) => !entry.startsWith('--'));
  const root = path.resolve(process.cwd(), '..');

  try
  {
    const report = plan_transition(names[0], names[1], { root, dry_run }).run();

    return print_report(report, `create-transition ${names[0]} to ${names[1]}`);
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

export { main, plan_transition };
