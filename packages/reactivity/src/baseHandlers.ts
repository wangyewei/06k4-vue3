/*
 * @Author: YeWei Wang
 * @Date: 2022-02-10 20:07:20
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 实现new Proxy(target, handler)
 * @LastEditTime: 2022-02-11 19:32:19
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\baseHandlers.ts
 */
import { isObject } from '@vue/shared'
import { reactive, readonly } from '.'
import {
  Target
} from './reactive'

/**
 * 拦截获取功能
 */
 function createGetter(isReadonly = false, shallow = false) {
  return function get(
    target: Target,
    key: string | symbol, // 源对象的某个属性
    receiver: object // 代理对象的本身
  ) {
    // reflect 
    // 后续object上的方法会被迁移到reflect
    // 以前target[key] = value方式设置可能会失败，并不会报异常，也没有返回值
    // reflect就被返回值
    // reflect使用可以不使用proxy
    const res = Reflect.get(target, key, receiver) // 反射 ~ target[key]

    if(!isReadonly) {
      return res
    }

    if(shallow) {
      return res
    }

    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
  }
}

/**
 * 拦截设置功能
 */

function createSetter(isShallow = false){
  return function set(
    target: Target,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {

    const result = Reflect.set(target, key, value, receiver) // target[key] = value

    return result
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

// 仅读的属性set报错 是否是深度

export const mutableHandlers: ProxyHandler<any> = {
  get,
  set
}

export const shallowHandlers = {
  get: shallowGet,
  set
}

export const readonlyHandlers:ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set opreation on key ${String(key)} failed: target is readonly.`,
      target
    )
    return true
  }
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    console.warn(`Set opreation on key ${String(key)} failed: target is readonly.`,
      target
    )
    return target
  }
}

