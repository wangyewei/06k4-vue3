/*
 * @Author: YeWei Wang
 * @Date: 2022-02-24 17:54:56
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: ref
 * @LastEditTime: 2022-02-24 22:08:41
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\ref.ts
 */

import {
  createDep,
  Dep
} from "./dep"
import {
  isObject
} from '@vue/shared'
import {
  reactive
} from '.'
import {
  activeEffect,
  shouldTrack,
  trackEffects
} from './effect'

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

export function toReactive(value: unknown) {
  return isObject(value) ? reactive(value) : value
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
    this._rawValue = value
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
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
  createRef(value, false)
}

