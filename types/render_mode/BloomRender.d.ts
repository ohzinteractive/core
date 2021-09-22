export class BloomRender extends BaseRender {
    bloom_compose_mat: BloomComposeMaterial;
    main_RT: any;
    blur_RT: any;
    blurrer: Blurrer;
    __check_RT_size(): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { BloomComposeMaterial } from "../materials/BloomComposeMaterial";
import { Blurrer } from "../render_utilities/Blurrer";
