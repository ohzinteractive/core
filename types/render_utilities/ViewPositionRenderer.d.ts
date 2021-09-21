export default class ViewPositionRenderer {
    RT: any;
    clear_color: any;
    render_pos_mat: ViewPositionMaterial;
    render(context: any, renderer: any): void;
    get render_target(): any;
}
import ViewPositionMaterial from "../materials/ViewPositionMaterial";
