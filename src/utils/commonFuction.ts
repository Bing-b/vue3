
/**
 * 获取assets/images目录下url图片
 * @param url 
 * @returns 
 */
 const getImg =  (url:string) => {
  // const path = `/src/assets/images/${name}.png`;
  // const modules = await import.meta.glob(`/src/assets/images/*.png`); // 注意:import.meta.glob() 方法目前仅支持 Chrome 89+、Node.js 16.0.0+ 等比较新的环境
  // for await(const [key, module] of Object.entries(modules)) {
  //   if(key === path) return module.default; // 返回默认导出的图片地址
  // }
  // return null;

  return new URL(`../assets/images/${url}`, import.meta.url).href
}

export default {
  getImg,
}