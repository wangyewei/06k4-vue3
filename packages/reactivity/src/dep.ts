/*
 * @Author: YeWei Wang
 * @Date: 2022-02-14 18:55:07
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 
 * @LastEditTime: 2022-02-16 01:01:02
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\dep.ts
 */

import { ReactiveEffect } from "./effect";


// export const initDepMarkers = ({deps}: ReactiveEffect) => {
//   if(deps.length) {
//     for(let i = 0; i < deps.length; i++) {
//       deps[i].w |= tracOpBit
//     }
//   }
// }

type TrackedMarkers = {
  // 已经收集过了
  w: number,
  // 新收集的
  n: number
}
export type Dep = Set<ReactiveEffect> & TrackedMarkers
// 用于存储所有的effect对象
export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep
  dep.w = 0
  dep.n = 0
  return dep
}