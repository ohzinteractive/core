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
    this.patches.push({ relative_path, from, to, label: label ?? relative_path, required: true });

    return this;
  }

  /**
   * Queue a replacement that only has to end in the right state.
   *
   * Used where a step may legitimately already be done, such as uncommenting an
   * import that an earlier run of a different feature already uncommented. It
   * tolerates "already applied" and reports it, but a genuinely absent end
   * state is still an error: skipping it would leave code referencing something
   * that was never imported.
   */
  ensure(relative_path, from, to, label)
  {
    this.patches.push({ relative_path, from, to, label: label ?? relative_path, required: false });

    return this;
  }

  absolute(relative_path)
  {
    return path.resolve(this.root, relative_path);
  }

  /**
   * Decides what a queued patch would do against the current file contents.
   *
   * The order of the two checks matters and depends on the shape of the patch.
   * An append keeps the anchor inside the replacement, so `from` is still
   * present after a successful run and only the presence of `to` can tell you
   * it is done. An uncomment does the reverse: the replacement is a substring
   * of the anchor, so `to` looks present even before the patch runs. Comparing
   * the two strings tells us which case we are in without the caller having to
   * say.
   */
  classify(entry)
  {
    const target = this.absolute(entry.relative_path);

    if (!fs.existsSync(target))
    {
      return 'no_file';
    }

    const current = fs.readFileSync(target, 'utf8');
    const has_from = current.includes(entry.from);
    const has_to = current.includes(entry.to);
    const appends = entry.to.includes(entry.from);

    if (appends)
    {
      if (has_to)
      {
        return 'applied';
      }

      return has_from ? 'apply' : 'missing_anchor';
    }

    if (has_from)
    {
      return 'apply';
    }

    return has_to ? 'applied' : 'missing_anchor';
  }

  /**
   * Works out what each queued step would do, running them against an in-memory
   * copy so a step can depend on an earlier one. create-component relies on
   * this: it patches an anchor that an earlier patch in the same run creates.
   *
   * Nothing is written during simulation, so a plan that fails anywhere leaves
   * the project untouched.
   */
  simulate()
  {
    const files = new Map();
    const errors = [];
    const created = [];
    const patched = [];
    const skipped = [];

    for (const entry of this.creates)
    {
      if (fs.existsSync(this.absolute(entry.relative_path)) || files.has(entry.relative_path))
      {
        errors.push(`already exists: ${entry.relative_path}`);
        continue;
      }

      files.set(entry.relative_path, entry.contents);
      created.push(entry.relative_path);
    }

    for (const entry of this.patches)
    {
      const target = { file: entry.relative_path, label: entry.label };
      let current = files.get(entry.relative_path);

      if (current === undefined)
      {
        const absolute = this.absolute(entry.relative_path);

        if (!fs.existsSync(absolute))
        {
          errors.push(`cannot patch a missing file: ${entry.relative_path}`);
          continue;
        }

        current = fs.readFileSync(absolute, 'utf8');
      }

      const verdict = this.classify(entry, current);

      if (verdict === 'apply')
      {
        files.set(entry.relative_path, current.replace(entry.from, entry.to));
        patched.push(target);
        continue;
      }

      if (verdict === 'applied')
      {
        if (entry.required)
        {
          errors.push(`already applied, refusing to duplicate: ${entry.label}`);
        }
        else
        {
          skipped.push({ ...target, reason: 'already in place' });
        }

        continue;
      }

      // A missing anchor fails whether the step was required or merely ensured:
      // an ensured step still has to end up present.
      errors.push(`anchor not found in ${entry.relative_path}, so this would silently do nothing: ${entry.label}`);
    }

    return { files, errors, created, patched, skipped };
  }

  /**
   * Decides what a queued patch would do against the given contents.
   *
   * The order of the two checks depends on the shape of the patch. An append
   * keeps the anchor inside its replacement, so the anchor is still present
   * afterwards and only the presence of the replacement proves it ran. An
   * uncomment is the reverse: the replacement is a substring of the anchor, so
   * it looks present before the patch runs. Comparing the two strings tells us
   * which case we are in without the caller having to say.
   */
  classify(entry, current)
  {
    const has_from = current.includes(entry.from);
    const has_to = current.includes(entry.to);
    const appends = entry.to.includes(entry.from);

    if (appends)
    {
      if (has_to)
      {
        return 'applied';
      }

      return has_from ? 'apply' : 'missing_anchor';
    }

    if (has_from)
    {
      return 'apply';
    }

    return has_to ? 'applied' : 'missing_anchor';
  }

  validate()
  {
    return this.simulate().errors;
  }

  run()
  {
    const outcome = this.simulate();

    const report = {
      dry_run: this.dry_run,
      errors: outcome.errors,
      created: outcome.created,
      patched: outcome.patched,
      skipped: outcome.skipped
    };

    if (outcome.errors.length > 0 || this.dry_run)
    {
      report.applied = false;

      return report;
    }

    for (const [relative, contents] of outcome.files)
    {
      const target = this.absolute(relative);

      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, contents, 'utf8');
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

  for (const entry of report.skipped ?? [])
  {
    console.log(`\x1b[90mskipped\x1b[0m ${entry.file} (${entry.label}: ${entry.reason})`);
  }

  if (report.dry_run)
  {
    console.log('\ndry run: nothing was written.');
  }

  return 0;
}

export { Scaffolder, capitalize, print_report, render_template, sanitize_name, snake_to_camelcase };
