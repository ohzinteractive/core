export { resource_container as ResourceContainer };
export type Resource = Object3D | Texture;
declare const resource_container: ResourceContainer;
import { Object3D } from "three/src/core/Object3D";
import { Texture } from "three/src/textures/Texture";
/**
 * @typedef {Object3D | Texture} Resource
 */
declare class ResourceContainer {
    init(): void;
    /** @type {Record<string, Resource>} */
    resources: Record<string, Resource>;
    /** @type {Record<string, any>} */
    resources_by_url: Record<string, any>;
    /**
     * @param {string} name
     * @param {string} url
     * @param {Resource} resource
     */
    set_resource(name: string, url: string, resource: Resource): void;
    /**
     * @param {string} name
     */
    get_resource(name: string): Resource;
    /**
     * @param {string} name
     */
    get(name: string): Resource;
}
