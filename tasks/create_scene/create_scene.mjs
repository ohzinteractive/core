import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Scaffolder, capitalize, print_report, render_template, sanitize_name } from '../_shared/scaffolding.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

const ASSET_KINDS = ['objects', 'sounds', 'textures'];

/**
 * Builds the plan for a new scene.
 * A scene is files only: it registers nothing, so there are no patches to
 * apply and nothing to wire into the application.
 */
function plan_scene(raw_name, { root, dry_run = false })
{
  const name = sanitize_name(raw_name);

  if (name.length === 0)
  {
    throw new Error('A scene name is required, for example: yarn create-scene Gallery');
  }

  const pascal = capitalize(name);
  const scaffolder = new Scaffolder({ root, dry_run });

  scaffolder.create(
    `app/js/scenes/${pascal}Scene.ts`,
    render_template(path.join(TEMPLATES, 'TemplateScene.ts'), [
      [/Template/g, pascal],
      [/TEMPLATE/g, name.toUpperCase()],
      [/template/g, name.replace(/_/g, '-')]
    ])
  );

  for (const kind of ASSET_KINDS)
  {
    scaffolder.create(
      `app/data/assets/${name}/${name}_${kind}.js`,
      render_template(path.join(TEMPLATES, `template_${kind}.js`), [[/template/g, name]])
    );

    scaffolder.create(
      `app/data/assets/${name}/high/${name}_high_${kind}.js`,
      render_template(path.join(TEMPLATES, `template_high_${kind}.js`), [[/template/g, name]])
    );
  }

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
    const report = plan_scene(raw_name, { root, dry_run }).run();

    return print_report(report, `create-scene ${sanitize_name(raw_name)}`);
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

export { main, plan_scene };
