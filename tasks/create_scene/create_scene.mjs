import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';

class SceneCreator
{
  constructor()
  {
  }

  create_scene(name)
  {
    const js_folder = path.join('..', 'app', 'js', 'scenes');
    const js_scene_path = path.join(js_folder, `${this.capitalize(name)}Scene.js`);

    const data_folder = path.join('..', 'app', 'data', 'assets', name);
    const objects_data_path = path.join(data_folder, `${name}_objects.js`);
    const sounds_data_path = path.join(data_folder, `${name}_sounds.js`);
    const textures_data_path = path.join(data_folder, `${name}_textures.js`);

    const data_high_folder = path.join('..', 'app', 'data', 'assets', name, 'high');
    const high_objects_data_path = path.join(data_high_folder, `${name}_high_objects.js`);
    const high_sounds_data_path = path.join(data_high_folder, `${name}_high_sounds.js`);
    const high_textures_data_path = path.join(data_high_folder, `${name}_high_textures.js`);

    this.__copy_template_js(js_folder, js_scene_path, name, 'Scene');

    this.__copy_template_data(data_folder, 'template_objects', objects_data_path, name);
    this.__copy_template_data(data_folder, 'template_sounds', sounds_data_path, name);
    this.__copy_template_data(data_folder, 'template_textures', textures_data_path, name);

    this.__copy_template_data(data_high_folder, 'template_high_objects', high_objects_data_path, name);
    this.__copy_template_data(data_high_folder, 'template_high_sounds', high_sounds_data_path, name);
    this.__copy_template_data(data_high_folder, 'template_high_textures', high_textures_data_path, name);

    // this.__update_scene_controller_file(name);
  }

  // __update_scene_controller_file(name)
  // {
  //   const new_import = `HomeScene';\nimport { ${this.capitalize(name)}Scene } from '../scenes/${this.capitalize(name)}Scene';`;
  //   const file_path = path.join('..', 'app', 'js', 'components', 'SceneController.js');

  //   const options_1 = {
  //     files: file_path,
  //     from: 'HomeScene\';',
  //     to: new_import
  //   };

  //   const new_section = `HomeScene();\n    this.${name.toLowerCase()}_scene = new ${this.capitalize(name)}Scene();`;

  //   const options_2 = {
  //     files: file_path,
  //     from: 'HomeScene();',
  //     to: new_section
  //   };

  //   const new_section_start = `this.scenes = [\n      this.${name.toLowerCase()}_scene,`;

  //   const options_3 = {
  //     files: file_path,
  //     from: 'this.scenes = [',
  //     to: new_section_start
  //   };

  //   try
  //   {
  //     replace.sync(options_1);
  //     replace.sync(options_2);
  //     replace.sync(options_3);
  //     console.log('\x1b[33m', `${file_path} Modified`);
  //   }
  //   catch (error)
  //   {
  //     console.error('Error occurred:', error);
  //   }
  // }

  __copy_template_js(js_folder, view_path, name, file_type)
  {
    fs.mkdir(js_folder, { recursive: true }, (err) =>
    {
      if (err)
      {
        console.error(err);
      }
      else
      {
        fs.copyFileSync(
          path.join('tasks', 'create_scene', `Template${file_type}.js`),
          view_path
        );

        this.__replace_js_words(view_path, name);
      }
    });
  }

  __copy_template_data(js_folder, template_name, data_path, name)
  {
    fs.mkdir(js_folder, { recursive: true }, (err) =>
    {
      if (err)
      {
        console.error(err);
      }
      else
      {
        fs.copyFileSync(
          path.join('tasks', 'create_scene', `${template_name}.js`),
          data_path
        );

        this.__replace_data_words(data_path, name);
      }
    });
  }

  __replace_data_words(path, name)
  {
    const options = {
      files: path,
      from: /template/g,
      to: name
    };

    try
    {
      replace.sync(options);

      console.log('\x1b[32m', `${path} Created`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __replace_js_words(path, name)
  {
    const options_1 = {
      files: path,
      from: /Template/g,
      to: this.capitalize(name)
    };

    const options_2 = {
      files: path,
      from: /TEMPLATE/g,
      to: name.toUpperCase()
    };

    const options_3 = {
      files: path,
      from: /template/g,
      to: name.replace(/_/g, '-')
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);
      replace.sync(options_3);

      console.log('\x1b[32m', `${path} Created`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  capitalize(string)
  {
    let aux_string = this.snake_to_camelcase(string);
    aux_string = this.capitalize_first_letter(aux_string);

    return aux_string;
  }

  capitalize_first_letter(string)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  snake_to_camelcase(string)
  {
    return string.toLowerCase().replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase());
  }
}

new SceneCreator().create_scene(process.argv.slice(2)[0]);
