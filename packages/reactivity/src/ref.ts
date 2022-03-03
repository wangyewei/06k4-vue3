/*
 * @Author: YeWei Wang
 * @Date: 2022-02-24 17:54:56
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: ref
 * @LastEditTime: 2022-03-03 15:11:14
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\ref.ts
 */

import {
  activeEffect,
  shouldTrack,
  trackEffects,
  triggerEffects
} from './effect'
import { hasChanged, IfAny, isArray } from '@vue/shared'
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
  return createRef(value, false)
}

/**Refs API unref : 如果参数是一个 ref，则返回内部值，否则返回参数本身 */
export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? ref.value : ref
}

/**Refs API toRef :  可以用来为源响应式对象上的某个 property 新创建一个 ref*/

class objectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    public readonly _object: T,
    public readonly _key: K,
    public readonly _defaultValue?: T[K]
  ){}

  get value():T[K] {
    const val = this._object[this._key]
    return val === undefined ? (this._defaultValue as T[K]) : val
  }

  set value(newVal) {
    this._object[this._key] = newVal 
  }
}

export type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultVAlue?: T[K]
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val) ? val : (new objectRefImpl(object, key, defaultVAlue) as any)
}

/**Refs API toRefs: 将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref */
export type ToRefs<T = any> = {
  [K in keyof T] : ToRef<T[K]>
}
export function toRefs<T extends object>(
  object: T
): ToRefs<T> { 
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for(const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret 
}

/**Refs API customRef: 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制 */

export type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T,
  set: (value: T) => void
}

class CustomRefImpl<T> {
  public dep? = undefined

  private _get: ReturnType<CustomRefFactory<T>>['get'] // ~ () => T
  private _set: ReturnType<CustomRefFactory<T>>['set'] // ~ (value: T) => void

  constructor(factory: CustomRefFactory<T>) {
    const {get, set} = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    )

    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}

export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl<T>(factory)
}