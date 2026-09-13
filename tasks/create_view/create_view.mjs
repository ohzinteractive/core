import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Scaffolder, capitalize, print_report, render_template, sanitize_name } from '../_shared/scaffolding.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the complete plan for a new view without touching disk.
 *
 * Note there is deliberately no GeneralLoader patch. The old script tried to
 * add a transition-data import there, but that import was removed from
 * GeneralLoader during the js-to-ts refactor and every view now imports its own
 * transition json directly, as TemplateView does. The patch had been silently
 * doing nothing ever since.
 * Exported so it can be tested, and so `--dry-run` and the real run share one
 * definition of what creating a view means.
 */
function plan_view(raw_name, { root, dry_run = false })
{
  const name = sanitize_name(raw_name);

  if (name.length === 0)
  {
    throw new Error('A view name is required, for example: yarn create-view Gallery');
  }

  const pascal = capitalize(name);
  const upper = name.toUpperCase();
  const dashed = name.replace(/_/g, '-');

  // Order matters: the broad /template/ replacement must run last, after the
  // more specific placeholders have been consumed.
  const code = [
    [/Template/g, pascal],
    [/TEMPLATE/g, upper],
    [/template_data/g, `${name}_data`],
    [/template\.json/g, `${name}.json`],
    [/template/g, dashed]
  ];

  const scaffolder = new Scaffolder({ root, dry_run });

  for (const kind of ['View', 'SceneController', 'TransitionController'])
  {
    scaffolder.create(
      `app/js/views/${name}/${pascal}${kind}.ts`,
      render_template(path.join(TEMPLATES, `Template${kind}.ts`), code)
    );
  }

  scaffolder.create(
    `app/data/transitions/${name}.json`,
    render_template(path.join(TEMPLATES, 'template.json'), [[/template/g, name]])
  );

  scaffolder.create(
    `app/views/${name}/${name}.pug`,
    render_template(path.join(TEMPLATES, 'template.pug'), [[/template/g, dashed]])
  );

  scaffolder.create(
    `app/css/${name}/_${name}.scss`,
    render_template(path.join(TEMPLATES, '_template.scss'), [[/template/g, dashed]])
  );

  scaffolder
    .patch(
      'app/data/default_state_data.js',
      'loader_opacity: 0,',
      `loader_opacity: 0,\n  ${name}_opacity: 0,`,
      `${name}_opacity transition state`
    )
    .patch(
      'app/css/application.scss',
      '__SECTIONS__',
      `__SECTIONS__\n@import '${name}/${name}';`,
      'scss import'
    )
    .patch(
      'index.pug',
      '__SECTIONS__',
      `__SECTIONS__\n      include app/views/${name}/${name}`,
      'pug include'
    )
    .patch(
      'app/js/views/Sections.ts',
      "'initial',",
      `'initial',\n  ${upper}: '${name}',`,
      'section name'
    )
    .patch(
      'app/js/views/Sections.ts',
      "'/initial',",
      `'/initial',\n  ${upper}: '/${dashed}',`,
      'section url'
    )
    .patch(
      'app/js/MainApplication.ts',
      "HomeView';",
      `HomeView';\nimport { ${pascal}View } from './views/${name}/${pascal}View';`,
      'view import'
    )
    .patch(
      'app/js/MainApplication.ts',
      'home_view: HomeView;',
      `home_view: HomeView;\n  ${name}_view: ${pascal}View;`,
      'view field'
    )
    .patch(
      'app/js/MainApplication.ts',
      'HomeView();',
      `HomeView();\n    this.${name}_view = new ${pascal}View();`,
      'view instantiation'
    )
    .patch(
      'app/js/MainApplication.ts',
      'home_view.start();',
      `home_view.start();\n    this.${name}_view.start();`,
      'view start'
    );

  return scaffolder;
}

function main(argv)
{
  const args = argv.slice(2);
  const dry_run = args.includes('--dry-run');
  const raw_name = args.find((entry) => !entry.startsWith('--'));

  // Invoked from core/, while the application lives one level up.
  const root = path.resolve(process.cwd(), '..');

  try
  {
    const report = plan_view(raw_name, { root, dry_run }).run();

    return print_report(report, `create-view ${sanitize_name(raw_name)}`);
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

export { main, plan_view };
