export default class NormalAORender extends BaseRender {
    ssao_mat: SSAOMaterial;
    ssao_compose_mat: SSAOComposeMaterial;
    debug_normals: DisplayNormalTextureMaterial;
    ssaa: number;
    main_RT: any;
    SSAO_RT: any;
    blurrer: Blurrer;
    __update_uniforms(): void;
    __check_RT_size(): void;
}
import BaseRender from "../render_mode/BaseRender";
import SSAOMaterial from "../materials/SSAOMaterial";
import SSAOComposeMaterial from "../materials/SSAOComposeMaterial";
import DisplayNormalTextureMaterial from "../materials/DisplayNormalTextureMaterial";
import Blurrer from "../render_utilities/Blurrer";
