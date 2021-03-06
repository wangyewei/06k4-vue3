/*
 * @Author: YeWei Wang
 * @Date: 2022-02-14 19:08:38
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 操作符
 * @LastEditTime: 2022-02-18 17:40:04
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\operations.ts
 */


export const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate' // 迭代
}

export const enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}