export class ActionEvent {
    constructor(name: string, method: string, args: string);
    name: string;
    method: string;
    args: string;
    trigger(): void;
}
