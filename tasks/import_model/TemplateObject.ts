import { ResourceContainer } from 'ohzi-core';
import { Object3D } from 'three';

export class __CLASS__ extends Object3D
{
  constructor()
  {
    super();

    this.name = '__NAME__';
    this.add(ResourceContainer.get('__NAME__').scene);

    this.position.set(__POSITION__);
    this.rotation.set(__ROTATION__);
    this.scale.set(__SCALE__);
  }
}
