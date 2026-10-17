import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Scaffolder, render_template } from '../_shared/scaffolding.mjs';
import { TIERS, manifest_path, parse_entries } from './manifest.mjs';
import { class_name, validate_object_name, validate_scene_name } from './object_names.mjs';

const TEMPLATES = path.dirname(fileURLToPath(import.meta.url));

const MARKERS = {
  imports: '// __OBJECT_IMPORTS__',
  fields: '// __OBJECT_FIELDS__',
  regular: '// __OBJECTS__',
  high: '// __HIGH_OBJECTS__'
};

const MARKER_HOMES = {
  imports: 'after the scene imports',
  fields: 'in the class field list',
  regular: 'at the end of on_assets_ready()',
  high: 'at the end of on_high_quality_assets_ready()'
};

const TRANSFORM_KEYS = ['position', 'rotation', 'scale'];

// A field on the scene must not collide with one these already declare.
const MEMBER_SOURCES = ['app/js/scenes/common/CommonScene.ts', 'core/src/scenes/AbstractScene.ts'];

function escape(text)
{
  return text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

function format_number(value)
{
  if (typeof value !== 'number' || !Number.isFinite(value))
  {
    throw new Error(`transform values must be finite numbers, got ${value}.`);
  }

  const rounded = Math.round(value * 10000) / 10000;

  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function format_vector(vector, label)
{
  if (!Array.isArray(vector) || vector.length !== 3)
  {
    throw new Error(`${label} must be [x, y, z].`);
  }

  return vector.map(format_number).join(', ');
}

function find_tier(root, scene, name)
{
  for (const tier of TIERS)
  {
    const absolute = path.resolve(root, manifest_path(scene, tier));

    if (fs.existsSync(absolute) && parse_entries(fs.readFileSync(absolute, 'utf8')).some((entry) => entry.name === name))
    {
      return tier;
    }
  }

  return null;
}

function marker_indent(text, marker)
{
  const match = new RegExp(`^([ \\t]*)${escape(marker)}`, 'm').exec(text);

  return match === null ? null : match[1];
}

function declares_member(text, name)
{
  return new RegExp(`^[ \\t]*(?:(?:private|protected|public|static|readonly|async|get|set)\\s+)*${name}\\s*[?!]?\\s*[:(=;]`, 'm').test(text);
}

function has_line(text, line)
{
  return text.split('\n').some((candidate) => candidate.trim() === line);
}

function plan_class(scaffolder, root, model_name, pascal, values)
{
  const object_file = `app/js/objects/${pascal}.ts`;
  const object_path = path.resolve(root, object_file);

  if (!fs.existsSync(object_path))
  {
    scaffolder.create(object_file, render_template(path.join(TEMPLATES, 'TemplateObject.ts'), [
      [/__CLASS__/g, pascal],
      [/__NAME__/g, model_name],
      [/__POSITION__/g, values.position],
      [/__ROTATION__/g, values.rotation],
      [/__SCALE__/g, values.scale]
    ]));

    return;
  }

  const text = fs.readFileSync(object_path, 'utf8');

  if (!text.includes(`this.name = '${model_name}';`))
  {
    throw new Error(`${object_file} already exists but wraps a different model. Pass a different name.`);
  }

  for (const key of TRANSFORM_KEYS)
  {
    const matches = [...text.matchAll(new RegExp(`^([ \\t]*)this\\.${key}\\.set\\([^)\\n]*\\);[ \\t]*$`, 'gm'))];

    if (matches.length !== 1)
    {
      throw new Error(`${object_file} has ${matches.length} "this.${key}.set(...)" lines, and commit_object rewrites exactly one. Fix the class by hand.`);
    }

    const [line, indent] = matches[0];

    scaffolder.ensure(object_file, line, `${indent}this.${key}.set(${values[key]});`, `${key} of ${pascal}`);
  }
}

function plan_scene_wiring(scaffolder, root, scene_file, scene_text, model_name, pascal, tier)
{
  const import_line = `import { ${pascal} } from '../objects/${pascal}';`;
  const field_line = `${model_name}: ${pascal};`;
  const instance_line = `this.${model_name} = new ${pascal}();`;

  if (has_line(scene_text, import_line))
  {
    scaffolder.ensure(scene_file, import_line, import_line, `import of ${pascal}`);
  }
  else
  {
    if (new RegExp(`\\b${pascal}\\b`).test(scene_text))
    {
      throw new Error(`${scene_file} already uses the identifier ${pascal}. Pass a different name.`);
    }

    const indent = marker_indent(scene_text, MARKERS.imports);

    scaffolder.patch(scene_file, MARKERS.imports, `${import_line}\n${indent}${MARKERS.imports}`, `import of ${pascal}`);
  }

  if (has_line(scene_text, field_line))
  {
    scaffolder.ensure(scene_file, field_line, field_line, `field ${model_name}`);
  }
  else
  {
    const sources = [scene_text, ...MEMBER_SOURCES
      .map((relative) => path.resolve(root, relative))
      .filter((absolute) => fs.existsSync(absolute))
      .map((absolute) => fs.readFileSync(absolute, 'utf8'))];

    if (sources.some((text) => declares_member(text, model_name)))
    {
      throw new Error(`the scene already has a member called ${model_name}. Pass a different name.`);
    }

    const indent = marker_indent(scene_text, MARKERS.fields);

    scaffolder.patch(scene_file, MARKERS.fields, `${field_line}\n${indent}${MARKERS.fields}`, `field ${model_name}`);
  }

  if (has_line(scene_text, instance_line))
  {
    scaffolder.ensure(scene_file, instance_line, instance_line, `instance of ${pascal}`);
  }
  else
  {
    const indent = marker_indent(scene_text, MARKERS[tier]);

    scaffolder.patch(
      scene_file,
      MARKERS[tier],
      `${instance_line}\n${indent}this.add(this.${model_name});\n\n${indent}${MARKERS[tier]}`,
      `instance of ${pascal}`
    );
  }
}

/**
 * Plans saving a model's placement as code: a wrapper class that holds the
 * transform, and the scene wiring that creates it once its assets are ready.
 * A repeat commit rewrites only the three transform lines of the class.
 */
function plan_commit_object({ name, scene = 'home', transform }, { root, dry_run = false })
{
  const scene_name = validate_scene_name(scene);
  const model_name = validate_object_name(name);
  const pascal = class_name(model_name);
  const tier = find_tier(root, scene_name, model_name);

  if (tier === null)
  {
    throw new Error(`"${model_name}" is not in the object manifests of app/data/assets/${scene_name}. Import it first with import_model.`);
  }

  const values = {
    position: format_vector(transform?.position, 'position'),
    rotation: format_vector(transform?.rotation, 'rotation'),
    scale: format_vector(transform?.scale, 'scale')
  };

  const scene_file = `app/js/scenes/${class_name(scene_name)}Scene.ts`;
  const scene_path = path.resolve(root, scene_file);

  if (!fs.existsSync(scene_path))
  {
    throw new Error(`no scene file at ${scene_file}.`);
  }

  const scene_text = fs.readFileSync(scene_path, 'utf8');
  const missing = ['imports', 'fields', tier].filter((key) => marker_indent(scene_text, MARKERS[key]) === null);

  if (missing.length > 0)
  {
    const list = missing.map((key) => `${MARKERS[key]} (${MARKER_HOMES[key]})`).join(', ');

    throw new Error(`${scene_file} is missing ${list}. Add the marker comment there and commit again.`);
  }

  const scaffolder = new Scaffolder({ root, dry_run });

  plan_class(scaffolder, root, model_name, pascal, values);
  plan_scene_wiring(scaffolder, root, scene_file, scene_text, model_name, pascal, tier);

  return scaffolder;
}

export { plan_commit_object };
