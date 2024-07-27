import * as esbuild from 'esbuild';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'fs';
import { basename, join } from 'path';

const outdir = './bin';
const entryPoints = [`./source/main.ts`, './source/index.ts'];

if (existsSync(outdir)) {
  console.log('- Clearing our previous build\n');
  rmSync(outdir, { recursive: true });
}
mkdirSync(outdir);

for (const entrypoint of entryPoints) {
  console.log(`- Building ${entrypoint}`);
  const outfile = join(outdir, basename(entrypoint).replace('.ts', '.js'));
  const outfileMetadata = `${outfile}.metadata.json`;
  const result = esbuild.buildSync({
    entryPoints: [entrypoint],
    bundle: true,
    outfile: join(outdir, basename(entrypoint).replace('.ts', '.js')),
    minify: true,
    keepNames: true,
    treeShaking: true,
    target: 'es2020',
    format: 'cjs',
    platform: 'node',
    external: ['esbuild'],
    sourcemap: true,
    metafile: true,
    mainFields: ['module', 'main']
  });
  writeFileSync(outfileMetadata, JSON.stringify(result.metafile));

  // Add shebang to the index.js
  if (entrypoint.includes('index.ts')) {
    writeFileSync(
      outfile,
      '#!/usr/bin/env node\n\n' + readFileSync(outfile, { encoding: 'utf-8' }),
      { encoding: 'utf-8' }
    );
    chmodSync(outfile, 0o777);
  }

  const analytisResult = esbuild
    .analyzeMetafileSync(JSON.stringify(result.metafile))
    .split('\n');
  console.log(analytisResult.slice(0, 10).join('\n'));
  console.log(`   ... and ${analytisResult.length - 11} more`);
  console.log();
}
