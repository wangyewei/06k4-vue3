/*
 * @Author: YeWei Wang
 * @Date: 2022-02-07 19:30:44
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: rollup 打包配置
 * @LastEditTime: 2022-02-07 19:54:54
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\rollup.config.js
 * @Autor: YeWei Wang
 */
import * as path from 'path'
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
// 根据环境变量的taeget属性获取对应模块中的package.json

const packagesDir = path.resolve(__dirname, 'packages')

const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)

const pkg = require(resolve('package.json'))

// 对打包类型做映射表、根据提供的formats来格式化需要打包的内容

const name = path.basename(packageDir)

const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  'cjs': {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife' // 立即执行函数
  }
}

const options = pkg.buildOptions // 再package.json中自定义的选项

function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true

  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      resolvePlugin()
    ]
  }
}

// roll up 需要导出配置
export default options.formats.map(format => createConfig(format, outputConfig[format]))