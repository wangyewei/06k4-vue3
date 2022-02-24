/*
 * @Author: YeWei Wang
 * @Date: 2022-02-11 23:47:13
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 依赖收集
 * @LastEditTime: 2022-02-24 22:06:31
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\effect.ts
 */

import { TrackOpTypes, TriggerOpTypes } from './operations'
import { extend, isArray, isIntegerKey, isMap } from "@vue/shared"
import { createDep, Dep } from './dep'

export type EffectScheduler = (...args: any[]) => any

export let /** 存储当前的Effect */ activeEffect: ReactiveEffect | undefined
export let /** 收集依赖 */ shouldTrack: Boolean = true
export class ReactiveEffect<T = any> {
  active = true
  deps = []
  parent: ReactiveEffect | undefined = undefined
  public onStop?: () => void
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null

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

  stop() {
    if (this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanUpEffect(this)
      // 执行传入的回调函数
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

export function cleanUpEffect(effect: ReactiveEffect) {
  const { deps } = effect
  deps.forEach((dep) => {
    dep.delete(effect)
  })
  deps.length = 0
}

export interface ReactiveEffectOptions {
  lazy?: boolean,
  scheduler?: EffectScheduler,
  onStop?: () => void
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
 * 键名所指的对象不计入垃圾回收机制
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

  }
}

export const ITERATE_KEY = Symbol('')
export const MAP_KEY_ITERATE_KEY = Symbol('')
// 找属性对应的effect让其执行
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
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    // 执行操作
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(target)) {
          // 如果添加了一个索引就触发长度的更新
          deps.push(depsMap.get('length'))
        }
        break

      case TriggerOpTypes.DELETE:
        if (isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
        }
    }
  }
  // 将要执行的所有effect全部存储到一个新的集合中
  // 最终一起执行
  const effects: ReactiveEffect[] = []

  for (const dep of deps) {
    if (dep) {
      effects.push(...dep)
    }
  }

  triggerEffects(createDep(effects))
}

/** 依赖更新重新执行effect */
export function triggerEffects(
  dep: Dep | ReactiveEffect[]
) {
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function trackEffects(
  dep: Dep
) {
  if(!dep.has(activeEffect!)) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
  }
}
