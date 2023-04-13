import fs from 'fs';
import path from 'path';

class CalculateSizes
{
  create_sizes_file()
  {
    this.logger = fs.createWriteStream('../.env');
  }

  async read_folder(folder)
  {
    try
    {
      const files = await fs.promises.readdir(folder);

      for (const file of files)
      {
        // Get the full paths
        const file_path = path.join(folder, file);

        // Stat the file to see if we have a file or dir
        const stat = await fs.promises.stat(file_path);

        if (stat.isFile())
        {
          // Save size in .env file
          if (!file.startsWith('_') && !file.startsWith('.'))
          {
            const split_path = file_path.split('/');
            split_path.shift();

            const file_name = split_path.pop();
            const parent = split_path.pop();

            const normalized_path = parent ? [parent, file_name].join('-') : file_name;

            if (this.wrong_file_name(file_name))
            {
              console.log(`\x1b[33m Wrong name format found: ${file_name} \x1b[0m`);
            }

            this.logger.write(`${normalized_path}=${stat.size}\n`);
          }
        }
        else if (stat.isDirectory())
        {
          this.read_folder(file_path);
        }
      }
    }
    catch (e)
    {
      console.error('We\'ve thrown! Whoops!', e);
    }
  }

  wrong_file_name(file_name)
  {
    return this.contains_uppercase(file_name) ||
            file_name.includes('-') ||
            file_name.includes(' ');
  }

  contains_uppercase(str)
  {
    return /[A-Z]/.test(str);
  }
}

const calculate_sizes = new CalculateSizes();

calculate_sizes.create_sizes_file();
calculate_sizes.read_folder('../public');
