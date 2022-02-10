/*
 * @Author: YeWei Wang
 * @Date: 2022-02-10 20:07:20
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 实现new Proxy(target, handler)
 * @LastEditTime: 2022-02-11 02:13:45
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\baseHandlers.ts
 */


// 仅读的属性set报错 是否是深度

function createGetter(isReadonly = false, shallow = false) {
  return function get() {

  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, false)

export const mutableHandlers: ProxyHandler<any> = {
  get
}

export const shallowHandlers = {
  get: shallowGet,
  set(target, key) {
    console.warn(`Set opreation on key ${String(key)} failed: target is readonly.`,
      target
    )
    return target
  }
}

export const readonlyHandlers = {
  get: readonlyGet
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