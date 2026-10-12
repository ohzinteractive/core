const GLB_MAGIC = 0x46546c67;
const CHUNK_JSON = 0x4e4f534a;

// A GLB with only a JSON chunk. That is all the header parser reads, and it
// keeps fixtures out of the repository.
export function make_glb(json: unknown, { magic = GLB_MAGIC, version = 2, chunk_type = CHUNK_JSON } = {}): Buffer
{
  const text = Buffer.from(JSON.stringify(json), 'utf8');
  const padded = Buffer.concat([text, Buffer.alloc((4 - (text.length % 4)) % 4, 0x20)]);
  const header = Buffer.alloc(20);

  header.writeUInt32LE(magic, 0);
  header.writeUInt32LE(version, 4);
  header.writeUInt32LE(20 + padded.length, 8);
  header.writeUInt32LE(padded.length, 12);
  header.writeUInt32LE(chunk_type, 16);

  return Buffer.concat([header, padded]);
}
