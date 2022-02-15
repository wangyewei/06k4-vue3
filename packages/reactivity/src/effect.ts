/*
 * @Author: YeWei Wang
 * @Date: 2022-02-11 23:47:13
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 依赖收集
 * @LastEditTime: 2022-02-15 17:56:56
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\effect.ts
 */
import { TrackOpTypes } from './operations'
import { extend } from "@vue/shared"


export let /** 存储当前的Effect */ activeEffect: ReactiveEffect | undefined
export let /** 收集依赖 */ shouldTrack: Boolean = true
export class ReactiveEffect<T = any> {
  active = true
  deps = []
  parent: ReactiveEffect | undefined = undefined
  constructor(
    public fn: () => T
  ) {

  }

  run() {
    if (!this.active) {
      return this.fn()
    }

    let parent: ReactiveEffect | undefined = activeEffect
    let lastShouldTrack: Boolean = shouldTrack
    // dfs
    while (parent) {
      if (parent === this) {
        return
      }
      parent = parent.parent
    }
    try {

      /**
       * 执行的时候给全局的activeEffect赋值
       * 利用全局属性来获取当前的Effect
       */
      this.parent = activeEffect
      activeEffect = this
      shouldTrack = true

      // ;[this.parent, activeEffect] = [activeEffect, this]
      // 执行用户传入的fn
      return this.fn()
    } finally {

      // 重置
      activeEffect = this.parent
      shouldTrack = lastShouldTrack
      this.parent = undefined
    }

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
): ReactiveEffectRunner {

  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    _effect.run()
  }

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner

}

// 让对象中的某个属性 收集当前其对应的effect函数
// 拿到当前的effect
export function track(
  target: object,
  type: TrackOpTypes,
  key: unknown) {
  // 当前运行的effect
  activeEffect;
  console.log(
    target,
    type,
    key
  )
}