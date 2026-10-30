declare class Time {
    __delta_buffer: number[];
    __delta_time: number;
    __elapsed_time: number;
    __frame_interpolation_t: number;
    __previous_elapsed_time: number;
    __smooth_delta_time: number;
    fixed_delta_time: number;
    constructor();
    init(): void;
    get elapsed_time(): number;
    get delta_time(): number;
    get smooth_delta_time(): number;
    get frame_interpolation(): number;
    get fdt(): number;
    get dt(): number;
    get sdt(): number;
    __set_frame_interpolation(value: number): void;
    __update(elapsed_time: number): void;
    __calculate_smooth_delta_time(): void;
}
declare const time: Time;
export { time as Time };
