import fs from 'fs';
import path from 'path';

import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const input = fs.existsSync('src/index.ts') ? 'src/index.ts' : 'src/index.tsx';
const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);
const extensions = ['.ts', '.js', '.tsx', '.jsx'];

export default defineConfig({
  input,
  output: [
    {
      file: 'lib/index.cjs.js',
      format: 'cjs',
      exports: 'default',
    },
    {
      file: 'lib/index.esm.js',
      format: 'esm',
    },
  ],
  external,
  plugins: [
    nodeResolve({ extensions }),
    typescript({ tsconfig: 'tsconfig.json' }),
    babel({ extensions, babelHelpers: 'bundled' }),
    commonjs(),
  ],
});
