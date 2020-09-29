export default class Pool
{
  constructor()
  {
    this.available = [];
    this.busy = [];
  }

  preload(starting_pool_size)
  {
    for (let i = 0; i < starting_pool_size; i++)
    {
      this.instantiate();
    }
  }

  instantiate()
  {
    let obj = this.__create();
    if (obj === undefined)
    {
      console.error('Class ' + this.constructor.name + ' does not implement __create() method correctly. It should return a new instance of the pooled object', obj);
    }
    if (obj.warm_up === undefined)
    {
      console.error('Class ' + obj.constructor.name + ' does not implement warm_up() method needed to allow pooling', obj);
    }
    if (obj.tier_down === undefined)
    {
      console.error('Class ' + obj.constructor.name + ' does not implement tier_down() method needed to allow pooling', obj);
    }
    this.available.push(obj);
  }

  get()
  {
    if (this.available.length === 0)
    {
      this.instantiate();
    }

    let obj = this.available.pop();
    this.busy.push(obj);
    obj.warm_up();
    return obj;
  }

  release(obj)
  {
    let index = this.busy.indexOf(obj);
    if (index > -1)
    {
      this.busy.splice(index, 1);
      this.available.push(obj);
      obj.tier_down();
    }
  }

  release_all()
  {
    while (this.busy.length > 0)
    {
      this.release(this.busy[0]);
    }
  }

  // @override this one when subclassing
  // must return a new instance
  __create()
  {
    console.error('__create not implemented');
  }
}
