export class ActionEvent {
    /**
     * @param {string} name
     * @param {string} method
     * @param {string} args
     */
    constructor(name: string, method: string, args: string);
    name: string;
    method: string;
    args: string;
    trigger(): void;
}
