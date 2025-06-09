import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
        declaration: true,
        declarationDir: './dist/types',
      }),
      postcss({
        plugins: [tailwindcss('./tailwind.config.js'), autoprefixer()],
        extract: path.resolve('dist/styles.css'),
        minimize: true,
        inject: false,
        extensions: ['.css'],
        include: ['**/*.css'], // This will include your global.css
        modules: false,
        autoModules: false,
        writeDefinitions: false,
        sourceMap: true,
      }),
    ],
    external: ['react', 'react-dom', 'tailwind-merge'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
