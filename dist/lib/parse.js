import u from "fast-glob";
import o from "fs";
import l from "./format-bytes.js";
var d=async(n,f=2,c="",m=async s=>s,p=async s=>await o.promises.readFile(s,"utf-8"))=>{const s=await u(n),t={files:0,total:0};for(const e of s)try{const i=(await o.promises.stat(e)).size,a=await m(await p(e));if(!a)continue;if(i>Buffer.byteLength(a)){await o.promises.writeFile(e,a,"utf-8");const r=(await o.promises.stat(e)).size;t.files++,t.total+=i-r,f>1&&console.info("\x1B[32mCompressed "+e.replace(/^.*[\\\/]/,"")+" for "+await l(i-r)+" ("+((i-r)/i*100).toFixed(2)+"% reduction).\x1B[39m")}}catch{console.log("Error: Cannot compress file "+e+"!")}f>0&&t.files>0&&console.info("\x1B[32mSuccessfully compressed a total of "+t.files+" "+c.toUpperCase()+" "+(t.files===1?"file":"files")+" for "+await l(t.total)+".\x1B[39m")};export { d as default };

