const args = require('minimist')(process.argv.slice(2));
const { build } = require('esbuild');
const {resolve} = require('path');
// minimist 是用来解析命令行参数的
console.log(args);
const target = args._[0] || 'reactivity';
const format = args.f || 'global';

// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
// iife 立即执行函数 （function(){})()
// cjs node 中的模块 commonJs  module.exports
// esm 浏览器中的es6 模块  import 
const outputFormat = format.startswith('global')? 'iife' : format === 'cjs' ? 'cjs'  : 'esm';
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
        onRebuild(error) {
            if(!error) {console.log('rebuild~~~~~')}
        }
    }
}).then(() => {
    console.log('watching~~~~~')
})