export interface Vector2 {
    x: number;
    y: number;
    set(x: number, y: number): this;
    clone(): Vector2;
    copy(v: {
        x: number;
        y: number;
    }): this;
    add(v: {
        x: number;
        y: number;
    }): this;
    sub(v: {
        x: number;
        y: number;
    }): this;
    multiplyScalar(scalar: number): this;
    divide(v: {
        x: number;
        y: number;
    }): this;
    divideScalar(scalar: number): this;
    dot(v: {
        x: number;
        y: number;
    }): number;
    cross(v: {
        x: number;
        y: number;
    }): number;
    lengthSq(): number;
    length(): number;
    normalize(): this;
    angle(): number;
    distanceTo(v: {
        x: number;
        y: number;
    }): number;
    distanceToSquared(v: {
        x: number;
        y: number;
    }): number;
    lerp(v: {
        x: number;
        y: number;
    }, alpha: number): this;
}
