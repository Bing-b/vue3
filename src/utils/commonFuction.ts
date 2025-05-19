import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';

/**
 * 获取assets/images目录下url图片
 * @param url
 * @returns
 */

const imageModules = import.meta.glob('../assets/images/**/*.*', { eager: true });

export const getImg = (url: string) => {
  const imagePath = `../assets/images/${url}`;
  const module = imageModules[imagePath];
  return module?.default || '';
};

/**
 * 处理文件大小格式
 * @param size
 * @returns
 */
const formatSize = (size: any) => {
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
    message,
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
  copyText,
};
