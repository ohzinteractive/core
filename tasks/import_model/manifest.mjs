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
    const name = /name:\s*['"]([^'"]+)['"]/.exec(body);

    if (name === null)
    {
      continue;
    }

    const url = /url:\s*['"]([^'"]+)['"]/.exec(body);
    const size = /size:\s*(\d+)/.exec(body);

    entries.push({
      name: name[1],
      url: url === null ? null : url[1],
      size: size === null ? null : Number(size[1]),
      text: text.slice(match.index, match.index + body.length)
    });
  }

  return entries;
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

    if (trimmed.endsWith('}'))
    {
      lines[index] = lines[index].replace(/\}\s*$/, '},');
    }

    break;
  }

  lines.splice(close, 0, format_entry(entry));

  return lines.join('\n');
}

function with_size(entry_text, size)
{
  return entry_text.replace(/size:\s*\d+/, `size: ${size}`);
}

export { TIERS, append_entry, manifest_path, model_url, parse_entries, with_size };
