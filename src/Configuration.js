/*

  A configuration class used as a singleton

*/

import { Color } from 'three';

class Configuration
{
  constructor(parameters = {})
  {
    this.dpr = 1;

    this.app  = {}; // for arbitrary use in end application
  }


  from_json(json)
  {

  }
}

export default new Configuration();
