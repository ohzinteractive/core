class Validation
{
  constructor()
  {}

  static is_int(n: number)
  {
    return Number(n) === n && n % 1 === 0;
  }

  static is_float(n: number)
  {
    return Number(n) === n && n % 1 !== 0;
  }

  static is_number(n: number)
  {
    return this.is_int(n) || this.is_float(n);
  }

  static is_json(str: string)
  {
    try
    {
      JSON.parse(str);
    }
    catch (e)
    {
      return false;
    }

    return true;
  }
}

export { Validation };
