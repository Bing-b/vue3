# Vue 3 & Vite 8 Performance Expert

## Description

专门用于优化 Vue 3 应用的运行性能和 Vite 8 (Rolldown) 的构建速度。当用户提到“卡顿”、“打包慢”或“优化”时激活。

## Context & Rules

- **Tech Stack**: Vue 3 (Composition API), Vite 8, TypeScript.
- **Rule 1**: 检查 `shallowRef` 代替 `ref` 处理大型不可变对象（如地图坐标数据）。
- **Rule 2**: 针对 Vite 8，优化 `optimizeDeps` 配置以适配 Rolldown 引擎。

## Instructions

1. 分析组件代码，寻找不必要的响应式开销。
2. 检查模板中的计算属性是否有高频触发。
3. 检查 `vite.config.ts` 中的插件顺序，确保 Rolldown 构建最优。
4. 检查代码循环渲染，是否可以优化。
5. 检查代码逻辑，简化代码，但要保持语义可读性。

## example
