import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Scaffolder, print_report } from '../_shared/scaffolding.mjs';
import { assert_supported, read_glb_header } from './glb_header.mjs';
import { TIERS, append_entry, manifest_path, model_url, parse_entries, with_draco, with_size } from './manifest.mjs';
import { validate_object_name, validate_scene_name } from './object_names.mjs';

function read_source(source)
{
  const source_path = path.resolve(String(source ?? ''));

  if (path.extname(source_path).toLowerCase() !== '.glb')
  {
    throw new Error(`only self-contained .glb files can be imported: ${source_path}`);
  }

  if (!fs.existsSync(source_path) || !fs.statSync(source_path).isFile())
  {
    throw new Error(`no file at ${source_path}`);
  }

  const bytes = fs.readFileSync(source_path);
  const header = read_glb_header(bytes);

  assert_supported(header);

  return { source_path, bytes, header };
}

function read_manifests(root, scene)
{
  const asset_dir = `app/data/assets/${scene}`;

  if (!fs.existsSync(path.resolve(root, asset_dir)))
  {
    throw new Error(`scene "${scene}" has no asset folder at ${asset_dir}. Create the scene first: yarn create-scene ${scene}`);
  }

  const manifests = {};

  for (const tier of TIERS)
  {
    const relative = manifest_path(scene, tier);
    const absolute = path.resolve(root, relative);

    if (!fs.existsSync(absolute))
    {
      throw new Error(`missing manifest ${relative}. Every scene created with yarn create-scene has one.`);
    }

    const text = fs.readFileSync(absolute, 'utf8');

    manifests[tier] = { relative, text, entries: parse_entries(text) };
  }

  return manifests;
}

/**
 * Every manifest entry of every scene, so a URL is owned by one entry across
 * the whole project. A scene's manifests may be absent: only the ones on disk
 * are read.
 */
function read_all_entries(root)
{
  const assets = path.resolve(root, 'app/data/assets');

  if (!fs.existsSync(assets))
  {
    return [];
  }

  const entries = [];

  for (const dirent of fs.readdirSync(assets, { withFileTypes: true }))
  {
    if (!dirent.isDirectory())
    {
      continue;
    }

    for (const tier of TIERS)
    {
      const absolute = path.resolve(root, manifest_path(dirent.name, tier));

      if (!fs.existsSync(absolute))
      {
        continue;
      }

      for (const entry of parse_entries(fs.readFileSync(absolute, 'utf8')))
      {
        entries.push({ ...entry, scene: dirent.name });
      }
    }
  }

  return entries;
}

/**
 * Plans copying a GLB into public/models and listing it in a scene's object
 * manifest. Validation failures throw before anything is queued; run() on the
 * returned scaffolder writes, or reports, the rest.
 */
function plan_import_model({ source, scene = 'home', name, tier = 'regular', replace = false }, { root, dry_run = false })
{
  if (!TIERS.includes(tier))
  {
    throw new Error(`tier must be "regular" or "high", not "${tier}".`);
  }

  const { source_path, bytes, header } = read_source(source);
  const scene_name = validate_scene_name(scene);
  const model_name = validate_object_name(name ?? path.basename(source_path).slice(0, -'.glb'.length));

  if (model_name === scene_name)
  {
    throw new Error(`"${model_name}" cannot be both the scene and the model name: the scene root is already called ${model_name}, so the live tools would address the scene. Pass a different name.`);
  }

  const manifests = read_manifests(root, scene_name);
  const other_tier = tier === 'high' ? 'regular' : 'high';

  if (manifests[other_tier].entries.some((entry) => entry.name === model_name))
  {
    throw new Error(`"${model_name}" is already in the ${other_tier} manifest (${manifests[other_tier].relative}). A model lives in one tier only.`);
  }

  const url = model_url(model_name, tier);

  // A URL names one file, so one entry owns it project-wide. Replace only
  // overwrites that entry's own file, never a file another entry points at.
  const owner = read_all_entries(root).find((candidate) => candidate.url === url && (candidate.scene !== scene_name || candidate.name !== model_name));

  if (owner !== undefined)
  {
    throw new Error(`${url} already belongs to "${owner.name}" in scene "${owner.scene}". Pass a different name.`);
  }

  const manifest = manifests[tier];
  const file = `public${url}`;
  const target = path.resolve(root, file);
  const existing = fs.existsSync(target) ? fs.readFileSync(target) : null;
  const entry = manifest.entries.find((candidate) => candidate.name === model_name);
  const scaffolder = new Scaffolder({ root, dry_run });
  const model = {
    name: model_name,
    url,
    draco: header.draco,
    version: crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12),
    size: bytes.length,
    tier
  };

  if (entry !== undefined)
  {
    if (entry.url !== url)
    {
      throw new Error(`the manifest entry "${model_name}" points at ${entry.url}, not ${url}. Pass a different name or fix the manifest.`);
    }

    if (existing !== null && existing.equals(bytes))
    {
      return { scaffolder, model, unchanged: true };
    }

    if (existing !== null && !replace)
    {
      throw new Error(`${file} already holds a different "${model_name}". Pass replace to overwrite it.`);
    }

    scaffolder.create(file, bytes, { overwrite: true });

    const updated = with_draco(entry.size === null ? entry.text : with_size(entry.text, bytes.length), header.draco);

    if (updated !== entry.text)
    {
      scaffolder.ensure(manifest.relative, entry.text, updated, `manifest entry for ${model_name}`);
    }

    return { scaffolder, model, unchanged: false };
  }

  if (existing !== null && !replace)
  {
    throw new Error(`${file} already exists but is not in ${manifest.relative}. Pass replace to overwrite it and add the entry.`);
  }

  scaffolder.create(file, bytes, { overwrite: replace });
  scaffolder.patch(
    manifest.relative,
    manifest.text,
    append_entry(manifest.text, { name: model_name, url, size: bytes.length, draco: header.draco }),
    `manifest entry for ${model_name}`
  );

  return { scaffolder, model, unchanged: false };
}

const VALUE_FLAGS = ['--scene', '--name', '--tier'];
const USAGE = 'usage: yarn import-model <file.glb> [--scene home] [--name chair] [--tier regular|high] [--replace] [--dry-run]';

function main(argv, { cwd = process.cwd(), env = process.env } = {})
{
  const args = argv.slice(2);
  const option = (flag) =>
  {
    const index = args.indexOf(flag);

    return index === -1 ? undefined : args[index + 1];
  };
  const source = args.find((arg, index) => !arg.startsWith('--') && !VALUE_FLAGS.includes(args[index - 1]));

  if (source === undefined)
  {
    console.error(USAGE);

    return 1;
  }

  // yarn runs this from core/, but the user typed the path relative to where
  // they ran yarn, which yarn records in INIT_CWD.
  const base = env.INIT_CWD ?? cwd;
  const root = path.resolve(cwd, '..');

  try
  {
    const { scaffolder, model, unchanged } = plan_import_model({
      source: path.resolve(base, source),
      scene: option('--scene'),
      name: option('--name'),
      tier: option('--tier'),
      replace: args.includes('--replace')
    }, { root, dry_run: args.includes('--dry-run') });

    if (unchanged)
    {
      console.log(`${model.name} is already imported with identical bytes. Nothing to do.`);

      return 0;
    }

    return print_report(scaffolder.run(), `import-model ${model.name}`);
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

export { main, plan_import_model };

export { plan_commit_object } from './commit_object.mjs';
