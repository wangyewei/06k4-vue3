/*
 * @Author: YeWei Wang
 * @Date: 2022-02-10 19:13:44
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: reactive api
 * @LastEditTime: 2022-02-10 20:09:01
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\reactive.ts
 */


import {
  isObject,
  toRawType
} from "@vue/shared"
// 是否仅读、柯里化

import {
  mutableHandlers,
  shallowHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadObly',
    IS_SHALLOW = '__v_isShallow',
    RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP] ? : boolean,
  [ReactiveFlags.IS_REACTIVE] ? : boolean,
  [ReactiveFlags.IS_READONLY] ? : boolean,
  [ReactiveFlags.IS_SHALLOW] ? : boolean,
  [ReactiveFlags.RAW] ? : boolean
}

const enum TargetType {
  INVALID = 0,
    COMMON = 1,
    COLLECTION = 2
}

// WeakSet 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。在WeakSet的集合中是唯一的
function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'weakMap':
    case 'weakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

function getTargetType(value: Target) {
  // 是否跳过或者是否能添加属性
  // isExtensible判断一个对象是否可以添加属性
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value) ?
    TargetType.INVALID :
    targetTypeMap(toRawType(value))
}

export function reactive(target: object) {
  return createReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target: object) {
  return createReactiveObject(target, false, shallowHandlers)
}

export function readonly(target: object) {
  return createReactiveObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target: object) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}

// 会自动垃圾回收，不会造成内存泄露，存储的Key只能是对象
export const reactiveMap = new WeakMap<Target, any> ()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHanderls: ProxyHandler < any > ,
  collectionHandlers ? : ProxyHandler < any >
) {
  // 如果目标不是对象
  if (!isObject(target)) {
    return target
  }

  // const targetType = getTargetType(target)

  // 如果对象被代理就不需要再次被代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  
  const existingProxy = proxyMap.get(target)
  if(existingProxy) {
    return existingProxy // 如果被代理就直接返回
  }
  const proxy = new Proxy(
    target,
    // targetType === TargetType.COLLECTION ?
    // collectionHandlers :
    baseHanderls
  )
  // 将要代理的对象和对应代理结果缓存起来
  proxyMap.set(target, proxy)
}