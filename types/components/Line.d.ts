export default class Line {
    constructor(points: any);
    setup(points: any): void;
    _length: number;
    set thickness(arg: any);
    get thickness(): any;
    __get_previous_position(points: any, i: any): any;
    __get_next_position(points: any, i: any): any;
    update(): void;
    distance(): any;
    total_length(): any;
    dispose(): void;
    set color(arg: any);
    get color(): any;
    copy_color(col: any): void;
}
