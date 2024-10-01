export class UIElement extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {string} [vert]
     * @param {string} [frag]
     */
    constructor(vert?: string, frag?: string);
    material: UIElementMaterial;
    is_clickable: boolean;
    /** @type {WorldSpacePosition | ScreenSpacePosition} */
    position_strategy: WorldSpacePosition | ScreenSpacePosition;
    current_state: OnIdle;
    _position: Vector3;
    _on_idle_state: OnIdle;
    _on_enter_state: OnMouseEnter;
    _on_exit_state: OnMouseExit;
    _on_hover_state: OnMouseHover;
    on_enter: any;
    on_exit: any;
    on_hover: any;
    mouse_pos_tmp: Vector2;
    cached_NDC_position: Vector2;
    screen_pos_tmp: Vector2;
    texture_size: Vector2;
    size: number;
    pixel_offset: Vector2;
    /**
     * @param {number} value
     */
    set_render_order(value: number): void;
    get pivot_point(): any;
    /**
     * @param {Vector2} offset
     */
    set_pixel_offset(offset: Vector2): void;
    /**
     *@param {UIElementState} new_state
     */
    set_state(new_state: UIElementState): void;
    set use_depth(arg: boolean);
    get use_depth(): boolean;
    set depth_offset(arg: any);
    get depth_offset(): any;
    clear_state(): void;
    set_world_space_coordinate_system(): void;
    set_screen_space_coordinate_system(): void;
    /**
     * @param {Texture} texture
     */
    set_texture(texture: Texture): void;
    /**
     * @param {Vector2} normalized_mouse_pos
     */
    update_state(normalized_mouse_pos: Vector2): void;
    /**
     * @param {Vector2} normalized_mouse_pos
     */
    is_mouse_over(normalized_mouse_pos: Vector2): boolean;
    /**
     * @param {Vector2} projected_pos
     */
    to_screen_position(projected_pos: Vector2): void;
    get_screen_space_position(): Vector2;
    /**
     * @param {Vector2} screen_pos
     */
    set_screen_space_position(screen_pos: Vector2): void;
    dispose(): void;
    /**
     * @param {Vector2} [vector2]
     */
    get_size(vector2?: Vector2): Vector2;
    on_mouse_enter(): void;
    on_mouse_exit(): void;
    on_mouse_hover(): void;
}
import { Mesh } from "three/src/objects/Mesh";
import { UIElementMaterial } from "../materials/UIElementMaterial";
import { WorldSpacePosition } from "../ui/ui_element_position/WorldSpacePosition";
import { ScreenSpacePosition } from "../ui/ui_element_position/ScreenSpacePosition";
import { OnIdle } from "../ui/ui_element_state/OnIdle";
import { Vector3 } from "three/src/math/Vector3";
import { OnMouseEnter } from "../ui/ui_element_state/OnMouseEnter";
import { OnMouseExit } from "../ui/ui_element_state/OnMouseExit";
import { OnMouseHover } from "../ui/ui_element_state/OnMouseHover";
import { Vector2 } from "three/src/math/Vector2";
import { UIElementState } from "../ui/ui_element_state/UIElementState";
import { Texture } from "three/src/textures/Texture";
