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