/*
 * @Author: YeWei Wang
 * @Date: 2022-02-10 19:13:44
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: reactive api
 * @LastEditTime: 2022-03-02 17:38:35
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\reactive.ts
 */
import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadObly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.IS_SHALLOW]?: boolean;
  [ReactiveFlags.RAW]?: any;
}

export function reactive<T extends object>(target: T): any
export function reactive(target: object) {
  if(isReadonly(target)) {
    return target
  }
  return createReactiveObject(target, false, mutableHandlers);
}

export declare const ShallowReactiveMarker: unique symbol;

export type ShallowReactive<T> = T & { [ShallowReactiveMarker]?: true };

export function shallowReactive<T extends object>(
  target: T
): ShallowReactive<T> {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target: object) {
  return createReactiveObject(target, true, readonlyHandlers);
}

/**
 *  返回响应式对象根的副本
 *  属性是只读的，不能递归转换或延展
 *  返回properties
 *  用于有状态组件创建props代理对象
 */

export function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

// 类似于Map 存储的键名只能为对象
export const reactiveMap = new WeakMap<Target, any>();
export const shallowReactiveMap = new WeakMap<Target, any>();
export const readonlyMap = new WeakMap<Target, any>();
export const shallowReadonlyMap = new WeakMap<Target, any>();

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHanderls: ProxyHandler<any>,
) {
  if (!isObject(target)) {
    return target;
  }

  // const targetType = getTargetType(target)

  // 如果对象被代理就不需要再次被代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;

  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy; // 如果被代理就直接返回
  }
  const proxy = new Proxy(
    target,
    // targetType === TargetType.COLLECTION ?
    // collectionHandlers :
    baseHanderls
  );
  // 将要代理的对象和对应代理结果缓存起来
  proxyMap.set(target, proxy);

  return proxy;
}

export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

export function toReactive<T extends unknown>(target: T):T {
  return isObject(target) ? reactive((target as object)) : target
}

export function isReadonly(value: unknown):boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
