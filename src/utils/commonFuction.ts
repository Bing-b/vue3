import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';

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

/**
 * 处理文件大小格式
 * @param size 
 * @returns 
 */
const formatSize = (size) => {
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const idx = Math.floor(Math.log(size) / Math.log(1024));
  const formattedSize = Number((size / Math.pow(1024, idx)).toFixed(2));
  return `${formattedSize} ${units[idx]}`;
};

// 处理el信息提示

const message = (type: string, message: string) => {
  ElMessage.closeAll();
  ElMessage({
    type: type as 'success' | 'warning' | 'info' | 'error',
    message 
  });
};

// 一键复制
const copyText = (text: string) => {
  const { toClipboard } = useClipboard();
  toClipboard(text)
    .then(() => {
      ElMessage.closeAll();
      ElMessage({
        message: '已复制到剪切板',
        duration: 1000,
        type: 'success',
      });
    })
    .catch(() => {
      ElMessage.closeAll();
      ElMessage({
        message: '复制失败',
        duration: 1000,
        type: 'info',
      });
    });
};

export default {
  getImg,
  formatSize,
  message,
  copyText
}