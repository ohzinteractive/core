export { configuration as Configuration };
declare const configuration: Configuration;
declare class Configuration {
    init(parameters?: {}): void;
    dpr: number;
    app: {};
    from_json(json: any): void;
}
