/*
 * @Author: YeWei Wang
 * @Date: 2022-02-11 23:47:13
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: 依赖收集
 * @LastEditTime: 2022-02-12 00:12:49
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\packages\reactivity\src\effect.ts
 */

class ReactiveEffect<T = any> {
  constructor(
    public fn: () => T
  ) {

  }
  
  run() {

  }
}

export interface ReactiveEffectOptions {
  lazy?: boolean,
}
export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

/**
 * 需要让这个effect编程响应式的effect，可以做到数据变化重新执行
 */
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffectRunner{
  
  const _effect = new ReactiveEffect(fn)

  if(!options || !options.lazy) {
    _effect.run()
  }
  return '123' as unknown as ReactiveEffectRunner

}