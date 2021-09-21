export default class MedianFilter {
    constructor(renderer: any);
    RT: any;
    RT1: any;
    median_filter_mat: MedianFilterMaterial;
    filter(texture: any): any;
    get_size(tex: any): any;
}
import MedianFilterMaterial from "../materials/MedianFilterMaterial";
