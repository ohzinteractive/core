import { BaseRender } from '../render_mode/BaseRender';
declare class VRRender extends BaseRender {
    constructor();
    render(): void;
    render_spectator_camera(): void;
}
export { VRRender };
