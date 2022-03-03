<!--
 * @Author: YeWei Wang
 * @Date: 2022-02-08 19:48:11
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: readme
 * @LastEditTime: 2022-03-03 14:11:35
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\README.md
-->

# 06k4-vue3

基于 typescript 实现简易版 vue3

✨ 类型完整

👏 注释清晰

🎈 深入 Vue 核心逻辑

## 响应式 API

### reactivity 响应式基础 API

💥 reactive 返回对象的响应式副本

💥 readonly 返回对象的只读代理

🚫 isProxy 检查对象是否由`reactive`或`readonly`创建的 proxy

🚫 isReactive 检查对象是否是由`reactive`创建的响应式代理

🚫 isReadonly 检查对象是否是由`readonly`创建的只读代理

💥 toRaw 返回`reactive`或`readonly`代理的原始对象

🚫 markRaw 标记一个对象，使其永远不会转换为 proxy。返回对象本身

💥 shallowReactive 创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)

💥 shallowReadonly 创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)

### Refs

💥 ref 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 .value property，指向该内部值

💥 unref 如果参数是一个 ref，则返回内部值，否则返回参数本身

💥 toRef 可以用来为源响应式对象上的某个 property 新创建一个 ref

🚫 toRefs

💥 isRef 检查一个值是否为 ref 对象

🚫 customRef

🚫 shallowRef

🚫 triggerRef

### Effect

💥 track 依赖收集

💥 trigger 依赖触发

💥 支持 effect.stop()

💥 支持 effect.scheduler()

#### 单模块调试

`yarn install`
`yarn run buuild`

```HTML
<body>
  <div id="app"></div>
  <button id="btn">counter++</button>
</body>
<script src="/node_modules/@vue/reactivity/dist/reactivity.global.js"></script>
<script>
  const { ref, effect } = VueReactivity

  let counter = ref(0)

  effect(() => {
    app.innerHTML = counter.value
  })

  btn.onclick = () => counter.value++
</script>


```
