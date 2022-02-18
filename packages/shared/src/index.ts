/*
 * @Author: YeWei Wang
 * @Date: 2022-02-08 19:39:15
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 公共方法
 * @LastEditTime: 2022-02-18 21:13:45
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\shared\src\index.ts
 */


/** 判断数据结构相关方法 */
// 判断是否为对象 Record 后面的泛型就是对象键和值的类型
// is 可以用来判断一个变量属于某个接口|类型

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isArray = Array.isArray
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isIntegerKey = /**是否为字符串数字 */ (key: unknown) => {
  return isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key
}
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
/**数据转换相关方法 */

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}

/**对象相关方法 */

export const extend = Object.assign
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

// 判断值是否修改
export const hasChanged = (
  value: any,
  oldValue: any
): boolean => {
  // Object.is 用于判断两个值是否相等
  return !Object.is(value, oldValue)
}
