var a=async(p,f={})=>{const i=p.options.input.file.split(".").pop();if(!i)return;const t={avci:"avif",avcs:"avif",avifs:"avif",heic:"heif",heics:"heif",heifs:"heif",jfif:"jpeg",jif:"jpeg",jpe:"jpeg",jpg:"jpeg"},e=typeof t[i]<"u"?t[i]:typeof f[i]<"u"?i:!1;if(["avif","gif","heif","jpeg","png","raw","tiff","webp"].includes(e)&&f[e]!==!1)return await p[e](f[e]).toBuffer()};export { a as default };

