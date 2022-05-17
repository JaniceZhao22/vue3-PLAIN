const args = require('minimist')(process.argv.slice(2));
const { build } = require('esbuild');
const { resolve} = require('path');
// minimist 是用来解析命令行参数的
const target = args._[0] || 'reactivity';
const format = args.f || 'global';

// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
// iife 立即执行函数 （function(){})()
// cjs node 中的模块 commonJs  module.exports
// esm 浏览器中的es6 模块  import 
const outputFormat = format.startsWith('global')? 'iife' : format === 'cjs' ? 'cjs'  : 'esm';
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);

// 本身就支持ts
build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true, // 把所有的打包在一起
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name, // 打包的全局的名字
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
        onRebuild(error) {
            if(!error) {console.log('rebuild~~~~~')}
        }
    }
}).then(() => {
    console.log('watching~~~~~')
})