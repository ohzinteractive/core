import fs from 'fs';
import path from 'path';

/**
 * Plans a scaffold, validates the whole plan, and only then writes anything.
 *
 * The scaffolders used to copy templates and patch anchors one call at a time,
 * which meant a missing anchor silently did nothing and left a half-wired
 * feature behind, and a second run happily duplicated every import it had
 * already added. Everything is checked up front here so a bad run fails
 * having changed nothing.
 */
class Scaffolder
{
  constructor({ root, dry_run = false })
  {
    this.root = root;
    this.dry_run = dry_run;
    this.creates = [];
    this.patches = [];
  }

  /** Queue a new file. Its parent directories are created on apply. */
  create(relative_path, contents)
  {
    this.creates.push({ relative_path, contents });

    return this;
  }

  /**
   * Queue a single-occurrence text replacement.
   * `from` must be present and `to` must not already be, so a repeated run is
   * refused rather than duplicating the insertion.
   */
  patch(relative_path, from, to, label)
  {
    this.patches.push({ relative_path, from, to, label: label ?? relative_path });

    return this;
  }

  absolute(relative_path)
  {
    return path.resolve(this.root, relative_path);
  }

  validate()
  {
    const errors = [];

    for (const entry of this.creates)
    {
      if (fs.existsSync(this.absolute(entry.relative_path)))
      {
        errors.push(`already exists: ${entry.relative_path}`);
      }
    }

    for (const entry of this.patches)
    {
      const target = this.absolute(entry.relative_path);

      if (!fs.existsSync(target))
      {
        errors.push(`cannot patch a missing file: ${entry.relative_path}`);
        continue;
      }

      const current = fs.readFileSync(target, 'utf8');

      if (current.includes(entry.to))
      {
        errors.push(`already applied, refusing to duplicate: ${entry.label}`);
        continue;
      }

      if (!current.includes(entry.from))
      {
        errors.push(`anchor not found in ${entry.relative_path}, so this would silently do nothing: ${entry.label}`);
      }
    }

    return errors;
  }

  run()
  {
    const errors = this.validate();

    const report = {
      dry_run: this.dry_run,
      errors,
      created: this.creates.map((entry) => entry.relative_path),
      patched: this.patches.map((entry) => ({ file: entry.relative_path, label: entry.label }))
    };

    if (errors.length > 0 || this.dry_run)
    {
      report.applied = false;

      return report;
    }

    for (const entry of this.creates)
    {
      const target = this.absolute(entry.relative_path);

      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, entry.contents, 'utf8');
    }

    for (const entry of this.patches)
    {
      const target = this.absolute(entry.relative_path);
      const current = fs.readFileSync(target, 'utf8');

      // String.replace swaps the first occurrence only, matching the behaviour
      // the previous replace-in-file calls relied on.
      fs.writeFileSync(target, current.replace(entry.from, entry.to), 'utf8');
    }

    report.applied = true;

    return report;
  }
}

/** Lowercases, collapses separators to underscores and strips anything else. */
function sanitize_name(name)
{
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function snake_to_camelcase(value)
{
  return String(value).toLowerCase().replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase());
}

function capitalize(value)
{
  const camel = snake_to_camelcase(value);

  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/** Reads a template and applies ordered [pattern, replacement] pairs. */
function render_template(template_path, replacements)
{
  let contents = fs.readFileSync(template_path, 'utf8');

  for (const [pattern, replacement] of replacements)
  {
    contents = contents.replace(pattern, replacement);
  }

  return contents;
}

function print_report(report, label)
{
  if (report.errors.length > 0)
  {
    console.error(`\x1b[31m${label} aborted. Nothing was changed.\x1b[0m`);

    for (const error of report.errors)
    {
      console.error(`  - ${error}`);
    }

    return 1;
  }

  const verb = report.dry_run ? 'would create' : 'created';

  for (const file of report.created)
  {
    console.log(`\x1b[32m${verb}\x1b[0m ${file}`);
  }

  for (const entry of report.patched)
  {
    console.log(`\x1b[33m${report.dry_run ? 'would patch' : 'patched'}\x1b[0m ${entry.file} (${entry.label})`);
  }

  if (report.dry_run)
  {
    console.log('\ndry run: nothing was written.');
  }

  return 0;
}

export { Scaffolder, capitalize, print_report, render_template, sanitize_name, snake_to_camelcase };
