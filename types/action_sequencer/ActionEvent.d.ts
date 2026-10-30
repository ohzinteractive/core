declare class ActionEvent {
    args: string;
    method: string;
    name: string;
    constructor(name: string, method: string, args?: string);
    trigger(): void;
}
export { ActionEvent };
