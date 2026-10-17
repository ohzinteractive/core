import { Scene } from 'three';
import { capitalize, sanitize_name } from '../_shared/scaffolding.mjs';

const IDENTIFIER = /^[a-z][a-z0-9_]*$/;

const RESERVED = new Set([
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
  'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'implements', 'import',
  'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private', 'protected', 'public',
  'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while',
  'with', 'yield', 'constructor', 'arguments', 'eval', 'undefined'
]);

// Browser globals that node does not define, plus what the generated class
// file itself imports. A class with one of these names would shadow it.
const TAKEN_CLASS_NAMES = new Set([
  'Image', 'Audio', 'Option', 'Text', 'Node', 'Element', 'Event', 'Document', 'Window', 'Location',
  'History', 'Screen', 'Worker', 'Blob', 'File', 'Request', 'Response', 'Headers', 'Storage',
  'ResourceContainer', 'Object3D'
]);

// Every property and method a three.js Scene has, from the instance up through
// Object3D to Object.prototype. A field named like one of them would replace it.
function scene_members()
{
  const names = new Set();
  let current = new Scene();

  while (current !== null)
  {
    for (const name of Object.getOwnPropertyNames(current))
    {
      names.add(name);
    }

    current = Object.getPrototypeOf(current);
  }

  return names;
}

const SCENE_MEMBERS = scene_members();

function validate_identifier(raw, label)
{
  const name = sanitize_name(raw);

  if (name.length === 0)
  {
    throw new Error(`a ${label} is required.`);
  }

  if (!IDENTIFIER.test(name))
  {
    throw new Error(`"${name}" is not a valid ${label}: it must start with a letter and use only a-z, 0-9 and _.`);
  }

  return name;
}

function class_name(name)
{
  return capitalize(name);
}

function validate_object_name(raw)
{
  const name = validate_identifier(raw, 'model name');

  if (RESERVED.has(name))
  {
    throw new Error(`"${name}" is a reserved word, so it cannot be a model name. Pass a different name.`);
  }

  if (SCENE_MEMBERS.has(name))
  {
    throw new Error(`"${name}" cannot be a model name: scenes already have a member called ${name}, and this.${name} would replace it. Pass a different name.`);
  }

  const pascal = class_name(name);

  // Case-insensitive: object3d becomes Object3d, which still reads as Object3D.
  const taken = [...TAKEN_CLASS_NAMES].some((taken_name) => taken_name.toLowerCase() === pascal.toLowerCase());

  if (pascal in globalThis || taken)
  {
    throw new Error(`"${name}" cannot be a model name: its class name ${pascal} would shadow an existing ${pascal}. Pass a different name.`);
  }

  return name;
}

function validate_scene_name(raw)
{
  return validate_identifier(raw, 'scene name');
}

export { class_name, validate_object_name, validate_scene_name };
