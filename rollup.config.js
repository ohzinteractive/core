import glslify from 'rollup-plugin-glslify';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'build/index.module.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      glslify(),
      sourcemaps(),
      terser()
    ],
    external: [
      'three',
      'pit-js',
      'three/examples/jsm/utils/BufferGeometryUtils.js',
      'three/examples/jsm/loaders/GLTFLoader.js',
      'three/examples/jsm/loaders/ColladaLoader.js',
      'three/examples/jsm/loaders/OBJLoader.js',
      'three/examples/jsm/loaders/RGBELoader.js',
      'three/examples/jsm/loaders/HDRCubeTextureLoader.js',
      'three/examples/jsm/loaders/DRACOLoader.js'
    ]
  }
//   {
//     input: './src/blitter_index.js',
//     output: [
//       {
//         file: 'build_blitter/index.module.js',
//         format: 'es',
//         sourcemap: true
//       }
//     ],
//     plugins: [
//       glslify(),
//       sourcemaps(),
//       terser()
//     ]
//   }
];
