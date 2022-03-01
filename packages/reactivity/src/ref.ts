/*
 * @Author: YeWei Wang
 * @Date: 2022-02-24 17:54:56
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: ref
 * @LastEditTime: 2022-03-01 14:50:28
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\ref.ts
 */

import {
  hasChanged,
  isObject
} from '@vue/shared'
import {
  createDep,
  Dep
} from "./dep"
import {
  activeEffect,
  shouldTrack,
  trackEffects,
  triggerEffects
} from './effect'
import { toRaw, toReactive } from './reactive'

type RefBase<T> = {
  dep?: Dep
  value: T
}

export function trackRefValue(ref: RefBase<any>) {

  /** 初次获取 activeEffect不收集Effect
   *  当set是触发activeEffect收集effect
  */
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
      this.value = this.__v_isShallow ? newVal : toReactive(newVal)

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

export function ref<T extends object>(
  value: T
): T
export function ref(value?: unknown) {
  return createRef(value, false)
}

