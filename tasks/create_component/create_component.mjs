import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Scaffolder, capitalize, print_report, render_template, sanitize_name } from '../_shared/scaffolding.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the plan for a new view component.
 *
 * The MainApplication patches are order dependent: the "start" patch anchors on
 * the instantiation the previous patch writes. The scaffolder simulates the
 * whole plan in memory, so the steps see each other's output while still
 * leaving the project untouched if anything fails.
 */
function plan_component(raw_name, { root, dry_run = false })
{
  const name = sanitize_name(raw_name);

  if (name.length === 0)
  {
    throw new Error('A component name is required, for example: yarn create-component Header');
  }

  const pascal = capitalize(name);
  const dashed = name.replace(/_/g, '-');

  const scaffolder = new Scaffolder({ root, dry_run });

  scaffolder.create(
    `app/js/view_components/${name}/${pascal}Component.ts`,
    render_template(path.join(TEMPLATES, 'TemplateComponent.ts'), [
      [/Template/g, pascal],
      [/TEMPLATE/g, name.toUpperCase()],
      [/template_opacity/g, `${name}_opacity`],
      [/template/g, dashed]
    ])
  );

  scaffolder.create(
    `app/views/components/${name}/${name}.pug`,
    render_template(path.join(TEMPLATES, 'template.pug'), [[/template/g, dashed]])
  );

  scaffolder.create(
    `app/css/components/${name}/_${name}.scss`,
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
      '__COMPONENTS__',
      `__COMPONENTS__\n@import 'components/${name}/${name}';`,
      'scss import'
    )
    .patch(
      'index.pug',
      '__COMPONENTS__',
      `__COMPONENTS__\n      include app/views/components/${name}/${name}`,
      'pug include'
    )
    .patch(
      'app/js/MainApplication.ts',
      "HomeView';",
      `HomeView';\nimport { ${pascal}Component } from './view_components/${name}/${pascal}Component';`,
      'component import'
    )
    .patch(
      'app/js/MainApplication.ts',
      'home_view: HomeView;',
      `home_view: HomeView;\n  ${name}_component: ${pascal}Component;`,
      'component field'
    )
    .patch(
      'app/js/MainApplication.ts',
      '__COMPONENTS__',
      `__COMPONENTS__\n    this.${name}_component = new ${pascal}Component();`,
      'component instantiation'
    )
    .patch(
      'app/js/MainApplication.ts',
      `${pascal}Component();`,
      `${pascal}Component();\n    this.${name}_component.start();`,
      'component start'
    )
    .patch(
      'app/js/view_components/Components.ts',
      '__COMPONENTS__',
      `__COMPONENTS__\n  ${name.toUpperCase()}: '${name}',`,
      'component registry entry'
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
    const report = plan_component(raw_name, { root, dry_run }).run();

    return print_report(report, `create-component ${sanitize_name(raw_name)}`);
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

export { main, plan_component };
