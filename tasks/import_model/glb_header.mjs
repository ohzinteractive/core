const GLB_MAGIC = 0x46546c67; // 'glTF', little endian
const CHUNK_JSON = 0x4e4f534a; // 'JSON', little endian
const HEADER_BYTES = 20; // 12 byte file header + 8 byte chunk header
const DRACO = 'KHR_draco_mesh_compression';

// The glTF loading path wires a Draco decoder only. A model that requires
// either of these would load as empty geometry or untextured.
const UNSUPPORTED_EXTENSIONS = ['EXT_meshopt_compression', 'KHR_texture_basisu'];

function strings(value)
{
  return Array.isArray(value) ? value.filter((entry) => typeof entry === 'string') : [];
}

/**
 * Reads what import_model needs from a GLB without a glTF library: whether it
 * is a GLB at all, and which extensions it uses and requires.
 */
function read_glb_header(bytes)
{
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);

  if (buffer.length < HEADER_BYTES)
  {
    throw new Error('not a GLB file: it is shorter than a GLB header.');
  }

  if (buffer.readUInt32LE(0) !== GLB_MAGIC)
  {
    throw new Error('not a GLB file: it does not start with "glTF". Export the model as binary glTF (.glb).');
  }

  const version = buffer.readUInt32LE(4);

  if (version !== 2)
  {
    throw new Error(`unsupported GLB version ${version}: only glTF 2.0 is supported.`);
  }

  const json_length = buffer.readUInt32LE(12);

  if (buffer.readUInt32LE(16) !== CHUNK_JSON)
  {
    throw new Error('not a valid GLB file: its first chunk is not JSON.');
  }

  if (HEADER_BYTES + json_length > buffer.length)
  {
    throw new Error('not a valid GLB file: its JSON chunk is truncated.');
  }

  let json;

  try
  {
    json = JSON.parse(buffer.toString('utf8', HEADER_BYTES, HEADER_BYTES + json_length));
  }
  catch
  {
    json = null;
  }

  if (typeof json !== 'object' || json === null || Array.isArray(json))
  {
    throw new Error('not a valid GLB file: its JSON chunk does not parse to a glTF object.');
  }

  const extensions_used = strings(json.extensionsUsed);

  return {
    draco: extensions_used.includes(DRACO),
    extensions_used,
    extensions_required: strings(json.extensionsRequired)
  };
}

function assert_supported(header)
{
  const unsupported = header.extensions_required.filter((name) => UNSUPPORTED_EXTENSIONS.includes(name));

  if (unsupported.length > 0)
  {
    throw new Error(`this GLB requires ${unsupported.join(', ')}, which the OHZI glTF loader cannot read. Export it again without that compression.`);
  }
}

export { UNSUPPORTED_EXTENSIONS, assert_supported, read_glb_header };
