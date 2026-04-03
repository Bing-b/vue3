import{A as e,P as t,kt as n}from"./vue.runtime.esm-bundler-CiLCEpfi.js";import{m as r,p as i}from"./core-D-XR8aNp.js";import{Rt as a,hn as o}from"./dist-DtQ4t5yF.js";var s={prefix:Math.floor(Math.random()*1e4),current:0},c=Symbol(`elIdInjection`),l=()=>e()?t(c,s):s,u=e=>{let t=l();!r&&t===s&&a(`IdInjection`,`Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);let c=o();return i(()=>n(e)||`${c.value}-id-${t.prefix}-${t.current++}`)};export{l as n,u as t};