import * as THREE from 'three';

class SceneManager
{
  constructor()
  {
    this._current = new THREE.Scene();
    this._current.name = 'default_scene';
  }

  add_scene(name)
  {

  }

  get current()
  {
    return this._current;
  }

  set current(scene)
  {
    this._current = scene;
  }
}

const scene_manager = new SceneManager();
module.exports = scene_manager;
