export { time as Time };
declare const time: Time;
declare class Time {
    delta_buffer: number[];
    init(): void;
    ___time: any;
    __raw_delta_time: any;
    __elapsed_time: any;
    __allocated_time: any;
    delta_time: any;
    get elapsed_time(): any;
    get shader_time(): any;
    __update(): void;
    __calculate_delta_time(): void;
}
