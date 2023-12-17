import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

const cssConstructStylesheetPlugin = {
    name: 'css imports',
    setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
            if (args.with.type === 'css') {
                const css = await readFile(args.path, 'utf8');
                const fixedCss = css.replaceAll('`', '\\`').replaceAll(/\\(?:[1-7][0-7]{0,2}|[0-7]{2,3})/gm, '${\'\\$&\'}');
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
    format: 'esm',
    outfile: './dist/index-bundle.js',
    plugins: [cssConstructStylesheetPlugin],
});
