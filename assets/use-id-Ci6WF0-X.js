import{At as e,F as t,j as n}from"./vue.runtime.esm-bundler-Cfm9BOCi.js";import{m as r,p as i}from"./core-DeN6tpiO.js";import{Lt as a,mn as o}from"./dist-BEb93Y-Z.js";var s={prefix:Math.floor(Math.random()*1e4),current:0},c=Symbol(`elIdInjection`),l=()=>n()?t(c,s):s,u=t=>{let n=l();!r&&n===s&&a(`IdInjection`,`Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);let c=o();return i(()=>e(t)||`${c.value}-id-${n.prefix}-${n.current++}`)};export{l as n,u as t};