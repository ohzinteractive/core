class CompilatorManager
{
  constructor(compilators)
  {
    this.compilators = compilators;
    this.first_update = true;

    this.index = 0;
  }

  update()
  {
    if (!this.is_finished())
    {
      if (this.compilators[this.index].finished)
      {
        this.index++;
        this.first_update = true;
      }
      else
      {
        if (this.first_update)
        {
          this.compilators[this.index].start();
          this.first_update = false;
        }
        else
        {
          this.compilators[this.index].update();
        }
      }
    }
  }

  is_finished()
  {
    return this.index === this.compilators.length;
  }
}

export { CompilatorManager };
