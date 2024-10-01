export { time as Time };
declare const time: Time;
declare class Time {
    __delta_buffer: number[];
    init(): void;
    ___time: Clock;
    __delta_time: number;
    __smooth_delta_time: any;
    __elapsed_time: number;
    __allocated_time: Vector2;
    __frame_interpolation_t: number;
    fixed_delta_time: number;
    get elapsed_time(): number;
    get delta_time(): number;
    get smooth_delta_time(): any;
    get shader_time(): Vector2;
    get frame_interpolation(): number;
    get fdt(): number;
    get dt(): number;
    get sdt(): any;
    /**
     * @param {number} value
     */
    __set_frame_interpolation(value: number): void;
    __update(): void;
    __calculate_smooth_delta_time(): void;
}
import { Clock } from "three/src/core/Clock";
import { Vector2 } from "three/src/math/Vector2";
