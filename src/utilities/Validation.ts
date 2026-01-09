class Validation
{
  constructor()
  {}

  static is_int(n: any)
  {
    return Number(n) === n && n % 1 === 0;
  }

  static is_float(n: any)
  {
    return Number(n) === n && n % 1 !== 0;
  }

  static is_number(n: any)
  {
    return this.is_int(n) || this.is_float(n);
  }

  static is_json(str: any)
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
