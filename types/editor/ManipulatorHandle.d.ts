export class ManipulatorHandle extends Object3D<import("three").Object3DEventMap> {
    constructor(direction: any, color: any, input: any);
    input: any;
    arrow_helper: ArrowHelper;
    box_collider: Mesh<BoxGeometry, MeshBasicMaterial, import("three").Object3DEventMap>;
    direction: any;
    raycaster: Raycaster;
    raycast_result: import("three").Intersection<Object3D<import("three").Object3DEventMap>>[];
    tmp_p1: Vector3;
    tmp_p2: Vector3;
    tmp_v2: Vector2;
    half_unit_vec: Vector3;
    is_mouse_over(): boolean;
    get_normalized_screen_direction(): Vector2;
}
import { Object3D } from "three/src/core/Object3D";
import { ArrowHelper } from "three/src/helpers/ArrowHelper";
import { BoxGeometry } from "three/src/geometries/BoxGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { Raycaster } from "three/src/core/Raycaster";
import { Vector3 } from "three/src/math/Vector3";
import { Vector2 } from "three/src/math/Vector2";
