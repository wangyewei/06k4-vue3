/*
 * @Author: YeWei Wang
 * @Date: 2022-02-10 20:07:20
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 实现new Proxy(target, handler)
 * @LastEditTime: 2022-02-17 00:05:52
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\baseHandlers.ts
 */
import { track } from './effect'
import { TrackOpTypes } from './operations'
import { isObject, extend, isArray, isIntegerKey, hasOwn } from '@vue/shared'
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

    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

/**
 * 拦截设置功能
 */

function createSetter(Shallow = false) {
  return function set(
    target: Target,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {

    let oldValue = /** 获取旧值*/(target as any)[key]

    // 判断值是新增还是老值修改
    const hadKey =
      isArray(target) && isIntegerKey(key) ?
        Number(key) < target.length :
        hasOwn(target, key)



    const result = Reflect.set(target, key, value, receiver) // target[key] = value

    if(!hadKey) {
      // 新增
    }
    /**
     * 区分是新增的 还是要修改的
     */

    // 当数据更新时， 通知对应的effect重新执行


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

export const shallowReactiveHandlers = extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set opreation on key ${String(key)} failed: target is readonly.`,
      target
    )
    return true
  }
}

export const shallowReadonlyHandlers = extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)

