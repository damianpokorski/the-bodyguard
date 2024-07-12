import * as esbuild from 'esbuild';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { basename, join, } from 'path';


const outdir = './bin';
const entryPoints = [
    `./source/main.ts`,
    './source/index.ts'
];

console.log("- Clearing our previous build\n");
rmSync(outdir, { recursive: true });
mkdirSync(outdir);

for (const entrypoint of entryPoints) {

    console.log(`- Building ${entrypoint}`);
    const outfile = join(outdir, basename(entrypoint).replace(".ts", ".js"));
    const outfileMetadata = `${outfile}.metadata.json`;
    const result = esbuild.buildSync({
        entryPoints: [entrypoint],
        bundle: true,
        outfile: join(outdir, basename(entrypoint).replace(".ts", ".js")),
        minify: false,
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

    const analytisResult = esbuild.analyzeMetafileSync(JSON.stringify(result.metafile)).split("\n");
    console.log(
        analytisResult.slice(0, 10).join("\n")
    );
    console.log(`   ... and ${analytisResult.length - 11} more`);
    console.log();
}