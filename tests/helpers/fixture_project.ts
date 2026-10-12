import fs from 'fs';
import path from 'path';

export function EMPTY_OBJECTS(variable: string): string
{
  return `export const ${variable} = [
  // {
  //   name: 'cube',
  //   url: '/models/cube.glb',
  //   size: 12192,
  //   draco: false
  // }
];
`;
}

// A scene shaped like the boilerplate's HomeScene: it already has a camera
// field and imports Grid, so name collisions can be tested against it.
export const SCENE = `import { CommonScene } from './common/CommonScene';

import { Grid, PerspectiveCamera } from 'ohzi-core';
// __OBJECT_IMPORTS__

export class HomeScene extends CommonScene
{
  camera: PerspectiveCamera;
  // __OBJECT_FIELDS__

  init()
  {
    this.add(new Grid());
  }

  on_assets_ready()
  {
    super.on_assets_ready();

    // __OBJECTS__
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();

    // __HIGH_OBJECTS__
  }
}
`;

export function write(root: string, relative: string, contents: string | Buffer): void
{
  const target = path.join(root, relative);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

export function read(root: string, relative: string): string
{
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

export function exists(root: string, relative: string): boolean
{
  return fs.existsSync(path.join(root, relative));
}

export function make_project(root: string, { scene = SCENE }: { scene?: string } = {}): void
{
  write(root, 'app/data/assets/home/home_objects.js', EMPTY_OBJECTS('home_objects'));
  write(root, 'app/data/assets/home/high/home_high_objects.js', EMPTY_OBJECTS('home_high_objects'));
  write(root, 'app/js/scenes/HomeScene.ts', scene);
}
