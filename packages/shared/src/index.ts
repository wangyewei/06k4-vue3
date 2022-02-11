/*
 * @Author: YeWei Wang
 * @Date: 2022-02-08 19:39:15
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 公共方法
 * @LastEditTime: 2022-02-12 00:07:20
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\shared\src\index.ts
 */

// 判断是否为对象 Record 后面的泛型就是对象键和值的类型
// is 可以用来判断一个变量属于某个接口|类型
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown):string => objectToString.call(value)

export const extend = Object.assign

export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}