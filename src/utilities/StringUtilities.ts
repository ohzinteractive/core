class StringUtilities
{
  constructor()
  {}

  static get_random_color()
  {
    const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let hex = '#';

    for (let i = 0; i < 6; i++)
    {
      const index = Math.floor(Math.random() * hexValues.length);
      hex += hexValues[index];
    }

    return hex;
  }

  static capitalize(string: any)
  {
    const words = string.split(' ');

    for (let i = 0; i < words.length; i++)
    {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
  }

  static capitalize_first_letter(string: any)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static snake_to_camelcase(string: any)
  {
    return string.toLowerCase().replace(/[-_][a-z0-9]/g, (group: any) => group.slice(-1).toUpperCase());
  }
}

export { StringUtilities };
