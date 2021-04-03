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
