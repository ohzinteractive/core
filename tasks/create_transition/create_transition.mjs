import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';

class TransitionCreator
{
  constructor()
  {
  }

  create_view(from_view_name, to_view_name)
  {
    const json_name = `${from_view_name}_to_${to_view_name}`;
    const transition_data_path = path.join('..', 'app', 'data', 'custom_transitions', `${json_name}.json`);

    this.__copy_template_data(transition_data_path);
    this.__update_transitions_file(from_view_name, to_view_name);
  }

  __update_transitions_file(from_view_name, to_view_name)
  {
    const file_path = path.join('..', 'app', 'js', 'views', to_view_name.toLowerCase(), `${this.capitalize(to_view_name)}TransitionController.js`);
    const json_name = `${from_view_name.toLowerCase()}_to_${to_view_name.toLowerCase()}`;

    const view_manager_import = 'import { TransitionManager } from \'ohzi-core\';';

    const options_1 = {
      files: file_path,
      from: '// import { TransitionManager } from \'ohzi-core\';',
      to: view_manager_import
    };

    const sections_import = 'import { Sections } from \'../Sections\';';

    const options_2 = {
      files: file_path,
      from: '// import { Sections } from \'../Sections\';',
      to: sections_import
    };

    const new_import = `TransitionController';\nimport ${json_name} from '../../../data/custom_transitions/${json_name}.json';`;

    const options_3 = {
      files: file_path,
      from: 'TransitionController\';',
      to: new_import
    };

    const new_data = `// __CUSTOM_TRANSITIONS__
    TransitionManager.add_transitions([
      {
        from: Sections.${from_view_name.toUpperCase()},
        to: Sections.${to_view_name.toUpperCase()},
        data: ${json_name}
      }
    ]);`;

    const options_4 = {
      files: file_path,
      from: '// __CUSTOM_TRANSITIONS__',
      to: new_data
    };

    try
    {
      replace.sync(options_1);
      replace.sync(options_2);
      replace.sync(options_3);
      replace.sync(options_4);

      console.log('\x1b[33m', `${file_path} Modified`);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }

  __copy_template_data(data_path)
  {
    fs.copyFileSync(
      path.join('tasks', 'create_transition', 'template.json'),
      data_path
    );

    console.log('\x1b[32m', `${data_path} Created`);

    // this.__replace_data_words(data_path, name);
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

  // __replace_data_words(path, name)
  // {
  //   const options = {
  //     files: path,
  //     from: 'template',
  //     to: name
  //   };

  //   try
  //   {
  //     replace.sync(options);

  //     console.log('\x1b[32m', `${path} Created`);
  //   }
  //   catch (error)
  //   {
  //     console.error('Error occurred:', error);
  //   }
  // }

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

new TransitionCreator().create_view(process.argv.slice(2)[0], process.argv.slice(2)[1]);
