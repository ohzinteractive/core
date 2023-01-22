class StringUtilities
{
  constructor()
  {}

  static capitalize(string)
  {
    const words = string.split(' ');

    for (let i = 0; i < words.length; i++)
    {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
  }

  static capitalize_first_letter(string)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static snake_to_camelcase(string)
  {
    return string.replace(
      /([-_][a-z])/g,
      (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
  }
}

export { StringUtilities };
