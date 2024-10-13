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

      const exclude_folders = this.get_exclude_folders(process.argv[2]);

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
            const split_path = file_path.split(path.sep);
            split_path.shift();

            const file_name = split_path.pop();
            const parent = split_path.pop();

            let normalized_path = parent ? [parent, file_name].join('_') : file_name;
            normalized_path = normalized_path.replace(/\./g, '_').toUpperCase();

            if (this.wrong_file_name(file_name))
            {
              console.log(`\x1b[33m Wrong name format found: ${file_name} \x1b[0m`);
            }

            this.logger.write(`OHZI_${normalized_path}=${stat.size}\n`);
          }
        }
        else if (stat.isDirectory())
        {
          const split_path = file_path.split(path.sep);
          const folder_name = split_path.pop();

          if (!exclude_folders.includes(folder_name))
          {
            this.read_folder(file_path);
          }
        }
      }
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }

  get_exclude_folders(exclude_folders_string)
  {
    let exclude_folders = [];

    if (exclude_folders_string)
    {
      exclude_folders = exclude_folders_string.split(',');
    }

    return exclude_folders;
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
