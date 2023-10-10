export { worker_to_main as WorkerToMain };
declare const worker_to_main: WorkerToMain;
declare class WorkerToMain {
    methods: any[];
    args: any[];
    push(method: any, args?: any[]): void;
    clear(): void;
}
