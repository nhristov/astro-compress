import{deepmerge as a}from"deepmerge-ts";import s from"./lib/pipe-all.js";import e from"./options/index.js";function n(r={}){var p;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&r[t]==!0&&(r[t]=e()[t]);const o=a(e(),r);return o.path=(p=o.path)!=null&&p.endsWith("/")?o.path:`${o.path}/`,{name:"astro-compress",hooks:{"astro:config:done":async t=>{o.path=o.path?o.path:t.config.outDir.toString()},"astro:build:done":async()=>{await s(o,o.logger)}}}}export{n as default};
