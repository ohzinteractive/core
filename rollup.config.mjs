import terser from '@rollup/plugin-terser';
import glslify from 'rollup-plugin-glslify';

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
      'three/examples/jsm/loaders/DRACOLoader.js',
      'three/examples/jsm/loaders/FontLoader.js'
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
//       terser()
//     ]
//   }
];
