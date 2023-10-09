
class WorkerToMain
{
  constructor()
  {
    // TODO: Use SharedArrayBuffer?
    this.methods = [];
    this.args = [];
  }

  push(method, args = [])
  {
    this.methods.push(method);
    this.args.push(args);
  }

  clear()
  {
    this.methods = [];
    this.args = [];
  }
}

const worker_to_main = new WorkerToMain();
export { worker_to_main as WorkerToMain };
