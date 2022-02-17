/*
 * @Author: YeWei Wang
 * @Date: 2022-02-11 23:47:13
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 依赖收集
 * @LastEditTime: 2022-02-17 20:38:42
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\effect.ts
 */

import { TrackOpTypes, TriggerOpTypes } from './operations'
import { extend, isArray } from "@vue/shared"
import { createDep, Dep } from './dep'


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

type KeyToDepMap = Map<any, any>
/**
 * weakMap结构类似于Map 但是只接收对象为键名
 * 键名所致的对象不计入垃圾回收机制
 */
const targetMap = /** 维护所有的依赖 */ new WeakMap<any, KeyToDepMap>()

// 让对象中的某个属性 收集当前其对应的effect函数 依赖收集
export function track(
  target: object,
  type: TrackOpTypes,
  key: unknown) {
  // 当前运行的effect
  if (activeEffect && shouldTrack) {

    let depsMap = targetMap.get(target)

    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)

    if (!dep) {
      depsMap.set(key, (dep = createDep()))
    }

    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
    }

    console.log('依赖收集', targetMap)
  }
}

// 依赖触发
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown
) {
  // 如果属性没有收集过Effect就不需要进行过任何操作
  const depsMap = targetMap.get(target)
  if (!depsMap) return;


  /**
   * 1. 看修改的是不是数组的长度，因为修改长度影响比较大
   *    - 
   */
  let deps: (Dep | undefined)[] = []

  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {

      if (key === 'length' || key > (newValue as number)) {
        deps.push(dep)
      }
    })
  } else {
    // 可能是对象
  }

  // if (deps.length === 1) {
  //   console.log('here')
  // } else {
  // 将要执行的所有effect全部存储到一个新的集合中
  // 最终一起执行
  const effects: ReactiveEffect[] = []

  for (const dep of deps) {
    if (dep) {
      effects.push(...dep)
    }
  }

  effects.forEach((effect: ReactiveEffect) => {
    effect.fn()
  })
  // }




  // console.log('依赖触发', target, type, key, newValue, oldValue)
}