/*
 * @Author: YeWei Wang
 * @Date: 2022-02-24 17:54:56
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: ref
 * @LastEditTime: 2022-02-24 18:21:24
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\ref.ts
 */

export interface Ref<T = any> {
  value: T
}

export function createRef(
  rawValue: unknown,
  shallow: boolean
) {
  
}

export function ref<T extends object>(
  value: T
): T
export function ref(value?: unknown) {

}

