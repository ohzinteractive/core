import path from 'path';
import fs from 'fs';
import replace from 'replace-in-file';

class ViewCreator
{
  constructor()
  {
  }

  create_view(name)
  {
    const js_folder = path.join('..', 'app', 'js', 'views', name);
    const js_transition_path = path.join(js_folder, `${this.capitalize(name)}TransitionController.js`);
    const js_scene_path = path.join(js_folder, `${this.capitalize(name)}SceneController.js`);
    const js_view_path = path.join(js_folder, `${this.capitalize(name)}View.js`);

    const transition_data_path = path.join('..', 'app', 'data', 'transitions', `${name}.json`);

    const pug_folder = path.join('..', 'app', 'views', name);
    const pug_path = path.join(pug_folder, `${name}.pug`);

    const scss_folder = path.join('..', 'app', 'css', name);
    const scss_path = path.join(scss_folder, `_${name}.scss`);

    this.__copy_template_js(js_folder, js_transition_path, name, 'TransitionController');
    this.__copy_template_js(js_folder, js_scene_path, name, 'SceneController');
    this.__copy_template_js(js_folder, js_view_path, name, 'View');

    this.__copy_template_data(transition_data_path, name);
    this.__copy_template_pug(pug_folder, pug_path, name);
    this.__copy_template_scss(scss_folder, scss_path, name);

    this.__update_default_data_file(name);
    this.__update_index_pug_file(name);
    this.__update_application_scss_file(name);
    this.__update_general_loader_file(name);
    this.__update_sections_file(name);
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
    const new_data = `__SECTIONS__\n@import '${name}/${name}';`;
    const file_path = path.join('..', 'app', 'css', 'application.scss');

    const options = {
      files: file_path,
      from: '__SECTIONS__',
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
    const new_data = `__SECTIONS__\n      include views/${name}/${name}`;
    const file_path = path.join('..', 'app', 'index.pug');

    const options = {
      files: file_path,
      from: '__SECTIONS__',
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

  __update_general_loader_file(name)
  {
    const new_import = `home.json';\nimport ${name}_data from '../../data/transitions/${name}.json';`;
    const file_path = path.join('..', 'app', 'js', 'loaders', 'GeneralLoader.js');

    const options_1 = {
      files: file_path,
      from: 'home.json\';',
      to: new_import
    };

    const new_data = `__SECTIONS_DATA__\n    ResourceContainer.set_resource('${name}_data', 'data/${name}.json', ${name}_data);`;

    const options_2 = {
      files: file_path,
      from: '__SECTIONS_DATA__',
      to: new_data
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);

      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __update_mainapp_file(name)
  {
    const new_import = `HomeView';\nimport { ${this.capitalize(name)}View } from './views/${name}/${this.capitalize(name)}View';`;
    const file_path = path.join('..', 'app', 'js', 'MainApplication.js');

    const options_1 = {
      files: file_path,
      from: 'HomeView\';',
      to: new_import
    };

    const new_section = `HomeView();\n    this.${name.toLowerCase()}_view = new ${this.capitalize(name)}View();`;

    const options_2 = {
      files: file_path,
      from: 'HomeView();',
      to: new_section
    };

    const new_section_start = `home_view.start();\n    this.${name.toLowerCase()}_view.start();`;

    const options_3 = {
      files: file_path,
      from: 'home_view.start();',
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

  __update_sections_file(name)
  {
    const new_section = `'initial',\n  ${name.toUpperCase()}: '${name.toLowerCase()}',`;
    const new_section_url = `'/initial',\n  ${name.toUpperCase()}: '/${name.replace(/_/g, '-')}',`;
    const file_path = path.join('..', 'app', 'js', 'views', 'Sections.js');

    const options_1 = {
      files: file_path,
      from: '\'initial\',',
      to: new_section
    };

    const options_2 = {
      files: file_path,
      from: '\'/initial\',',
      to: new_section_url
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);
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
          path.join('tasks', 'create_view', `Template${file_type}.js`),
          view_path
        );

        this.__replace_js_words(view_path, name);
      }
    });
  }

  __copy_template_data(data_path, name)
  {
    fs.copyFileSync(
      path.join('tasks', 'create_view', 'template.json'),
      data_path
    );

    this.__replace_data_words(data_path, name);
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
          path.join('tasks', 'create_view', '_template.scss'),
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
          path.join('tasks', 'create_view', 'template.pug'),
          pug_path
        );

        this.__replace_pug_words(pug_path, name);
      }
    });
  }

  __replace_data_words(path, name)
  {
    const options = {
      files: path,
      from: 'template',
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
      from: 'template',
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
    let aux_string = this.capitalize_first_letter(string);
    aux_string = this.snake_to_camelcase(aux_string);

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

new ViewCreator().create_view(process.argv.slice(2)[0]);
