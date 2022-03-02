/*
 * @Author: YeWei Wang
 * @Date: 2022-02-24 17:54:56
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: ref
 * @LastEditTime: 2022-03-02 23:33:26
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\ref.ts
 */

import {
  activeEffect,
  shouldTrack,
  trackEffects,
  triggerEffects
} from './effect'
import { hasChanged, IfAny } from '@vue/shared'
import { createDep, Dep } from "./dep"
import { toRaw, toReactive } from './reactive'

type RefBase<T> = {
  dep?: Dep
  value: T
}

export function trackRefValue(ref: RefBase<any>) {
  if (shouldTrack && activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

export interface Ref<T = any> {
  value: T
}

class refImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true
  constructor(
    value: T,
    public readonly __v_isShallow: boolean
  ) {

    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this)
    }
  }
}

export function triggerRefValue(ref: RefBase<any>) {
  ref = toRaw(ref)
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}

/**Refs API： 检查一个值是否为ref对象 */
export function isRef<T>(
  r: Ref<T> | unknown
): r is Ref<T>
export function isRef(
  r: any
): r is Ref {
  // !! 将非布尔值转换为布尔值
  return !!(r && r.__v_isRef === true)
}

export function createRef(
  rawValue: unknown,
  shallow: boolean
) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new refImpl(rawValue, shallow)
}

/**Refs API ref : 返回一个响应式ref对象 */
export function ref<T extends object>(
  value: T
): T
export function ref(value?: unknown) {

  // type anx = 0 extends 1 ? 'yes' : 'not'
  // console.log('-------', 0 extends (1))
  
  return createRef(value, false)
}

/**Refs API unref : 如果参数是一个 ref，则返回内部值，否则返回参数本身 */
export function unref<T>(ref: T | Ref<T>):T {
  return isRef(ref) ? ref.value : ref
}

/**Refs API toRef :  可以用来为源响应式对象上的某个 property 新创建一个 ref*/
export type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): ToRef<T[K]>

export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val) ? val : (0 as any)
}
// export function toRef() {

// }