import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';

class ComponentCreator
{
  constructor()
  {
  }

  create_component(name)
  {
    const js_folder = path.join('..', 'app', 'js', 'view_components', name);
    const js_scene_path = path.join(js_folder, `${this.capitalize(name)}SceneController.js`);
    const js_view_path = path.join(js_folder, `${this.capitalize(name)}Component.js`);

    const pug_folder = path.join('..', 'app', 'views', 'components', name);
    const pug_path = path.join(pug_folder, `${name}.pug`);

    const scss_folder = path.join('..', 'app', 'css', 'components', name);
    const scss_path = path.join(scss_folder, `_${name}.scss`);

    this.__copy_template_js(js_folder, js_scene_path, name, 'SceneController');
    this.__copy_template_js(js_folder, js_view_path, name, 'Component');

    this.__copy_template_pug(pug_folder, pug_path, name);
    this.__copy_template_scss(scss_folder, scss_path, name);

    this.__update_default_data_file(name);
    this.__update_index_pug_file(name);
    this.__update_application_scss_file(name);
    this.__update_components_file(name);
    this.__update_mainapp_file(name);
  }

  __update_default_data_file(name)
  {
    const new_data = `loader_opacity: 0,\n  ${name}_opacity: 0,`;
    const file_path = path.join('..', 'app', 'data', 'default_state_data.js');

    const options = {
      files: file_path,
      from: 'loader_opacity: 0,',
      to: new_data
    };

    try
    {
      replace.sync(options);
      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __update_application_scss_file(name)
  {
    const new_data = `__COMPONENTS__\n@import 'components/${name}/${name}';`;
    const file_path = path.join('..', 'app', 'css', 'application.scss');

    const options = {
      files: file_path,
      from: '__COMPONENTS__',
      to: new_data
    };

    try
    {
      replace.sync(options);
      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __update_index_pug_file(name)
  {
    const new_data = `__COMPONENTS__\n      include views/components/${name}/${name}`;
    const file_path = path.join('..', 'app', 'index.pug');

    const options = {
      files: file_path,
      from: '__COMPONENTS__',
      to: new_data
    };

    try
    {
      replace.sync(options);
      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __update_mainapp_file(name)
  {
    const new_import = `HomeView';\nimport { ${this.capitalize(name)}Component } from './view_components/${name}/${this.capitalize(name)}Component';`;
    const file_path = path.join('..', 'app', 'js', 'MainApplication.js');

    const options_1 = {
      files: file_path,
      from: 'HomeView\';',
      to: new_import
    };

    const new_section = `__COMPONENTS__\n    this.${name.toLowerCase()}_component = new ${this.capitalize(name)}Component();`;

    const options_2 = {
      files: file_path,
      from: '__COMPONENTS__',
      to: new_section
    };

    const new_section_start = `${this.capitalize(name)}Component();\n    this.${name.toLowerCase()}_component.start();`;

    const options_3 = {
      files: file_path,
      from: `${this.capitalize(name)}Component();`,
      to: new_section_start
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);
      replace.sync(options_3);
      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __update_components_file(name)
  {
    const new_section = `__COMPONENTS__\n  ${name.toUpperCase()}: '${name.toLowerCase()}',`;
    const file_path = path.join('..', 'app', 'js', 'view_components', 'Components.js');

    const options_1 = {
      files: file_path,
      from: '__COMPONENTS__',
      to: new_section
    };

    try
    {
      replace.sync(options_1);
      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

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
          path.join('tasks', 'create_component', `Template${file_type}.js`),
          view_path
        );

        this.__replace_js_words(view_path, name);
      }
    });
  }

  __copy_template_scss(scss_folder, scss_path, name)
  {
    fs.mkdir(scss_folder, { recursive: true }, (err) =>
    {
      if (err)
      {
        console.error(err);
      }
      else
      {
        fs.copyFileSync(
          path.join('tasks', 'create_component', '_template.scss'),
          scss_path
        );

        this.__replace_scss_words(scss_path, name);
      }
    });
  }

  __copy_template_pug(pug_folder, pug_path, name)
  {
    fs.mkdir(pug_folder, { recursive: true }, (err) =>
    {
      if (err)
      {
        console.error(err);
      }
      else
      {
        fs.copyFileSync(
          path.join('tasks', 'create_component', 'template.pug'),
          pug_path
        );

        this.__replace_pug_words(pug_path, name);
      }
    });
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

    const options_4 = {
      files: path,
      from: /template_opacity/g,
      to: `${name}_opacity`
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);
      replace.sync(options_3);
      replace.sync(options_4);

      console.log('\x1b[32m', `${path} Created`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __replace_scss_words(path, name)
  {
    const options = {
      files: path,
      from: 'template',
      to: `${name.replace(/_/g, '-')}`
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

  __replace_pug_words(path, name)
  {
    const options = {
      files: path,
      from: 'template',
      to: `${name.replace(/_/g, '-')}`
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

new ComponentCreator().create_component(process.argv.slice(2)[0]);
