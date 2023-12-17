import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

const cssConstructStylesheetPlugin = {
    name: 'css imports',
    setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
            if (args.with.type === 'css') {
                const css = await readFile(args.path, 'utf8');
                let fixedCss = css.replaceAll('`', '\\`').replaceAll(/\\(?:[1-7][0-7]{0,2}|[0-7]{2,3})/gm, '${\'\\$&\'}');
                
                fixedCss = (await esbuild.transform(fixedCss, {
                    loader: 'css',
                    minify: build.initialOptions.minify,
                })).code;
                const contents = `
        const styles = new CSSStyleSheet();
        styles.replaceSync(\`${fixedCss}\`);
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
