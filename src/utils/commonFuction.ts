
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

const formatSize = (size) => {
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const idx = Math.floor(Math.log(size) / Math.log(1024));
  const formattedSize = Number((size / Math.pow(1024, idx)).toFixed(2));
  return `${formattedSize} ${units[idx]}`;
};

export default {
  getImg,
  formatSize
}