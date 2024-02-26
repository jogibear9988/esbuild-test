import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';
import * as path from 'path';

const cssResolvePlugin = {
    name: 'cssresolve',
    setup(build) {
        build.onResolve({ filter: /.*/ }, args => {
            if (args.kind == 'url-token')
                return { path: path.join(args.resolveDir, args.path) , namespace: 'cssresolveNS' }
            return null;
        })

        build.onLoad({ filter: /.*/, namespace: 'cssresolveNS' }, async args => {
            const css = await readFile(args.path, 'utf8');
            return { contents:css, loader: 'base64' };
        })
    }
}

const cssConstructStylesheetPlugin = {
    name: 'css imports',
    setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
            if (args.with.type === 'css') {
                const result = await esbuild.build({
                    bundle: true,
                    entryPoints: [args.path],
                    minify: build.initialOptions.minify,
                    plugins: [cssResolvePlugin],
                    write: false
                });
                const contents = `
        const styles = new CSSStyleSheet();
        styles.replaceSync(\`${result.outputFiles[0].text}\`);
        export default styles;`;
                return { contents, loader: 'js' };
            }
        });
    }
}

await esbuild.build({
    entryPoints: ['./dist/index.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    outfile: './dist/index-bundle.js',
    plugins: [cssConstructStylesheetPlugin],
});
