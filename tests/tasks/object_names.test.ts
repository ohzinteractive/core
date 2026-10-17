import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs scaffolder script
import { class_name, validate_object_name, validate_scene_name } from '../../tasks/import_model/object_names.mjs';

describe('validate_object_name', () =>
{
  it('sanitizes a file name into snake case', () =>
  {
    expect(validate_object_name('Office Chair-v2')).toBe('office_chair_v2');
  });

  it('strips path characters, so a name can never leave its folder', () =>
  {
    expect(validate_object_name('../../etc/passwd')).toBe('etcpasswd');
  });

  it('refuses an empty name', () =>
  {
    expect(() => validate_object_name('!!!')).toThrowError(/model name is required/);
  });

  it('refuses a name that starts with a digit', () =>
  {
    expect(() => validate_object_name('2chairs')).toThrowError(/must start with a letter/);
  });

  it('refuses reserved words', () =>
  {
    expect(() => validate_object_name('class')).toThrowError(/reserved word/);
    expect(() => validate_object_name('constructor')).toThrowError(/reserved word|member/);
  });

  it('refuses names that would overwrite a scene member', () =>
  {
    for (const name of ['position', 'scale', 'children', 'add', 'name', 'visible'])
    {
      expect(() => validate_object_name(name), name).toThrowError(/scenes already have a member/);
    }
  });

  it('refuses names whose class would shadow a global or the class file imports', () =>
  {
    for (const name of ['map', 'promise', 'image', 'audio', 'object3d', 'resource_container'])
    {
      expect(() => validate_object_name(name), name).toThrowError(/class name/);
    }
  });

  it('accepts ordinary model names', () =>
  {
    for (const name of ['chair', 'office_chair', 'tree2', 'car_body'])
    {
      expect(validate_object_name(name)).toBe(name);
    }
  });
});

describe('validate_scene_name', () =>
{
  it('accepts a scene folder name', () =>
  {
    expect(validate_scene_name('home')).toBe('home');
  });

  it('refuses an empty scene name', () =>
  {
    expect(() => validate_scene_name('')).toThrowError(/scene name is required/);
  });
});

describe('class_name', () =>
{
  it('turns snake case into PascalCase', () =>
  {
    expect(class_name('office_chair')).toBe('OfficeChair');
    expect(class_name('chair')).toBe('Chair');
  });
});
