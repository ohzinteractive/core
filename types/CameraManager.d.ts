import { Camera } from "three";

export class CameraManager {
    static init(): void;
    static _current: Camera;
    static set current(arg: Camera);
    static get current(): Camera;
}
