<!--
 * @Author: YeWei Wang
 * @Date: 2022-02-08 19:48:11
 * @WeChat: Studio06k4
 * @Motto: 求知若渴，虚心若愚
 * @Description: readme
 * @LastEditTime: 2022-03-01 15:56:09
 * @Version: 06k4 vue3
 * @FilePath: \06k4-vue3\README.md
-->

# 06k4-vue3

基于 typescript 实现简易版 vue3

✨ 类型完整

👏 注释清晰

🎈 深入 Vue 核心逻辑

#### reactivity 响应式系统

💥 reactive

💥 shallowReactive

💥 readonly

💥 shallowReadonly

💥 track 依赖收集

💥 trigger 依赖触发

💥 支持 effect.stop()

💥 支持 effect.scheduler()

💥 支持 ref()

##### 单模块调试

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
