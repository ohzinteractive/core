export class Compilator
{
    finished: boolean;

    start()
    {
        this.finished = false;
    }

    update()
    {
        this.finished = true;
    }
}

// Compilators are handed around as classes and instantiated by the loading states,
// each subclass taking its own constructor arguments.
export type CompilatorConstructor = new (...args: any[]) => Compilator;
