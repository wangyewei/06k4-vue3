/*
 * @Author: YeWei Wang
 * @Date: 2022-02-07 19:01:55
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 把packages目录下的所有模块打包
 * @LastEditTime: 2022-02-07 19:30:21
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\scripts\build.js
 * @Autor: YeWei Wang
 */

import * as fs from 'fs'
import { execa } from 'execa'

const targets = fs.readdirSync('packages').filter(f => {
  if(!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  return true
})

// 对目标一次并行打包
async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`],
  {stdio: 'inherit'}) // 当子进程打包的信息共享给父进程
}

function runParallel(targets, iteratorFn) {
  const res = []
  for(const item of targets) {
    const p = iteratorFn(item)
    res.push(p)
  }

  return Promise.all(res)
}

runParallel(targets, build)