/*
 * @Author: YeWei Wang
 * @Date: 2022-02-08 19:48:11
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 导出响应式方法
 * @LastEditTime: 2022-03-02 21:40:51
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\index.ts
 */

export {
  reactive,
  shallowReactive,
  readonly,
  shallowReadonly
} from './reactive'

export {
  effect
} from './effect'

export {
  ref,
  isRef,
  unref
} from './ref'