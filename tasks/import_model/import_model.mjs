import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Scaffolder } from '../_shared/scaffolding.mjs';
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
  const manifests = read_manifests(root, scene_name);
  const other_tier = tier === 'high' ? 'regular' : 'high';

  if (manifests[other_tier].entries.some((entry) => entry.name === model_name))
  {
    throw new Error(`"${model_name}" is already in the ${other_tier} manifest (${manifests[other_tier].relative}). A model lives in one tier only.`);
  }

  const url = model_url(model_name, tier);
  const owner = [...manifests.regular.entries, ...manifests.high.entries].find((entry) => entry.url === url && entry.name !== model_name);

  if (owner !== undefined)
  {
    throw new Error(`${url} already belongs to the manifest entry "${owner.name}". Pass a different name.`);
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

export { plan_import_model };

export { plan_commit_object } from './commit_object.mjs';
