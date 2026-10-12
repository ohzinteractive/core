const TIERS = ['regular', 'high'];

function manifest_path(scene, tier)
{
  return tier === 'high'
    ? `app/data/assets/${scene}/high/${scene}_high_objects.js`
    : `app/data/assets/${scene}/${scene}_objects.js`;
}

function model_url(name, tier)
{
  return tier === 'high' ? `/models/high/${name}.glb` : `/models/${name}.glb`;
}

// Same length in, same length out, so indexes into the result are indexes
// into the original text.
function blank_line_comments(text)
{
  return text.replace(/^([ \t]*)(\/\/[^\n]*)/gm, (match, indent, comment) => indent + ' '.repeat(comment.length));
}

function parse_entries(text)
{
  const visible = blank_line_comments(text);
  const entries = [];

  for (const match of visible.matchAll(/\{[^{}]*\}/g))
  {
    const body = match[0];
    const name = /\bname:\s*['"]([^'"]+)['"]/.exec(body);

    if (name === null)
    {
      continue;
    }

    const url = /\burl:\s*['"]([^'"]+)['"]/.exec(body);
    const size = /\bsize:\s*(\d+)/.exec(body);

    entries.push({
      name: name[1],
      url: url === null ? null : url[1],
      size: size === null ? null : Number(size[1]),
      text: text.slice(match.index, match.index + body.length)
    });
  }

  return entries;
}

// Splits a line into its code and a trailing // comment (with the whitespace
// before it), skipping any // inside a string such as a URL.
function split_comment(line)
{
  let quote = null;

  for (let index = 0; index < line.length; index++)
  {
    const char = line[index];

    if (quote !== null)
    {
      if (char === '\\')
      {
        index++;
      }
      else if (char === quote)
      {
        quote = null;
      }

      continue;
    }

    if (char === '\'' || char === '"' || char === '`')
    {
      quote = char;
    }
    else if (char === '/' && line[index + 1] === '/')
    {
      const code = line.slice(0, index).trimEnd();

      return { code, comment: line.slice(code.length) };
    }
  }

  return { code: line.trimEnd(), comment: '' };
}

function format_entry({ name, url, size, draco })
{
  return [
    '  {',
    `    name: '${name}',`,
    `    url: '${url}',`,
    `    size: ${size},`,
    `    draco: ${draco}`,
    '  }'
  ].join('\n');
}

function append_entry(text, entry)
{
  if (/=\s*\[\s*\];/.test(text))
  {
    return text.replace(/=\s*\[\s*\];/, `= [\n${format_entry(entry)}\n];`);
  }

  const lines = text.split('\n');
  const close = lines.findLastIndex((line) => line.trim().startsWith('];'));

  if (close === -1)
  {
    throw new Error('the manifest has no closing "];" line, so the entry cannot be appended.');
  }

  for (let index = close - 1; index >= 0; index--)
  {
    const trimmed = lines[index].trim();

    if (trimmed === '' || trimmed.startsWith('//'))
    {
      continue;
    }

    // The comma goes before a trailing comment, never inside it.
    const { code, comment } = split_comment(lines[index]);

    if (code.endsWith('}'))
    {
      lines[index] = `${code},${comment}`;
    }

    break;
  }

  lines.splice(close, 0, format_entry(entry));

  return lines.join('\n');
}

function with_size(entry_text, size)
{
  return entry_text.replace(/\bsize:\s*\d+/, `size: ${size}`);
}

function with_draco(entry_text, draco)
{
  if (/\bdraco:\s*(true|false)/.test(entry_text))
  {
    return entry_text.replace(/\bdraco:\s*(true|false)/, () => `draco: ${draco}`);
  }

  // An absent key already means false.
  if (!draco)
  {
    return entry_text;
  }

  const body = entry_text.slice(0, -1);
  const last_property = body.trimEnd();
  const closing = body.slice(last_property.length).includes('\n') ? body.slice(last_property.length) : '\n  ';
  const lines = last_property.split('\n');
  let index = lines.length - 1;

  // The comma belongs on the last line that has code, and before its comment.
  while (index > 0 && split_comment(lines[index]).code.trim() === '')
  {
    index--;
  }

  const { code, comment } = split_comment(lines[index]);

  if (!code.endsWith(','))
  {
    lines[index] = `${code},${comment}`;
  }

  return `${lines.join('\n')}\n    draco: true${closing}}`;
}

export { TIERS, append_entry, manifest_path, model_url, parse_entries, with_draco, with_size };
