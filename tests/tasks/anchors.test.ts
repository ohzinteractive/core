import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

// The scaffolders patch the application by searching for literal anchors. If an
// anchor is edited away the scaffolder silently skips that step and produces a
// half-wired feature, which is exactly what happened to the GeneralLoader
// transition-data patch. These tests fail loudly instead.
//
// core is normally a submodule of the boilerplate; when it is checked out on
// its own there is no application to check and the guard stands down.
const root = path.resolve(__dirname, '../../..');
const has_app = fs.existsSync(path.join(root, 'app', 'js', 'MainApplication.ts'));

function contents(relative: string): string
{
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

const ANCHORS: Array<[string, string, string]> = [
  ['create-view', 'app/data/default_state_data.js', 'loader_opacity: 0,'],
  ['create-view', 'app/css/application.scss', '__SECTIONS__'],
  ['create-view', 'index.pug', '__SECTIONS__'],
  ['create-view', 'app/js/views/Sections.ts', "'initial',"],
  ['create-view', 'app/js/views/Sections.ts', "'/initial',"],
  ['create-view', 'app/js/MainApplication.ts', "HomeView';"],
  ['create-view', 'app/js/MainApplication.ts', 'home_view: HomeView;'],
  ['create-view', 'app/js/MainApplication.ts', 'HomeView();'],
  ['create-view', 'app/js/MainApplication.ts', 'home_view.start();']
];

describe.skipIf(!has_app)('scaffolder anchors still exist in the application', () =>
{
  for (const [script, file, anchor] of ANCHORS)
  {
    it(`${script}: ${file} still contains ${JSON.stringify(anchor)}`, () =>
    {
      expect(contents(file)).toContain(anchor);
    });
  }
});
