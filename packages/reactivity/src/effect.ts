/*
 * @Author: YeWei Wang
 * @Date: 2022-02-11 23:47:13
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 依赖收集
 * @LastEditTime: 2022-02-12 00:40:44
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\effect.ts
 */

import { extend } from "@vue/shared"

class ReactiveEffect<T = any> {
  active = true
  constructor(
    public fn: () => T
  ) {

  }
  
  run() {
    if(!this.active) {
      return this.fn()
    }

    console.log('create effect')
    console.log(this.fn)
    return this.fn()
  }
}

export interface ReactiveEffectOptions {
  lazy?: boolean,
}
export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

/**
 * 需要让这个effect编程响应式的effect，可以做到数据变化重新执行
 */
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffectRunner{
  
  const _effect = new ReactiveEffect(fn)

  if(options) {
    extend(_effect, options)
  }

  if(!options || !options.lazy) {
    // console.log()
    _effect.run()
  }

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner

}