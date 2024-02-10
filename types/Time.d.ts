export { time as Time };
declare const time: Time;
declare class Time {
    __delta_buffer: number[];
    init(): void;
    ___time: any;
    __delta_time: any;
    __smooth_delta_time: any;
    __elapsed_time: any;
    __allocated_time: any;
    __frame_interpolation_t: any;
    fixed_delta_time: number;
    get elapsed_time(): any;
    get delta_time(): any;
    get smooth_delta_time(): any;
    get shader_time(): any;
    get frame_interpolation(): any;
    get fdt(): number;
    get dt(): any;
    get sdt(): any;
    to_json(): {
        elapsed_time: any;
        delta_time: any;
        smooth_delta_time: any;
    };
    __set_frame_interpolation(value: any): void;
    __update(): void;
    __calculate_smooth_delta_time(): void;
}
